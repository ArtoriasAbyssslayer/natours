const mongoose = require('mongoose');
const slugify = require('slugify');
const { getAllReviews } = require('../controllers/reviewController');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater or equal than 1.0'],
      max: [5, 'Rating must be less or equal than 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.6667 -> 4.7, 46.67 -> 47 -> 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: 'Discount price {{VALUE}} should be below regural price',
        validator: function (val) {
          // this only points to current doc on New document creation
          return val < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    // imageCover: {
    //   type: {
    //     data: Buffer,
    //     contentType: String,
    //   },
    //   required: [true, 'A tour must have a cover image'],
    // },
    // images: [
    //   {
    //     data: Buffer,
    //     contentType: String,
    //   },
    // ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  // schema options
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// sorting price index in ascending order (-1 for descending)
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
// virtual properties used to convert pre-existing properties - they do not exist in the database - they are created when the data is retrieved - so they cannot be used in queries //
tourSchema.virtual('durationWeeks').get(
  // use of regural function instead so we get the [this] keyword
  function () {
    return this.duration / 7;
  },
);
// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// mongoDb middleware
// DOCUMENT MIDDLEWARE: runs before .save() and .create() (not update)
// pre-save 'save' hook

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//embedding pre-save hook
// tourSchema.pre('save', async function(next){
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });


// DOCUMENT MIDDLEWARE: QUERY MIDDLEWARE
// hook 'find'
// regural expression /^find/ all the strings that start with find (find,findOne,etc.)
tourSchema.pre(/^find/, function (next) {
  //this points to the query
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// Aggregation middleware before or after an aggregation happens
tourSchema.pre('aggregate', function (next) {
  if (!this.pipeline()[0].$geoNear) {
    this.pipeline().unshift({
      $match: { secretTour: { $ne: true } },
    });
  }
  
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
