import { Client } from '@elastic/elasticsearch'
import { Country } from '../models/country.js'
import fs from 'fs'

const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD
  },
  tls: {
    ca: fs.readFileSync('./http_ca.crt'),
    rejectUnauthorized: false
  }
})

export const addDocumentsToElasticSearch = async () => {
  await client.indices.create({
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

  await client.bulk({ body: body })

  console.log('Successfully indexed countries data')
}

export const deleteDocumentsFromElasticSearch = async () => {
  await client.indices.delete({
    index: 'countries'
  })
}
