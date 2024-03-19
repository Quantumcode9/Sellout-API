const mongoose = require('mongoose');


const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)


const DetailsSchema = new mongoose.Schema({
  name: String,
  value: String,
  // values: [String]
});

const FeaturesSchema = new mongoose.Schema({
  feature: String
});

const ProductSchema = new mongoose.Schema({
  details: [DetailsSchema],
  features: [FeaturesSchema],
  category: { type: String },
  image: String,
  image2: String,
  manufacturer: String,
  modelNumber: String,
  name: { type: String, required: true, unique: true },
  regularPrice: Number,
  salePrice: Number,
  sku: Number,
  upc: String,
  reviews: [reviewSchema],
});


module.exports = mongoose.model('Product', ProductSchema);

