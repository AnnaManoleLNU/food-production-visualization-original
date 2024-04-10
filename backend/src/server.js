/**
 * The starting point of the application.
 *
 * @author Anna Manole
 * @version 1.0.0
 */

import express from 'express'
import logger from 'morgan'
import helmet from 'helmet'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import cors from 'cors'

try {
  // Connect to database.
  await connectDB()

  const app = express()

  // Parse requests of the content type application/json before the routes are registered.
  app.use(express.json())

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  app.use(helmet())

  app.use(cors({
    // Allow requests from the frontend.
    origin: 'http://localhost:3000'
  }))

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    // Production error handling.
    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status)
        .json({
          status_code: err.status,
          message: err.message
        })
    }

    // Development error handling.
    return res
      .status(err.status)
      .json({
        status_code: err.status,
        message: err.message,
        cause: err.cause
          ? {
            status: err.cause.status,
            message: err.cause.message,
            stack: err.cause.stack
          }
          : null,
        stack: err.stack
      })
  })

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })


} catch (err) {
  console.error(err)
  process.exitCode = 1
}