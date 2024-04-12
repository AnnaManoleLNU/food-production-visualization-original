import fs from 'fs-extra'
import { Country } from '../models/country.js'
import { getNames } from 'country-list'

export class MongoDbController {
  async uploadDataToDatabase(req, res, next) {
    try {
      const countriesData = await fs.readJSON('./world_food_production.json')

      const insertData = []

      countriesData.forEach(element => {
        // if it's a valid country name
        if (element.Entity && this.#isValidCountry(element.Entity)) {         
          const name = element.Entity
          const year = parseInt(element.Year, 10)
  
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

      // Get only the unique country names 
      const uniqueCountryNames = [...new Set(insertData.map(item => item.name))]
      console.table(uniqueCountryNames)

      // Get only the unique food names
      const uniqueFoodNames = [...new Set(insertData.map(item => item.foodName))]

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

  #isValidCountry(countryName) {
    return getNames().includes(countryName)
  }

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