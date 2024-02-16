const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()


// get cart items by user id and populates the cart
// returns the user object with the cart array
router.get('/cart', requireToken, (req, res, next) => {
    User.findById(req.user.id)
      .populate('cart')
      .then(user => res.status(200).json({ cart: user.cart }))
      .catch(next);
  });


//adds items to the cart by user id and tv id then saves the user 
//returns the user object with the new cart array 
router.post('/add-to-cart', requireToken, (req, res, next) => {
    const tvId = req.body.tvId;
    
    User.findById(req.user.id)
      .then(user => {
        if (user.cart.includes(tvId)) {
          throw new Error('Item already in cart');
        } else {
        user.cart.push(tvId);
        return user.save();
        }
      })
      .then(user => res.status(200).json({ user: user.toObject() }))
      .catch(next);
  });

//deletes items from the cart by user id and tv id then save the user
router.delete('/delete-from-cart', requireToken, (req, res, next) => {
  const tvId = req.body.tvId;
  
  User.findById(req.user.id)
    .then(user => {
      const index = user.cart.indexOf(tvId);
      if (index !== -1) {
        user.cart.splice(index, 1);
        return user.save();
      } else {
        throw new Error('Item not found in cart');
      }
    })
    .then(user => res.status(200).json({ user: user.toObject() }))
    .catch(next);
});

module.exports = router;