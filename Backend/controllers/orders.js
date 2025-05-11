const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/Order');
const Content = require('../models/Content');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Bid = require('../models/Bid');
const CustomRequest = require('../models/CustomRequest');
const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'buyer',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'seller',
        select: 'firstName lastName email'
      })
      .populate('content');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'buyer',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'seller',
        select: 'firstName lastName email'
      })
      .populate('content');

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is order owner or seller or admin
    if (
      order.buyer._id.toString() !== req.user.id &&
      order.seller._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this order`,
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Buyer
exports.createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { contentId, orderType, bidId, customRequestId } = req.body;

    // Check if user is a buyer
    if (req.user.role !== 'buyer' && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to create an order`, 403)
      );
    }

    // Get content
    const content = await Content.findById(contentId);
    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${contentId}`, 404)
      );
    }

    // Check if content is published
    if (content.status !== 'Published') {
      return next(
        new ErrorResponse(`Content is not available for purchase`, 400)
      );
    }

    // Get seller
    const seller = await User.findById(content.seller);
    if (!seller) {
      return next(
        new ErrorResponse(`Seller not found with id of ${content.seller}`, 404)
      );
    }

    // Calculate amount based on order type
    let amount = 0;
    
    if (orderType === 'Fixed') {
      // Fixed price order
      amount = content.price;
    } else if (orderType === 'Auction') {
      // Auction order
      if (!bidId) {
        return next(
          new ErrorResponse(`Bid ID is required for auction orders`, 400)
        );
      }

      const bid = await Bid.findById(bidId);
      if (!bid) {
        return next(
          new ErrorResponse(`Bid not found with id of ${bidId}`, 404)
        );
      }

      // Check if bid belongs to the user
      if (bid.bidder.toString() !== req.user.id) {
        return next(
          new ErrorResponse(`User is not authorized to use this bid`, 403)
        );
      }

      // Check if bid is for the correct content
      if (bid.content.toString() !== contentId) {
        return next(
          new ErrorResponse(`Bid is not for the specified content`, 400)
        );
      }

      // Check if bid is active
      if (bid.status !== 'Won') {
        return next(
          new ErrorResponse(`Bid is not in a winning state`, 400)
        );
      }

      amount = bid.amount;
    } else if (orderType === 'Custom') {
      // Custom request order
      if (!customRequestId) {
        return next(
          new ErrorResponse(`Custom request ID is required for custom orders`, 400)
        );
      }

      const customRequest = await CustomRequest.findById(customRequestId);
      if (!customRequest) {
        return next(
          new ErrorResponse(`Custom request not found with id of ${customRequestId}`, 404)
        );
      }

      // Check if custom request belongs to the user
      if (customRequest.buyer.toString() !== req.user.id) {
        return next(
          new ErrorResponse(`User is not authorized to use this custom request`, 403)
        );
      }

      // Check if custom request is accepted
      if (customRequest.status !== 'Accepted') {
        return next(
          new ErrorResponse(`Custom request is not in an accepted state`, 400)
        );
      }

      amount = customRequest.sellerResponse.price;
    } else {
      return next(
        new ErrorResponse(`Invalid order type`, 400)
      );
    }

    // Calculate platform fee (get from settings)
    const platformFeePercentage = process.env.PLATFORM_COMMISSION || 10;
    const platformFee = (amount * platformFeePercentage) / 100;
    const sellerEarnings = amount - platformFee;

    // Create order
    const order = await Order.create({
      buyer: req.user.id,
      seller: content.seller,
      content: contentId,
      orderType,
      amount,
      platformFee,
      sellerEarnings,
      bidId,
      customRequestId,
      status: 'Pending',
      paymentStatus: 'Pending'
    });

    // Generate invoice
    const invoiceUrl = await generateInvoice(order);
    
    // Update order with invoice URL
    order.invoiceUrl = invoiceUrl;
    await order.save();

    // If custom request, update its status
    if (customRequestId) {
      await CustomRequest.findByIdAndUpdate(customRequestId, {
        status: 'Completed',
        orderId: order._id
      });
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
      );
    }

    // Only admin can update order status
    if (req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this order`,
          403
        )
      );
    }

    // Update fields
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get buyer orders
// @route   GET /api/orders/buyer
// @access  Private/Buyer
exports.getBuyerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate({
        path: 'seller',
        select: 'firstName lastName email'
      })
      .populate('content')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller orders
// @route   GET /api/orders/seller
// @access  Private/Seller
exports.getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate({
        path: 'buyer',
        select: 'firstName lastName email'
      })
      .populate('content')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Download content
// @route   GET /api/orders/:id/download
// @access  Private/Buyer
exports.downloadContent = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('content');

    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is order owner
    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to download this content`,
          403
        )
      );
    }

    // Check if payment is completed
    if (order.paymentStatus !== 'Completed') {
      return next(
        new ErrorResponse(`Payment must be completed to download content`, 400)
      );
    }

    // Update download count
    order.downloadCount += 1;
    order.lastDownloaded = Date.now();
    await order.save();

    // Redirect to content file URL
    res.status(200).json({
      success: true,
      data: {
        downloadUrl: order.content.fileUrl
      }
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to generate invoice
const generateInvoice = async (order) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();
    const invoiceFileName = `invoice-${order._id}.pdf`;
    const invoicePath = path.join('uploads', invoiceFileName);
    
    // Pipe the PDF to a file
    doc.pipe(fs.createWriteStream(invoicePath));
    
    // Add content to the PDF
    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Buyer ID: ${order.buyer}`);
    doc.text(`Seller ID: ${order.seller}`);
    doc.moveDown();
    doc.text(`Content ID: ${order.content}`);
    doc.text(`Order Type: ${order.orderType}`);
    doc.moveDown();
    doc.text(`Amount: $${order.amount.toFixed(2)}`);
    doc.text(`Platform Fee: $${order.platformFee.toFixed(2)}`);
    doc.text(`Seller Earnings: $${order.sellerEarnings.toFixed(2)}`);
    doc.moveDown();
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.text(`Order Status: ${order.status}`);
    
    // Finalize the PDF
    doc.end();
    
    // Return the invoice URL
    return `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}localhost:${process.env.PORT}/uploads/${invoiceFileName}`;
  } catch (error) {
    console.error('Error generating invoice:', error);
    return null;
  }
};
