"use server"

import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/recipe"
import User from "@/models/user"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

export async function getRecipes(limit?: number) {
  try {
    await connectToDatabase()
    let query = Recipe.find({}).sort({ createdAt: -1 }).populate("user", "name image")

    if (limit) {
      query = query.limit(limit)
    }

    const recipes = await query
    return JSON.parse(JSON.stringify(recipes))
  } catch (error) {
    console.error("Error fetching recipes:", error)
    throw new Error("Failed to fetch recipes")
  }
}

export async function getUserRecipes() {
  try {
    const session = await getSession()
    if (!session) {
      return []
    }

    await connectToDatabase()
    const recipes = await Recipe.find({ user: session.id }).sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(recipes))
  } catch (error) {
    console.error("Error fetching user recipes:", error)
    throw new Error("Failed to fetch user recipes")
  }
}

export async function getRecipeById(id: string) {
  try {
    await connectToDatabase()
    const recipe = await Recipe.findById(id)
    
    if (!recipe) {
      throw new Error("Recipe not found")
    }
    
    return JSON.parse(JSON.stringify(recipe))
  } catch (error) {
    console.error("Error fetching recipe:", error)
    throw new Error("Failed to fetch recipe")
  }
}

export async function updateRecipe(id: string, formData: FormData) {
  try {
    await connectToDatabase()
    
    // Extract data from formData
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const ingredients = formData.get("ingredients") as string
    const instructions = formData.get("instructions") as string
    const cookingTime = formData.get("cookingTime") as string
    const servings = formData.get("servings") as string
    
    // Update recipe in database
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title,
        description,
        ingredients,
        instructions,
        cookingTime,
        servings,
      },
      { new: true }
    )
    
    if (!updatedRecipe) {
      throw new Error("Recipe not found")
    }
    
    revalidatePath("/")
    revalidatePath(`/recipes/${id}`)
    revalidatePath("/dashboard")
    
    return JSON.parse(JSON.stringify(updatedRecipe))
  } catch (error) {
    console.error("Error updating recipe:", error)
    throw new Error("Failed to update recipe")
  }
}

export async function createRecipe(formData: FormData) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "You must be logged in to create a recipe" }
    }

    await connectToDatabase()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const ingredientsString = formData.get("ingredients") as string
    const instructions = formData.get("instructions") as string
    const cookingTime = Number.parseInt(formData.get("cookingTime") as string)
    const servings = Number.parseInt(formData.get("servings") as string)
    const difficulty = formData.get("difficulty") as "Easy" | "Medium" | "Hard"
    const imageUrl = (formData.get("imageUrl") as string) || undefined

    // Split ingredients by new line
    const ingredients = ingredientsString
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      imageUrl,
      user: session.id,
    })

    revalidatePath("/")
    revalidatePath("/recipes")
    revalidatePath("/dashboard")

    return { success: true, recipe: JSON.parse(JSON.stringify(recipe)) }
  } catch (error) {
    console.error("Error creating recipe:", error)
    return { success: false, error: "Failed to create recipe" }
  }
}

export async function deleteRecipe(id: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "You must be logged in to delete a recipe" }
    }

    await connectToDatabase()
    
    // Check if the recipe exists and belongs to the user
    const recipe = await Recipe.findById(id)
    if (!recipe) {
      return { success: false, error: "Recipe not found" }
    }
    
    if (recipe.user.toString() !== session.id) {
      return { success: false, error: "You don't have permission to delete this recipe" }
    }
    
    await Recipe.findByIdAndDelete(id)
    
    revalidatePath("/")
    revalidatePath("/recipes")
    revalidatePath("/dashboard")
    
    return { success: true }
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return { success: false, error: "Failed to delete recipe" }
  }
}

export async function toggleFavorite(recipeId: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "You must be logged in to favorite recipes" }
    }

    await connectToDatabase()
    
    const user = await User.findById(session.id)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    
    const isFavorite = user.favorites.includes(recipeId)
    
    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== recipeId)
    } else {
      // Add to favorites
      user.favorites.push(recipeId)
    }
    
    await user.save()
    
    revalidatePath("/")
    revalidatePath(`/recipes/${recipeId}`)
    revalidatePath("/dashboard/favorites")
    
    return { success: true, isFavorite: !isFavorite }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { success: false, error: "Failed to update favorite status" }
  }
}

export async function getFavoriteRecipes() {
  try {
    const session = await getSession()
    if (!session) {
      return []
    }

    await connectToDatabase()
    const user = await User.findById(session.id).populate({
      path: "favorites",
      populate: {
        path: "user",
        select: "name image",
      },
    })

    if (!user) {
      return []
    }

    return JSON.parse(JSON.stringify(user.favorites))
  } catch (error) {
    console.error("Error fetching favorite recipes:", error)
    throw new Error("Failed to fetch favorite recipes")
  }
}

export async function checkIsFavorite(recipeId: string) {
  try {
    const session = await getSession()
    if (!session) {
      return false
    }

    await connectToDatabase()
    const user = await User.findById(session.id)

    if (!user) {
      return false
    }

    return user.favorites.includes(recipeId)
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return false
  }
}
