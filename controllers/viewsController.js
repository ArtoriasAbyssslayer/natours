const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get all the tour data from collection
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render that template using the tour data from step 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get data for requested review
  tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2) Build template
  
  // 3) Render Template usiung th
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings   
  const bookings = await Booking.find({ user: req.user.id });
  // 2) Find tours with the booked IDs
  const tourIds = bookings.map(booking => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  // 3) Render the tours page with the tours
  res.status(200).render('overview', {
    title: 'My Tours',
    user: req.user,
    tours,
  });
});

exports.getLoginForm = (req, res) => {
  // Render the login template
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: `Create New Account to natours.io`,
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: `Your Account`,
    user: req.user,
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getResetPasswordForm = (req, res) => {
  if (!res.locals.user) {
    // only if no user connected we can access to this page
    const token = req.params.token;
    res.status(200).render('resetPassword', {
      title: 'Set your new password',
      token,
    });
  } else {
    res.redirect('/');
  }
};

exports.getForgotPassword = async (req, res, next) => {
  res.render('forgetPassword',{
    title: 'Forgot your password?',
    message: 'Please provide your email address to receive a password reset link.',
  });
  next();
};

