import express from 'express'
import createError from 'http-errors'
import { elasticRouter } from './elastic-router.js'
import { mongodbRouter } from './mongodb-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.send('This is the start of the backend for WT2, web for data science.'))

router.use('/elastic', elasticRouter)
router.use('/mongodb', mongodbRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use((req, res, next) => {
  next(createError(404))
})
  