const mongoose = require('mongoose');
const db = require('../../config/db'); 
const MONGODB_URI = process.env.MONGODB_URI || db;


const TV = require('./TV.js');


const startTVs = [
    {
      modelNumber: "55Q70C",
      size: 55,
      type: "QLED",
      refreshRate: 120,
      highDynamicRangeFormat: "HDR10+",
      brand: "Samsung",
    },
    {
      modelNumber: "OLED65C3",
      size: 65,
      type: "OLED",
      refreshRate: 120,
      highDynamicRangeFormat: "Dolby Vision",
      brand: "LG",
    }
  ];

  mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
  .then(() => {
      console.log('MongoDB connected successfully.');


              TV.create(startTVs) 
                  .then(newTVs => {
                      console.log('New TVs added to db:', newTVs);
                      mongoose.connection.close(); 
                  })
                  .catch(error => {
                      console.error('An error occurred while adding new TVs:', error);
                      mongoose.connection.close(); 
                  });
          })
          .catch(error => {
              console.error('An error occurred while deleting TVs:', error);
              mongoose.connection.close(); 
          });
