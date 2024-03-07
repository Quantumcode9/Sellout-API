const mongoose = require('mongoose');

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
});


module.exports = mongoose.model('Product', ProductSchema);

