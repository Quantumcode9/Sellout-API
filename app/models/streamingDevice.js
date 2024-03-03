const mongoose = require('mongoose');



const StreamingDeviceSchema = new mongoose.Schema({
  details: String,
  features: String,
  hdr: Boolean,
  hdrFormat: { type: String, enum: ['Dolby Vision', 'HDR 10+', 'HDR 10', 'null'] },
  image: String,
  image2: String,
  manufacturer: { type: String, enum: ['Roku', 'Amazon', 'Google', 'Apple', 'other', 'Nvidia'] },
  resolution: { type: String, enum: ['4K', '1080p', '720p', 'other'] },
  modelNumber: String,
  overallRating: Number,
  smartOS: { type: String, enum: ['Roku', 'Android', 'webOS', 'Tizen', 'FireOS', 'Google', 'Apple'] },
  name: { type: String, required: true, unique: true },
  regularPrice: Number,
  sku: Number,
  overview: String,
});


module.exports = mongoose.model('StreamingDevice', StreamingDeviceSchema);