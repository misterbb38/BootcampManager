const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

//Mont routes
const bootcamps = require('./routes/bootcamps')

const morgan = require('morgan')
const colors = require('colors')

dotenv.config({ path: './config/config.env'})

// connect to db

connectDB()

const app = express()

// body parser
app.use(express.json())

// Dev logging middleware
if(process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))}

// mount route
app.use('/api/v1/bootcamps', bootcamps)

// error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`le server ecoute sur port ${PORT} est marche en mode de ${process.env.NODE_ENV}`.yellow.bold.underline))