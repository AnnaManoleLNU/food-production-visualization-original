import express from 'express'
import createError from 'http-errors'
import { DataController } from '../controllers/data-controller.js'

export const router = express.Router()

const controller = new DataController()

router.get('/', (req, res) => res.send('Hello, World!'))

router.post('/data', (req, res, next) => {
  // Require authorization especially if public API - TODO!!!
  controller.uploadDataToDatabase(req, res, next)
})

// MORE ENDPOINTS DEPENDING ON WHAT MY APP IS TO DO - TODO!!!

// Catch 404 (ALWAYS keep this as the last route).
router.use((req, res, next) => {
  next(createError(404))
})
  