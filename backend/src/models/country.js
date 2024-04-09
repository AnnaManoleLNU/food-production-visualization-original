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
    required: [true, 'Name of country is required.'],
  },
  foodName: {
    type: String,
    required: [true, 'Food name is required.'],
    enum: ['Maize', 'Rice', 'Yams', 'Wheat', 'Tomatoes', 'Tea', 'Sweet potatoes', 'Sunflower seed', 'Sugar cane', 'Soybeans', 'Rye', 'Potatoes', 'Oranges', 'Peas, dry', 'Palm oil', 'Grapes', 'Coffee, green', 'Cocoa beans', 'Meat, chicken', 'Bananas', 'Avocados', 'Apples']
  },
  foodQuantityInTons: {
    type: Number,
    required: [true, 'Food quantity is required. Represented in tons.'],
    min: [0, 'Food quantity in tons cannot be negative.']
  },
  yearFoodProduction: {
    type: Date,
    required: [true, 'Year of food production is required.']
  },
})

export const Country = mongoose.model('Country', schema)