const express = require('express');
const passport = require('passport')
const StreamingDevice = require('../models/streamingDevice');
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()


// POST request to add a new device
router.post('/device', requireToken, (req, res, next) => {
    req.body.device.owner = req.user.id
    StreamingDevice.create(req.body.device)
        .then((device) => {
        res.status(201).json({ device: device.toObject(), message: 'Device successfully created!' });
        })
        .catch(next)
    }
)

// GET request to fetch all devices
router.get('/devices', (req, res, next) => {
    StreamingDevice.find()
        .then((devices) => {
        return devices.map((device) => device.toObject())
        })
        .then((devices) => res.status(200).json({ devices: devices }))
        .catch(next)
})

// GET request to fetch a single device
router.get('/devices/:id', (req, res, next) => {
    StreamingDevice.findById(req.params.id)
        .then(handle404)
        .then((device) => res.status(200).json({ device: device.toObject() }))
        .catch(next)
})

// PATCH request to update a device
router.patch('/devices/:id', requireToken, removeBlanks, (req, res, next) => {

    StreamingDevice.findById(req.params.deviceId)
        .then(handle404)
        .then((device) => {
        requireOwnership(req, device)
        return device.updateOne(req.body.device)
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE request to delete a device
router.delete('/devices/:id', requireToken, (req, res, next) => {
    StreamingDevice.findById(req.params.deviceId)
        .then(handle404)
        .then((device) => {
        requireOwnership(req, device)
        device.deleteOne()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})



module.exports = router;