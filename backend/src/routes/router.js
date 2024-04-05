import express from 'express'
import createError from 'http-errors'
import { DataController } from '../controllers/data-controller.js'

export const router = express.Router()

const controller = new DataController()

router.get('/', (req, res) => res.send('Hello, World!'))

router.post('/data', (req, res, next) => {
  controller.uploadDataToDatabase(req, res, next)
})

// Catch 404 (ALWAYS keep this as the last route).
router.use((req, res, next) => {
  next(createError(404))
})
  