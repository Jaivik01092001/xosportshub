const ErrorResponse = require("../utils/errorResponse");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { validationResult } = require("express-validator");

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "buyer",
        select: "firstName lastName email",
      })
      .populate({
        path: "seller",
        select: "firstName lastName email",
      })
      .populate("order")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: "buyer",
        select: "firstName lastName email",
      })
      .populate({
        path: "seller",
        select: "firstName lastName email",
      })
      .populate("order");

    if (!payment) {
      return next(
        new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is payment buyer or seller or admin
    if (
      payment.buyer._id.toString() !== req.user.id &&
      payment.seller._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this payment`,
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private/Buyer
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { orderId } = req.body;

    // Get order
    const order = await Order.findById(orderId).populate("content");

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${orderId}`, 404)
      );
    }

    // Make sure user is order buyer
    if (order.buyer.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to pay for this order`,
          403
        )
      );
    }

    // Check if order is already paid
    if (order.paymentStatus === "Completed") {
      return next(new ErrorResponse(`Order is already paid`, 400));
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        contentId: order.content._id.toString(),
        buyerId: req.user.id,
        sellerId: order.seller.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private/Buyer
exports.confirmPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { paymentIntentId, orderId } = req.body;

    // Get order
    const order = await Order.findById(orderId);

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${orderId}`, 404)
      );
    }

    // Make sure user is order buyer
    if (order.buyer.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to confirm payment for this order`,
          403
        )
      );
    }

    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return next(new ErrorResponse(`Payment has not been completed`, 400));
    }

    // Update order
    order.paymentStatus = "Completed";
    order.paymentIntentId = paymentIntentId;
    order.status = "Completed";
    await order.save();

    // Create payment record
    const payment = await Payment.create({
      order: orderId,
      buyer: order.buyer,
      seller: order.seller,
      amount: order.amount,
      platformFee: order.platformFee,
      sellerEarnings: order.sellerEarnings,
      paymentMethod: "card",
      paymentIntentId,
      status: "Completed",
      payoutStatus: "Pending",
    });

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Process Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
exports.webhook = async (req, res, next) => {
  try {
    let event;

    if (process.env.NODE_ENV === "development") {
      // 🔓 Bypass signature verification in development
      event = req.body;
    } else {
      // 🔐 Verify signature in production
      const sig = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        const order = await Order.findById(orderId);

        if (order) {
          order.paymentStatus = "Completed";
          order.paymentIntentId = paymentIntent.id;
          order.status = "Completed";
          await order.save();

          const existingPayment = await Payment.findOne({
            paymentIntentId: paymentIntent.id,
          });

          if (!existingPayment) {
            await Payment.create({
              order: orderId,
              buyer: order.buyer,
              seller: order.seller,
              amount: order.amount,
              platformFee: order.platformFee,
              sellerEarnings: order.sellerEarnings,
              paymentMethod: "card",
              paymentIntentId: paymentIntent.id,
              status: "Completed",
              payoutStatus: "Pending",
            });
          }
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Get buyer payments
// @route   GET /api/payments/buyer
// @access  Private/Buyer
exports.getBuyerPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ buyer: req.user.id })
      .populate("order")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller payments
// @route   GET /api/payments/seller
// @access  Private/Seller
exports.getSellerPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ seller: req.user.id })
      .populate("order")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Process payout
// @route   POST /api/payments/:id/payout
// @access  Private/Admin
exports.processPayout = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return next(
        new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if payment is completed
    if (payment.status !== "Completed") {
      return next(
        new ErrorResponse(`Payment must be completed to process payout`, 400)
      );
    }

    // Check if payout is already processed
    if (payment.payoutStatus === "Completed") {
      return next(new ErrorResponse(`Payout has already been processed`, 400));
    }

    // Get seller
    const seller = await User.findById(payment.seller);

    if (!seller) {
      return next(
        new ErrorResponse(`Seller not found with id of ${payment.seller}`, 404)
      );
    }

    // Check if seller has Stripe Connect ID
    if (!seller.paymentInfo || !seller.paymentInfo.stripeConnectId) {
      return next(
        new ErrorResponse(
          `Seller does not have payment information set up`,
          400
        )
      );
    }

    // Process payout through Stripe
    const payout = await stripe.transfers.create({
      amount: Math.round(payment.sellerEarnings * 100), // Convert to cents
      currency: "usd",
      destination: seller.paymentInfo.stripeConnectId,
      transfer_group: `ORDER_${payment.order}`,
    });

    // Update payment
    payment.payoutStatus = "Completed";
    payment.payoutId = payout.id;
    payment.payoutDate = Date.now();
    await payment.save();

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};
