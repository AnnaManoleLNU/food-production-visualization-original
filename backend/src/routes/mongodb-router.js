import express from 'express'
import { MongoDbController } from '../controllers/mongodb-controller.js'
import { authorize } from '../config/authorize.js'

export const mongodbRouter = express.Router()
const controller = new MongoDbController()

// POST /mongodb
mongodbRouter.post('/', authorize, (req, res, next) => {
  controller.uploadDataToDatabase(req, res, next)
})