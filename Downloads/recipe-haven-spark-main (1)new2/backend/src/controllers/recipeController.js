const Recipe = require('../models/recipeModel');

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const recipes = await Recipe.find(query)
      .populate('user', 'name avatar_url')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get recipes by current user
// @route   GET /api/recipes/user
// @access  Private
const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id })
      .populate('user', 'name avatar_url')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get newest recipes 
// @route   GET /api/recipes/newest
// @access  Public
const getNewestRecipes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const recipes = await Recipe.find()
      .populate('user', 'name avatar_url')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('user', 'name avatar_url')
      .populate({
        path: 'likes',
        select: 'name avatar_url',
      });

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      cooking_time,
      difficulty,
      instructions,
      image_url,
      ingredients,
    } = req.body;

    const recipe = await Recipe.create({
      title,
      description,
      category,
      cooking_time,
      difficulty,
      instructions,
      image_url,
      ingredients,
      user: req.user._id,
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate('user', 'name avatar_url');

    res.json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await recipe.remove();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike a recipe
// @route   POST /api/recipes/:id/like
// @access  Private
const toggleLikeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const alreadyLiked = recipe.likes.includes(req.user._id);

    if (alreadyLiked) {
      recipe.likes = recipe.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      recipe.likes.push(req.user._id);
    }

    await recipe.save();
    res.json({ likes: recipe.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLikeRecipe,
  getUserRecipes,
  getNewestRecipes,
}; 