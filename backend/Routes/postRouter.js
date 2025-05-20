// Routes/postRouter.js
const express = require('express');
const PostController = require('../Controllers/PostController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', PostController.getAllPosts);
router.get('/search', PostController.searchPosts);
router.get('/:id', PostController.getPostById);
router.get('/:propertyId/reviews', PostController.getPropertyReviews);
router.get('/events', PostController.getEvents);
router.get('/events/upcoming', PostController.getUpcomingEvents);
router.get('/events/:id', PostController.getEventById);

router.post('/', authMiddleware, PostController.createPost);
router.put('/:id', authMiddleware, PostController.updatePost);
router.delete('/:id', authMiddleware, PostController.deletePost);
router.post('/:propertyId/reviews', authMiddleware, PostController.addReview);
router.post('/:propertyId/book', authMiddleware, PostController.bookProperty);

module.exports = router;
