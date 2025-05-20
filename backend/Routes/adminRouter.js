// Routes/adminRouter.js
const express = require('express');
const AdminController = require('../Controllers/AdminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, AdminController.getDashboardStats);
router.get('/users', authMiddleware, AdminController.manageUsers);
router.get('/listings', authMiddleware, AdminController.manageListings);
router.route('/events')
  .get(authMiddleware, AdminController.manageEvents)
  .post(authMiddleware, AdminController.manageEvents);
router.route('/events/:id')
  .put(authMiddleware, AdminController.manageEvents)
  .delete(authMiddleware, AdminController.manageEvents);
router.get('/reviews', authMiddleware, AdminController.manageReviews);
router.delete('/reviews/:id', authMiddleware, AdminController.manageReviews);

module.exports = router;
