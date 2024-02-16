'use strict'

require('dotenv').config()


const database = {
	development: process.env.MONGODB_URI,
	test: process.env.MONGODB_URI,
}

const localDb = process.env.TESTENV ? database.test : database.development

const currentDb = process.env.MONGODB_URI || localDb

module.exports = currentDb
