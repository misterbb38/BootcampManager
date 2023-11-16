const express = require('express')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env'})

const app = express()

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`le server ecoute sur port ${PORT} est marche en mode de ${process.env.NODE_ENV}`))