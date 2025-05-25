const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');
const router = express.Router();

router.post('/signup', authController.signup, authController.verifyEmail);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/emailVerification/:token', authController.verifyEmailToken);

//Protect all routes after this middleware
router.use(authController.protect);
// /users/:userId/bookings
router.get(
  ':userId/bookings',
  bookingController.getBookingsByUser,
);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.preprocUserPhoto,
  userController.updateCurrentUser,
);
router.delete('/deleteMe', userController.deleteMe);

//Restrict all the routes below to admin
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
