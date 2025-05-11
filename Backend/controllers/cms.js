const ErrorResponse = require('../utils/errorResponse');
const CmsPage = require('../models/CmsPage');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all CMS pages
// @route   GET /api/cms
// @access  Private/Admin
exports.getPages = async (req, res, next) => {
  try {
    const pages = await CmsPage.find()
      .populate({
        path: 'createdBy',
        select: 'firstName lastName'
      })
      .populate({
        path: 'updatedBy',
        select: 'firstName lastName'
      })
      .sort('title');

    res.status(200).json({
      success: true,
      count: pages.length,
      data: pages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get published CMS pages
// @route   GET /api/cms/published
// @access  Public
exports.getPublishedPages = async (req, res, next) => {
  try {
    const pages = await CmsPage.find({ status: 'Published' })
      .select('title slug metaTitle metaDescription')
      .sort('title');

    res.status(200).json({
      success: true,
      count: pages.length,
      data: pages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single CMS page by slug
// @route   GET /api/cms/:slug
// @access  Public
exports.getPage = async (req, res, next) => {
  try {
    const page = await CmsPage.findOne({ slug: req.params.slug });

    if (!page) {
      return next(
        new ErrorResponse(`Page not found with slug of ${req.params.slug}`, 404)
      );
    }

    // If page is draft and user is not admin, return 404
    if (page.status === 'Draft' && (!req.user || req.user.role !== 'admin')) {
      return next(
        new ErrorResponse(`Page not found with slug of ${req.params.slug}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: page
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create CMS page
// @route   POST /api/cms
// @access  Private/Admin
exports.createPage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;

    const page = await CmsPage.create(req.body);

    res.status(201).json({
      success: true,
      data: page
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update CMS page
// @route   PUT /api/cms/:id
// @access  Private/Admin
exports.updatePage = async (req, res, next) => {
  try {
    let page = await CmsPage.findById(req.params.id);

    if (!page) {
      return next(
        new ErrorResponse(`Page not found with id of ${req.params.id}`, 404)
      );
    }

    // Add user to req.body
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = Date.now();

    page = await CmsPage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: page
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete CMS page
// @route   DELETE /api/cms/:id
// @access  Private/Admin
exports.deletePage = async (req, res, next) => {
  try {
    const page = await CmsPage.findById(req.params.id);

    if (!page) {
      return next(
        new ErrorResponse(`Page not found with id of ${req.params.id}`, 404)
      );
    }

    await page.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit contact form
// @route   POST /api/cms/contact
// @access  Public
exports.contactForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    try {
      // Send email to admin
      await sendEmail({
        email: process.env.EMAIL_FROM,
        subject: `Contact Form: ${subject}`,
        message: `
          Name: ${name}
          Email: ${email}
          
          Message:
          ${message}
        `
      });

      // Send confirmation email to user
      await sendEmail({
        email,
        subject: 'Your message has been received',
        message: `
          Dear ${name},
          
          Thank you for contacting us. We have received your message and will respond to you as soon as possible.
          
          Regards,
          XO Sports Hub Team
        `
      });

      res.status(200).json({
        success: true,
        data: 'Email sent'
      });
    } catch (err) {
      console.log(err);
      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
};
