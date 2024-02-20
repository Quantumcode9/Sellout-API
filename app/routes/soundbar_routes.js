const express = require('express')
const passport = require('passport')
const TV = require('../models/TV')
const Soundbar = require('../models/soundbar')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

///////////////////////////////////////////////////////
// routes go here 
///////////////////////////////////////////////////////


router.post('/soundbars', requireToken, (req, res, next) => {
	req.body.soundbar.owner = req.user.id
	Soundbar.create(req.body.soundbar)
		.then((soundbar) => {
			res.status(201).json({ soundbar: soundbar.toObject(), message: 'Soundbar successfully created!' });
		})
		.catch(next)
}

)

// INDEX
// GET /soundbars
router.get('/soundbars', (req, res, next) => {
	Soundbar.find()
		.then((soundbars) => {
			return soundbars.map((soundbar) => soundbar.toObject())
		})
		.then((soundbars) => res.status(200).json({ soundbars: soundbars }))
		.catch(next)
})


// SHOW
// GET
router.get('/soundbars/:id', (req, res, next) => {
	Soundbar.findById(req.params.id)
		.then(handle404)
		.then((soundbar) => res.status(200).json({ soundbar: soundbar.toObject() }))
		.catch(next)
})




// UPDATE
router.patch('/soundbars/:id', requireToken, removeBlanks, (req, res, next) => {

	Soundbar.findById(req.params.soundbarId)
		.then(handle404)
		.then((soundbar) => {
			requireOwnership(req, soundbar)
			return soundbar.updateOne(req
				.body.soundbar)
		})
		.then(() => res.sendStatus(204))
		.catch(next)

})


// DELETE
router.delete('/soundbars/:id', requireToken, (req, res, next) => {
	Soundbar.findById(req.params.id)
		.then(handle404)
		.then((soundbar) => {
			requireOwnership(req, soundbar)
			soundbar.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})
