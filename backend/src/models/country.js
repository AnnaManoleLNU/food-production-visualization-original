/**
 * Mongoose model of a country.
 * 
 * @author Anna Manole
 * @version 1.0.0
 */

import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],

  },
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    enum: [Maize, Rice]
  },
  foodQuantityInTons: {
    type: Number,
    required: [true, 'Food quantity is required']
  },
  yearOfProduction: {
    type: Number,
    required: [true, 'Year is required']
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    },
    virtuals: true
  }
})

export const Country = mongoose.model('Country', schema)