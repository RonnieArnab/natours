const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Tours must require a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name should have less than or equal to 40 character'],
      minlength: [10, 'A tour name should have greater than or equal to 10 character']
      // validate : [validator.isAlpha , 'Tour name should contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tours must require a durations']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tours must require a maximum group Size']
    },
    difficulty: {
      type: String,
      required: [true, 'Tours must require a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy , medium , difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tours must require a price']
    },
    priceDiscount: {
      type: Number,
        //this will only works for create tours not for update tours
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'price should be greater than discounted price ({VALUE})'
      }
    },
    summary: {
      type: String,
      trim: true

    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      trim: true
    },
    images: {
      type: [String]
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: {
      type: [Date]
    },
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});


//Document middleware runs before the save() command .create() command

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save',function(next){
//     console.log('Will save the document......');
//     next() ;
// })
//
// tourSchema.post('save',function(doc,next){
//     console.log(doc) ;
//     next() ;
// })


//Query Middleware
// tourSchema.pre('find',function(next){
//tourSchema.pre('findOne',function(next){

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//aggregation middleware

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } }
  });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;