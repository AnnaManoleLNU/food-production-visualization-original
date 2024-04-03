import express from 'express'
import createError from 'http-errors'

export const router = express.Router()

router.get('/', (req, res) => res.send('Hello, World!'))

router.post('/data', (req, res) => {
  
})

// Catch 404 (ALWAYS keep this as the last route).
router.use((req, res, next) => {
  next(createError(404))
})
  