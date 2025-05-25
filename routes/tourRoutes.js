const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const bookingController = require('./../controllers/bookingController');
// router.param('id',tourController.checkID);

// Nested routes
router.use('/:tourId/reviews', reviewRouter);
// /tours/:tourId/bookings
router.get(
  '/:tourId/bookings',
  bookingController.getBookingsByTour,
);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

// /tours-within?distance=233&center=-40,45&uint=miles
// /tours-within/233/center/-40,45/unit/miles
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
// ### API ROUTES FOR GETTING IMAGE DATA FROM DB #### 
// router.get('/tours/:id/cover', tourController.getTourCoverImage);
// router.get('/tours/:id/images/:index', tourController.getTourImage);
router
  .route('/:id')
  .get(tourController.getTourByID)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.patchTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
