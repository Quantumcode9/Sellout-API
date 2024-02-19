// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// require route files
const tvRoutes = require('./app/routes/tv_routes')
const soundbarRoutes = require('./app/routes/soundbar_routes')
const userRoutes = require('./app/routes/user_routes')
const cartRoutes = require('./app/routes/cart_routes')
const productRoutes = require('./app/routes/product_routes')


// require middleware
const errorHandler = require('./lib/error_handler')
const replaceToken = require('./lib/replace_token')
const requestLogger = require('./lib/request_logger')

const db = require('./config/db')

const auth = require('./lib/auth')

const serverDevPort = 8000
 const clientDevPort = 3000

mongoose.connect(db, {
	useNewUrlParser: true,
})

const app = express()

app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}`,
	})
)
const port = process.env.PORT || serverDevPort

app.use(replaceToken)

// register passport authentication middleware
app.use(auth)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(requestLogger)


app.use(tvRoutes)
app.use(soundbarRoutes)
app.use(userRoutes)
app.use(cartRoutes)
app.use(productRoutes)

app.use(errorHandler)

// app.listen(port, '0.0.0.0', () => {
//     console.log(`Server is running on port ${port}`);
// });

app.listen(port, () => {
	console.log('listening on port ' + port)
})

module.exports = app