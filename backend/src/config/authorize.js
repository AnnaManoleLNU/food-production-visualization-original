// Middleware to check API key for sensitives requests such as posting data and deleting data.
export const authorize = (req, res, next) => {
  // Custom header for API key
  const apiKey = req.get('X-API-Key')
  const knownApiKey = process.env.KNOWN_API_KEY

  if (!apiKey || apiKey !== knownApiKey) {
      return res.status(401).json({ error: 'Unauthorized' })
  }

  next()
}