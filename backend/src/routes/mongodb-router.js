import express from 'express'
import { MongoDbController } from '../controllers/mongodb-controller.js'

export const mongodbRouter = express.Router()

const controller = new MongoDbController()

// Middleware to check API key
const authorize = (req, res, next) => {
  // Custom header for API key
  const apiKey = req.get('X-API-Key')
  const knownApiKey = process.env.KNOWN_API_KEY

  if (!apiKey || apiKey !== knownApiKey) {
      return res.status(401).json({ error: 'Unauthorized' })
  }

  next()
}

// POST /mongodb
mongodbRouter.post('/', authorize, (req, res, next) => {
  controller.uploadDataToDatabase(req, res, next)
})