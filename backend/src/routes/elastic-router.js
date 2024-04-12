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
  controller.getAllDataYear2018(req, res, next)
})

// Endpoint to get all country names from Elasticsearch. /elastic/countries
elasticRouter.get('/countries', (req, res, next) => {
  controller.getAllCountryNames(req, res, next)
})

// Endpoint to get all food names from Elasticsearch. /elastic/foods
elasticRouter.get('/foods', (req, res, next) => {
  controller.getAllFoodNames(req, res, next)
})

// Endpoint to get all data for a specific country from Elasticsearch. /elastic/countries/:country
elasticRouter.get('/countries/:country', (req, res, next) => {
  controller.getDataForCountry(req, res, next)
})

// Delete data from Elasticsearch. /elastic
elasticRouter.delete('/', (req, res, next) => {
  // Require authorization especially if public API - TODO!!!
  controller.deleteDataFromElasticSearch(req, res, next)
})