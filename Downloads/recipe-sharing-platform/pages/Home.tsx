"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { io } from "socket.io-client"

interface Recipe {
  _id: string
  title: string
  author: {
    _id: string
    username: string
  }
}

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`)
      const data = await response.json()
      setRecipes(data)
    }

    fetchRecipes()

    const socket = io(process.env.REACT_APP_API_URL as string)

    socket.on("newRecipe", (newRecipe: Recipe) => {
      setRecipes((prevRecipes) => [newRecipe, ...prevRecipes])
    })

    socket.on("updateRecipe", (updatedRecipe: Recipe) => {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => (recipe._id === updatedRecipe._id ? updatedRecipe : recipe)),
      )
    })

    socket.on("deleteRecipe", (deletedRecipeId: string) => {
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== deletedRecipeId))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Latest Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
            <p className="text-gray-600 mb-2">By {recipe.author.username}</p>
            <Link to={`/recipe/${recipe._id}`} className="text-blue-600 hover:underline">
              View Recipe
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

