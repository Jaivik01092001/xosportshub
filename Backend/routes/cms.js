const express = require('express');
const { check } = require('express-validator');
const {
  getPages,
  getPublishedPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  contactForm
} = require('../controllers/cms');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/published', getPublishedPages);
router.get('/:slug', getPage);

router.post(
  '/contact',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  contactForm
);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getPages)
  .post(
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
      check('status', 'Status must be either Draft or Published').isIn(['Draft', 'Published'])
    ],
    createPage
  );

router.route('/:id')
  .put(updatePage)
  .delete(deletePage);

module.exports = router;
