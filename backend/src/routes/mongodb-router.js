import express from 'express'
import { MongoDbController } from '../controllers/mongodb-controller.js'

export const mongodbRouter = express.Router()

const controller = new MongoDbController()

// POST /mongodb
mongodbRouter.post('/', (req, res, next) => {
  // Require authorization especially if public API - TODO!!!
  controller.uploadDataToDatabase(req, res, next)
})