const express = require('express');
const { check } = require('express-validator');
const {
  getAllContent,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  getSellerContent
} = require('../controllers/content');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

const router = express.Router();

// Public routes
router.get('/', getAllContent);
router.get('/:id', getContent);

// Protected routes
router.use(protect);

// Seller routes
router.get('/seller/me', authorize('seller'), getSellerContent);

router.post(
  '/',
  authorize('seller'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('sport', 'Sport is required').not().isEmpty(),
    check('contentType', 'Content type is required').not().isEmpty(),
    check('fileUrl', 'File URL is required').not().isEmpty(),
    check('difficulty', 'Difficulty level is required').not().isEmpty(),
    check('saleType', 'Sale type is required').not().isEmpty()
  ],
  createContent
);

router.route('/:id')
  .put(authorize('seller', 'admin'), updateContent)
  .delete(authorize('seller', 'admin'), deleteContent);

// File upload route
router.post(
  '/upload',
  protect,
  authorize('seller'),
  upload.single('file'),
  (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        fileUrl: req.file.location || `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      }
    });
  }
);

module.exports = router;
