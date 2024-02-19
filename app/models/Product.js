const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
  name: String,
  value: String,
  values: [String]
});

const FeaturesSchema = new mongoose.Schema({
  feature: String
});

const ProductSchema = new mongoose.Schema({
  details: [DetailsSchema],
  features: [FeaturesSchema],
  image: String,
  manufacturer: String,
  modelNumber: String,
  name: String,
  regularPrice: Number,
  salePrice: Number,
  sku: Number,
  upc: String,
});


module.exports = mongoose.model('Product', ProductSchema);

// const TVSchema = new mongoose.Schema({
//   products: [ProductSchema]
// });

// module.exports = mongoose.model('TV', TVSchema);