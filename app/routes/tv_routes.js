const express = require('express')

const passport = require('passport')

const TV = require('../models/TV')
const Review = TV.Review;

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()







router.post('/tvs', requireToken, (req, res, next) => {
	req.body.tv.owner = req.user.id
	TV.create(req.body.tv)
	  .then((tv) => {
		res.status(201).json({ tv: tv.toObject(), message: 'TV successfully created!' });
	  })
	  .catch(next)
  })
  
  // Error handling middleware
  router.use((err, req, res, next) => {
	res.status(500).json({ error: err.message });
  });





// INDEX
// GET /tvs
router.get('/tvs', (req, res, next) => {
	TV.find()
        .populate('owner')
		.then((tvs) => {
			return tvs.map((tv) => tv.toObject())
		})
		.then((tvs) => res.status(200).json({ tvs: tvs }))
		.catch(next)
})


router.get('/tvs/mine', requireToken, (req, res, next) => {
	TV.find({ owner: req.user.id })
		.then((tvs) => {

			return tvs.map((tv) => tv.toObject())
		})
		.then((tvs) => res.status(200).json({ tvs: tvs }))
		.catch(next)
})

// SHOW
// GET 
router.get('/tvs/:id', (req, res, next) => {
	TV.findById(req.params.id)
        .populate('owner')
		.then(handle404)
		.then((tv) => res.status(200).json({ tv: tv.toObject() }))
		.catch(next)
})

// CREATE
// POST /tvs

// UPDATE
// PATCH 
router.patch('/tvs/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.tv.owner

	TV.findById(req.params.id)
		.then(handle404)
		.then((tv) => {
			requireOwnership(req, tv)

			return tv.updateOne(req.body.tv)
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DELETE 
router.delete('/tvs/:id', requireToken, (req, res, next) => {
	TV.findById(req.params.id)
		.then(handle404)
		.then((tv) => {
			requireOwnership(req, tv)
			tv.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})



// CREATE REVIEW

router.post('/tvs/:id/reviews', requireToken, (req, res, next) => {
	const reviewData = req.body.review;
	const tvId = req.params.id;
  
	TV.findById(tvId)
	  .then(handle404)
	  .then(tv => {
		tv.reviews.push(reviewData);
		return tv.save();
	  })
	  .then(tv => res.status(201).json({ tv: tv.toObject() }))
	  .catch(next);
  });

// UPDATE REVIEW NOT WORKING

router.patch('/tvs/:tvId/reviews/:reviewId', requireToken, (req, res, next) => {
    const { tvId, reviewId } = req.params;
    const reviewUpdates = req.body.review; 

    TV.findById(tvId)
        .then(tv => {
            if (!tv) {
                return res.status(404).json({ message: "TV not found" });
            }
            const review = tv.reviews.find(r => r._id.toString() === reviewId);
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }

            Object.keys(reviewUpdates).forEach(key => {
                review[key] = reviewUpdates[key];
            });

            return tv.save();
        })
        .then(() => res.status(200).json({ message: "Review updated successfully" }))
        .catch(next);
});



  // DELETE REVIEW

  router.delete('/tvs/:tvId/reviews/:reviewId', requireToken, (req, res, next) => {
    const { tvId, reviewId } = req.params;
    
	TV.findById(tvId)
    .then(tv => {
        if (!tv) {
            return res.status(404).json({ message: "TV not found" });
        }
        tv.reviews = tv.reviews.filter(r => r._id.toString() !== reviewId);
        
        return tv.save();
    })
    .then(() => res.status(204).send())
    .catch(next);
});





module.exports = router
