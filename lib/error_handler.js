// This middleware handles errors and sends a JSON response to the client
module.exports = function (err, req, res, next) {
	// LOG ERRORS

	if (!process.env.TESTENV) {
		console.log('\n', new Date().toTimeString() + ':')

		console.error(err)
	}

	// HTTP RESPONSES

	if (err.name.match(/Valid/) || err.name === 'MongoError') {

		const message = 'The receieved params failed a Mongoose validation'
		err = { status: 422, message }
	} else if (err.name === 'DocumentNotFoundError') {
		err.status = 404
	} else if (err.name === 'CastError' || err.name === 'BadParamsError') {
		err.status = 422
	} else if (err.name === 'BadCredentialsError') {
		err.status = 401
	}

	res.status(err.status || 500).json(err)
}
