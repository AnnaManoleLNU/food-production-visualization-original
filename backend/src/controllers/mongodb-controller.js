import fs from 'fs-extra'
import { Country } from '../models/country.js'
import { getNames } from 'country-list'

/**
 * Controller that handles requests related to MongoDB.
 */
export class MongoDbController {
  /**
   * Uploads data to the MongoDB database by reading the data from the world_food_production.json file. Filers out the data for the year 2018 and Entity (Country) names that are not valid according to the country-list package.
   *
   * @param {*} req - Request object.
   * @param {*} res - Response object.
   * @param {*} next - Next middleware function.
   */
  async uploadDataToDatabase(req, res, next) {
    try {
      const countriesData = await fs.readJSON('./world_food_production.json')

      const insertData = []

      countriesData.forEach(element => {
        // if it's a valid country name with data for 2018
        if (this.#isValidCountry(element.Entity) && element.Year === "2018") {         
          const name = element.Entity
          const year = 2018
  
          for (const [key, value] of Object.entries(element)) {
            // Skip Entity and Year because there's only one of those
            if (key !== 'Entity' && key !== 'Year') {
              //The food name is before the word "Production"
              const foodName = this.#extractFoodName(key)
              // Remove commas and convert to number
              const foodQuantityInTons = parseInt(value.replace(/,/g, ''), 10)

              const yearFoodProduction = new Date(Date.UTC(year, 0, 1));
  
              insertData.push({
                name: name,
                foodName,
                foodQuantityInTons,
                yearFoodProduction: yearFoodProduction
              })
            }
          }
        }
      })

      await Country.insertMany(insertData)

      res.status(200).json({
        message: "Data uploaded successfully",
        totalDocuments: insertData.length
      })

    } catch (error) {
      console.error('Error uploading data to database:', error)
      res.status(500).json({ message: "Error uploading data to the database", error: error.message })
    }
  }

  /**
   * Checks if a country name is valid.
   *
   * @param {String} countryName - The name of the country to check if it's valid.
   * @returns 
   */
  #isValidCountry(countryName) {
    return getNames().includes(countryName)
  }

  /**
   * Extracts the food name from the key.
   *
   * @param {String} key - The key to extract the food name from.
   * @returns - The food name.
   */
  #extractFoodName(key) {
    // Use a regular expression to match everything before "Production"
    const match = key.match(/^(.*?) Production/)
    // if a match exists and if there is a match [1]
    if (match && match[1]) {
      // trim spaces
      return match[1].trim()
    }
  }


}