/**
 * Mongoose configuration.
 *
 * @author Anna Manole
 * @version 1.0.0
 */

import mongoose from 'mongoose'

/**
 * Establishes a connection to a database.
 *
 * @returns {Promise} Resolves to this if connection succeeded.
 */
export const connectDB = async () => {
  const { connection } = mongoose

  // Bind connection to events (to get notifications).
  connection.on('connected', () => console.log('MongoDB connection opened.'))
  connection.on('error', err => console.error(`MongoDB connection error occurred: ${err}`))
  connection.on('disconnected', () => console.log('MongoDB is disconnected.'))

  // If the Node.js process ends, close the connection.
  process.on('SIGINT', async () => {
    try {
      // Close the MongoDB connection.
      await connection.close()
      
      // Exit the process after cleanup.
      process.exit(0)
    } catch (err) {
      console.error('Error during disconnection and cleanup:', err)
      process.exit(1)
    }
  })

  // Connect to the server.
  return mongoose.connect(process.env.DB_CONNECTION_STRING)
}
