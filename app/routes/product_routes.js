const express = require('express')
const passport = require('passport')
const axios = require('axios')
require('dotenv').config()
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const Product = require('../models/Product')

const router = express.Router()



router.get('/search/:keyword', (req, res, next) => {
  axios.get(`https://api.bestbuy.com/v1/products((search=${req.params.keyword})&onlineAvailability=true&condition=new)?apiKey=${process.env.BEST_BUY_API_KEY}&&sort=bestSellingRank.asc&show=details.name,dollarSavings,features.feature,image,inStoreAvailability,manufacturer,modelNumber,name,onlineAvailability,onSale,percentSavings,regularPrice,salePrice,sku,upc,details.value&facet=bestSellingRank,20&pageSize=5&format=json`)
    .then((response) => {
      res.status(200).json({ products: response.data.products })
    })
    .catch(next)
})


router.get('/laptop/deals', (req, res, next) => {
  axios.get(`https://api.bestbuy.com/v1/products(onlineAvailability=true&condition=new&onSale=true&percentSavings>30&(categoryPath.id=abcat0502000))?apiKey=${process.env.BEST_BUY_API_KEY}&sort=dollarSavings.dsc&show=categoryPath.id,categoryPath.name,details.name,details.value,dollarSavings,features.feature,image,inStoreAvailability,manufacturer,modelNumber,name,regularPrice,salePrice,sku,upc&facet=onSale,10&pageSize=4&format=json`)
    .then((response) => {
      res.status(200).json({ products: response.data.products })
    })
    .catch(next)
}
)

router.get('/streaming/deals', (req, res, next) => {
  axios.get(`https://api.bestbuy.com/v1/products(onlineAvailability=true&condition=new&onSale=true&percentSavings>30&(categoryPath.id=pcmcat161100050040))?apiKey=${process.env.BEST_BUY_API_KEY}&sort=dollarSavings.dsc&show=categoryPath.id,categoryPath.name,details.name,details.value,dollarSavings,features.feature,image,inStoreAvailability,manufacturer,modelNumber,name,regularPrice,salePrice,sku,upc&facet=onSale,10&pageSize=4&format=json`)
    .then((response) => {
      res.status(200).json({ products: response.data.products })
    })
    .catch(next)
}
)

router.get('/tv/deals', (req, res, next) => {
  axios.get(`https://api.bestbuy.com/v1/products(onlineAvailability=true&condition=new&onSale=true&percentSavings>30&(categoryPath.id=abcat0101000))?apiKey=${process.env.BEST_BUY_API_KEY}&sort=dollarSavings.dsc&show=categoryPath.id,categoryPath.name,details.name,details.value,dollarSavings,features.feature,image,inStoreAvailability,manufacturer,modelNumber,name,regularPrice,salePrice,sku,upc&facet=onSale,10&pageSize=4&format=json`)
    .then((response) => {
      res.status(200).json({ products: response.data.products })
    })
    .catch(next)
}
)


router.get('/products/:id', (req, res, next) => {
  Product.findById(req.params.id)
    .then(handle404)
    .then(product => res.status(200).json({ product: product.toObject() }))
    .catch(next)
}
)


router.get('/products', (req, res, next) => {
  Product.find()
    .then(products => {
      return products.map(product => product.toObject())
    })
    .then(products => res.status(200).json({ products: products }))
    .catch(next)
}
)


router.post('/products', (req, res, next) => {
  const productData = req.body.product;

  Product.findOneAndUpdate(
    { name: productData.name }, 
    productData, 
    { new: true, upsert: true, runValidators: true }
  )
    .then(product => res.status(201).json({ product: product.toObject() }))
    .catch((error) => {
      if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Product name already exists'))
      } else {
        next(error)
      }
    });
});

router.patch('/products/:id', requireToken, removeBlanks, (req, res, next) => {
  Product.findById(req.params.id)
    .then(handle404)
    .then(product => {
      requireOwnership(req, product)
      return product.updateOne(req.body.product)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.post('/products', (req, res) => {
  const newProduct = new Product(req.body);

  newProduct.save()
    .then(product => res.json(product))
    .catch(err => res.status(400).json('Error: ' + err));
});







module.exports = router;


