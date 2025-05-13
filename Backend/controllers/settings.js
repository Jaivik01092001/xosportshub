const ErrorResponse = require("../utils/errorResponse");
const Setting = require("../models/Setting");
const { validationResult } = require("express-validator");

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find();

    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public settings
// @route   GET /api/settings/public
// @access  Public
exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find({ isPublic: true });

    // Convert to key-value object
    const settingsObj = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });

    res.status(200).json({
      success: true,
      data: settingsObj,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single setting
// @route   GET /api/settings/:id
// @access  Private/Admin
exports.getSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findById(req.params.id);

    if (!setting) {
      return next(
        new ErrorResponse(`Setting not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create setting
// @route   POST /api/settings
// @access  Private/Admin
exports.createSetting = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Add user to req.body
    req.body.updatedBy = req.user.id;

    const setting = await Setting.create(req.body);

    res.status(201).json({
      success: true,
      data: setting,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update setting
// @route   PUT /api/settings/:id
// @access  Private/Admin
exports.updateSetting = async (req, res, next) => {
  try {
    let setting = await Setting.findById(req.params.id);

    if (!setting) {
      return next(
        new ErrorResponse(`Setting not found with id of ${req.params.id}`, 404)
      );
    }

    // Add user to req.body
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = Date.now();

    setting = await Setting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete setting
// @route   DELETE /api/settings/:id
// @access  Private/Admin
exports.deleteSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findByIdAndDelete(req.params.id);

    if (!setting) {
      return next(
        new ErrorResponse(`Setting not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update multiple settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateMultipleSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;

    if (!settings || !Array.isArray(settings)) {
      return next(new ErrorResponse("Settings array is required", 400));
    }

    const updatedSettings = [];

    for (const settingData of settings) {
      const { key, value } = settingData;

      if (!key) {
        return next(new ErrorResponse("Setting key is required", 400));
      }

      // Find setting by key
      let setting = await Setting.findOne({ key });

      if (setting) {
        // Update existing setting
        setting.value = value;
        setting.updatedBy = req.user.id;
        setting.updatedAt = Date.now();
        await setting.save();
      } else {
        // Create new setting
        setting = await Setting.create({
          key,
          value,
          updatedBy: req.user.id,
          group: settingData.group || "general",
          isPublic: settingData.isPublic || false,
          description: settingData.description || "",
        });
      }

      updatedSettings.push(setting);
    }

    res.status(200).json({
      success: true,
      count: updatedSettings.length,
      data: updatedSettings,
    });
  } catch (err) {
    next(err);
  }
};
