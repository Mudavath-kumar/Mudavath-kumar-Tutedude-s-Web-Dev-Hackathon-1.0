import Recipe from "../models/Recipe.js"
import { io } from "../server.js"

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("author", "username")
    res.json(recipes)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body
    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      author: req.userId,
    })
    await recipe.save()
    const populatedRecipe = await Recipe.findById(recipe._id).populate("author", "username")
    io.emit("newRecipe", populatedRecipe)
    res.status(201).json(populatedRecipe)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const { title, ingredients, instructions } = req.body
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { title, ingredients, instructions, updatedAt: Date.now() },
      { new: true },
    ).populate("author", "username")
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }
    io.emit("updateRecipe", updatedRecipe)
    res.json(updatedRecipe)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const deletedRecipe = await Recipe.findByIdAndDelete(id)
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }
    io.emit("deleteRecipe", id)
    res.json({ message: "Recipe deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

