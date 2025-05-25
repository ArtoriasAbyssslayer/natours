const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
// --- Route handlers ---
exports.getAllTours = factory.getAll(Tour);
exports.getTourByID = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.patchTour = factory.updateOne(Tour);

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
//  1-> upload.single // req.file
//  Multiple[single name] -> upload.array('images', 5); // req.files
// mix of them upload.fields // req.files
//  Alias route Middleware
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    }),
  );
  next();
});


// #### HANDLING IMAGES IN DB #### 
// exports.resizeTourImages = catchAsync(async (req, res, next) => {
//   if (!req.files.imageCover || !req.files.images) return next();

//   // Cover image
//   const imageCoverBuffer = await sharp(req.files.imageCover[0].buffer)
//     .resize(2000, 1333)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toBuffer();

//   req.body.imageCover = {
//     data: imageCoverBuffer,
//     contentType: 'image/jpeg'
//   };

//   // Other images
//   req.body.images = await Promise.all(
//     req.files.images.map(async file => {
//       const imageBuffer = await sharp(file.buffer)
//         .resize(2000, 1333)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toBuffer();

//       return {
//         data: imageBuffer,
//         contentType: 'image/jpeg'
//       };
//     })
//   );

//   next();
// });
// exports.getTourImage = catchAsync(async (req, res, next) => {
//   const { id, index } = req.params;

//   const tour = await Tour.findById(id).select('images');

//   if (
//     !tour ||
//     !tour.images ||
//     !Array.isArray(tour.images) ||
//     !tour.images[index] ||
//     !tour.images[index].data
//   ) {
//     return res.status(404).send('Image not found');
//   }
//   if (!tour.images[index] || !tour.images[index].data) {
//   return res.sendFile(path.join(__dirname, '../public/img/default.jpg'));
//   }
//   res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
//   res.set('Content-Type', tour.images[index].contentType);
//   res.send(tour.images[index].data);
// });
// exports.getTourCoverImage = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).select('imageCover');

//   if (!tour || !tour.imageCover || !tour.imageCover.data) {
//     return res.status(404).send('Cover image not found');
//   }
//   res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
//   res.set('Content-Type', tour.imageCover.contentType);
//   res.send(tour.imageCover.data);
// });
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: {
        _id: { $ne: 'EASY' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // transforms it to a number from string
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        // id is used to tell the key to group with

        _id: { $month: '$startDates' },
        // add the number 1 for each tour passes the aggregation pipe
        numTourStarts: { $sum: 1 },
        tourNames: { $push: '$name' },
      },
    },
    {
      $addFields: {
        monthName: {
          $arrayElemAt: [
            [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
            { $subtract: ['$_id', 1] },
          ],
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
        month: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // convert distance to radiants -> distance/radius_of_earth
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longtitude in the format lat,lng.',
      ),
      400,
    );
  }
  console.log(distance, lat, lng, unit);

  let filter = {
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  };
  const tours = await Tour.find(filter);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371192 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longtitude in the format lat,lng.',
      ),
      400,
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1], //multiply by 1 to convert lng,lat to number
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
