// Routes/userRouter.js
const express = require('express');
const UserController = require('../Controllers/UserController');
const AuthController = require('../Controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/users/auth/register', AuthController.register.bind(AuthController));
router.post('/users/auth/login', AuthController.login.bind(AuthController));
router.post('/users/auth/forgot-password', AuthController.forgotPassword.bind(AuthController));
router.post('/users/auth/reset-password', AuthController.resetPassword.bind(AuthController));

router.get('/me', authMiddleware, AuthController.getCurrentUser.bind(AuthController));
router.put('/:id', authMiddleware, UserController.updateUser.bind(UserController));
router.delete('/:id', authMiddleware, UserController.deleteUser.bind(UserController));
router.get('/bookings', authMiddleware, UserController.getUserBookings.bind(UserController));
router.get('/reviews', authMiddleware, UserController.getUserReviews.bind(UserController));

router.get('/properties', authMiddleware, UserController.getUserProperties.bind(UserController));
router.get('/property-bookings', authMiddleware, UserController.getOwnerBookings.bind(UserController));
router.put('/bookings/:id/status', authMiddleware, UserController.updateBookingStatus.bind(UserController));

module.exports = router;
