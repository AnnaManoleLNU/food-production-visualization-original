import csv from 'csv-parser'
import fs from 'fs'

const countries = []

export const createJSONFile = () => {
  fs.createReadStream('./world food production.csv') 
  .pipe(csv())
  .on('data', (data) => countries.push(data))
  .on('end', () => {
    const json = JSON.stringify(countries, null, 2)

    fs.writeFile('./world_food_production.json', json, 'utf8', (err) => {
      if (err) {
        console.error('An error occurred:', err)
        return
      }
      console.log('CSV has been converted to JSON and saved.')
    })
  })
} 
