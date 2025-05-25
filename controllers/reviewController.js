const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const bookings = require('./../models/bookingModel');
const AppError = require('./../utils/appError');2
const catchAsync = require('./../utils/catchAsync');
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.checkIfUserHasBookedTour = catchAsync(async (req, res, next) => {
  // Check if the user has booked the tour
  const booking = await bookings.findOne({
    user: req.user.id,
    tour: req.body.tour,
  });

  if (!booking) {
    return next(
      new AppError('You can only review tours that you have booked.', 403)
    );
  }
  next();
});
// optional middleware to delete all reviews for a specific tour
exports.deleteAllReviews = factory.deleteAll(Review);
