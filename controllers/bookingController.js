const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const factory = require('./handlerFactory');

// #CRUD operations for Booking
exports.createBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour

  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price * 0.88}`,
    // Using 0.88 to convert EUR to USD, adjust as necessary
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 0.88 * 100, // Convert to cents
        },
        quantity: 1, // Assuming one tour per booking
      },
    ],
    mode: 'payment',
  });

  // 3) Send session back to client as a response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This middleware is only used in development, not in production!
  // unsecure everyone can create a booking by just visiting the URL with query params
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  // Create a new booking in the database 
  const booking = await Booking.create({
    tour,
    user,
    price,
  });
  res.redirect(301,  req.originalUrl.split('?')[0]);
});

exports.getBookingsByUser = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.params.userId })
    .populate({
      path: 'tour',
      select: 'name price',
    });
  res.status(200).json({
    status: 'success',
    data: {
      bookings,
    },
  });
});
exports.getBookingsByTour = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ tour: req.params.tourId })
    .populate({
      path: 'user',
      select: 'name photo',
    });
  res.status(200).json({
    status: 'success',
    data: {
      bookings,
    },
  });
});