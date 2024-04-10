import { Client } from '@elastic/elasticsearch'
import { Country } from '../models/country.js'

export class ElasticController {
  #client = new Client({
    node: 'https://localhost:9200',
    auth: {
      username: 'elastic',
      password: process.env.ELASTIC_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  async uploadDataToElasticSearch(req, res, next) {
    try {
      // if there is no index, create one
      if (!(await this.#client.indices.exists({ index: 'countries' }))) {
        await this.#client.indices.create({
          index: 'countries'
        })

        const countriesData = await Country.find({ name: { $in: ['Romania', 'Sweden'] } }).exec()

        const body = countriesData.flatMap(doc => {
          const { _id, name, foodName, foodQuantityInTons, yearFoodProduction } = doc
          return [
            { index: { _index: 'countries', _id: _id.toString() } },
            {
              name,
              foodName,
              foodQuantityInTons,
              yearFoodProduction
            }
          ]
        })

        await this.#client.bulk({ body: body })

        res.status(200).json({
          message: 'Data uploaded to Elasticsearch successfully',
          totalDocuments: body.length
        })
      } else {
        res.status(400).json({ message: 'Index already exists' })
      }
    } catch (error) {
      console.error('Error uploading data to Elasticsearch:', error)
      res.status(500).json({ message: "Error uploading data to Elasticsearch", error: error.message })
    }
  }

  async getDataFromElasticSearch(req, res, next) {
    try {
      const response = await this.#client.search({
        index: 'countries',
        body: {
          query: {
            range: {
              yearFoodProduction: { 
                gte: "2018-01-01", // From January 1st, 2018
                lte: "2021-12-31", // Up to December 31st, 2021
              }
            }
          }
        },
        size: 1000
      })

      res.status(200).json(response)
    } catch (error) {
      console.error('Error getting data from Elasticsearch:', error)
      res.status(500).json({ message: "Error getting data from Elasticsearch", error: error.message })
    }
  }

  async deleteDataFromElasticSearch(req, res, next) {
    try {
      if (await this.#client.indices.exists({ index: 'countries' })) {
        await this.#client.indices.delete({ index: 'countries' })

        res.status(200).json({ message: 'Index deleted successfully' })
      } else {
        res.status(400).json({ message: 'Index does not exist' })
      }
    } catch (error) {
      console.error('Error deleting data from Elasticsearch:', error)
      res.status(500).json({ message: "Error deleting data from Elasticsearch", error: error.message })
    }
  }

}
