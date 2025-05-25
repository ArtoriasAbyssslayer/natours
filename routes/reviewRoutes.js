const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');


const router = express.Router({ mergeParams: true });

// POST /tour/:tourId/reviews
// POST /reviews
// GET /reviews
router.use(authController.protect);
router.get(
  '/tour/:tourId/review/:reviewId',
  authController.restrictTo('user', 'admin'),
  reviewController.getReview,
)
// optional middleware to delete all reviews on a specific tour
router.delete(
  '/',
  authController.restrictTo('admin'),
  reviewController.deleteAllReviews
);


router.get(
  '/:id',
  authController.restrictTo('user', 'admin'),
  reviewController.getReview,
);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user', 'admin'),
    reviewController.setTourUserIds,
    reviewController.checkIfUserHasBookedTour,
    reviewController.createReview,
  );

router
  .route('/:id')
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
