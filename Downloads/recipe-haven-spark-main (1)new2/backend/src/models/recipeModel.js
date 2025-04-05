const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: null,
  },
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    default: null,
  },
  cooking_time: {
    type: Number,
    default: null,
  },
  difficulty: {
    type: String,
    default: null,
  },
  instructions: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ingredients: [ingredientSchema],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Add text index for search functionality
recipeSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe; 