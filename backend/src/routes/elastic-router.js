import express from 'express'
import { ElasticController } from '../controllers/elastic-controller.js'

export const elasticRouter = express.Router()

const controller = new ElasticController()

// Endpoint to post data to Elasticsearch. /elastic
elasticRouter.post('/', (req, res, next) => {
  // Require authorization especially if public API - TODO!!!
  controller.uploadDataToElasticSearch(req, res, next)
})

// Endpoint to get data from Elasticsearch. /elastic
elasticRouter.get('/', (req, res, next) => {
  // Require authorization especially if public API - TODO!!!
  controller.getDataFromElasticSearch(req, res, next)
})

// Delete data from Elasticsearch. /elastic
elasticRouter.delete('/', (req, res, next) => {
  // Require authorization especially if public API - TODO!!!
  controller.deleteDataFromElasticSearch(req, res, next)
})