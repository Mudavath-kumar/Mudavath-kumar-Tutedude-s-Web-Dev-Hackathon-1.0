const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLikeRecipe,
  getUserRecipes,
  getNewestRecipes,
} = require('../controllers/recipeController');
const {
  getComments,
  createComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Special routes (must be before '/:id' to avoid conflicts)
router.route('/user')
  .get(protect, getUserRecipes);

router.route('/newest')
  .get(getNewestRecipes);

// Recipe routes
router.route('/')
  .get(getRecipes)
  .post(protect, createRecipe);

router.route('/:id')
  .get(getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

router.route('/:id/like')
  .post(protect, toggleLikeRecipe);

// Comment routes for recipes
router.route('/:recipeId/comments')
  .get(getComments)
  .post(protect, createComment);

module.exports = router; 