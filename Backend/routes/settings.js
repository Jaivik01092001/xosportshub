const express = require('express');
const { check } = require('express-validator');
const {
  getSettings,
  getPublicSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  updateMultipleSettings
} = require('../controllers/settings');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public', getPublicSettings);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getSettings)
  .put(updateMultipleSettings)
  .post(
    [
      check('key', 'Setting key is required').not().isEmpty(),
      check('value', 'Setting value is required').exists(),
      check('group', 'Group must be a valid option').isIn([
        'general',
        'payment',
        'email',
        'content',
        'user'
      ])
    ],
    createSetting
  );

router.route('/:id')
  .get(getSetting)
  .put(updateSetting)
  .delete(deleteSetting);

module.exports = router;
