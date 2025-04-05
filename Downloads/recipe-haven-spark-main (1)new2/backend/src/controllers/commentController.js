const Comment = require('../models/commentModel');
const Recipe = require('../models/recipeModel');

// @desc    Get comments for a recipe
// @route   GET /api/recipes/:recipeId/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('user', 'name avatar_url')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a comment
// @route   POST /api/recipes/:recipeId/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      recipe: req.params.recipeId,
      user: req.user._id,
    });

    const populatedComment = await comment.populate('user', 'name avatar_url');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    comment.content = req.body.content;
    await comment.save();

    const updatedComment = await comment.populate('user', 'name avatar_url');
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await comment.remove();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
}; 