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

        const countriesData = await Country.find().exec()

        const body = countriesData.flatMap(doc => {
          const { name, foodName, foodQuantityInTons, yearFoodProduction } = doc
          return [
            { index: { _index: 'countries' } },
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

  async getAllDataYear2018(req, res, next) {
    try {
      const response = await this.#client.search({
        index: 'countries',
        scroll: '1m', // keep the search context alive for 1 minute
        size: 4000, // return 4000 documents per page
        body: {
          query: {
            range: {
              yearFoodProduction: { 
                gte: "2018-01-01T00:00:00", // From January 1st, 2018 at 00:00:00
                lte: "2018-12-31T23:59:59", // Up to December 31st, 2018 at 23:59:59
              }
            }
          }
        },
      })

      res.status(200).json({
        totalDocuments: response.hits.total.value,
        documents: response.hits.hits
      })
    } catch (error) {
      console.error('Error getting data from Elasticsearch:', error)
      res.status(500).json({ message: "Error getting data from Elasticsearch", error: error.message })
    }
  }

  async getAllCountryNames(req, res, next) {
    try {
      const response = await this.#client.search({
        index: 'countries',
        size: 0, 
        body: {
          aggs: {
            unique_countries: {
              terms: {
                field: 'name.keyword',
                size: 154 // There are 154 countries supported in the dataset
              }
            }
          },
          query: {
            range: {
              yearFoodProduction: { 
                gte: "2018-01-01T00:00:00", // From January 1st, 2018 at 00:00:00
                lte: "2018-12-31T23:59:59", // Up to December 31st, 2018 at 23:59:59
              }
          }
        }
      }
      })

      res.status(200).json({
        countries: response.aggregations.unique_countries.buckets,
      })
    } catch (error) {
      console.error('Error getting data from Elasticsearch:', error)
      res.status(500).json({ message: "Error getting data from Elasticsearch", error: error.message })
    }
  }

  async getAllFoodNames(req, res, next) {
    try {
      const response = await this.#client.search({
        index: 'countries',
        size: 0, 
        body: {
          aggs: {
            unique_food: {
              terms: {
                field: 'foodName.keyword',
                size: 22 // There are 22 food types supported in the dataset
              }
            }
          },
          query: {
            range: {
              yearFoodProduction: { 
                gte: "2018-01-01T00:00:00", // From January 1st, 2018 at 00:00:00
                lte: "2018-12-31T23:59:59", // Up to December 31st, 2018 at 23:59:59
              }
          }
        }
      }
      })

      res.status(200).json({
        response
      })
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
