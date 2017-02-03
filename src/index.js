import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import passport from 'passport'
import apiRoutes from './routes'
import { database } from './config/database'
import jwtAuthorize from './config/passport'

const port = process.env.PORT || 3000

const app = express()

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// log to console
app.use(morgan('dev'))

// Use the passport package in our application
app.use(passport.initialize())

// demo Route (GET http://localhost:3000)
app.get('/', (req, res) => {
  res.send(`Hello! The API is at http://localhost:${port}/api`)
})

// Start the server
app.listen(port)
console.log(`Started server at: http://localhost:${port}`)

// connect to database
mongoose.connect(database)

// pass passport for configuration
jwtAuthorize(passport)

// connect the api routes under /api/*
app.use('/api', apiRoutes)
