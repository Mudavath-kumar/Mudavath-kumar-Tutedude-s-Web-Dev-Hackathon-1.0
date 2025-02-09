import express from "express"
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "../controllers/recipeController.js"
import { authenticateUser } from "../middleware/auth.js"

const router = express.Router()

router.get("/", getRecipes)
router.post("/", authenticateUser, createRecipe)
router.put("/:id", authenticateUser, updateRecipe)
router.delete("/:id", authenticateUser, deleteRecipe)

export default router

