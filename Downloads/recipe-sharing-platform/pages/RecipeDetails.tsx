"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface Recipe {
  _id: string
  title: string
  ingredients: string[]
  instructions: string
  author: {
    _id: string
    username: string
  }
}

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState("")
  const { isAuthenticated } = useAuth()
  const history = useHistory()

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`)
        const data = await response.json()
        if (response.ok) {
          setRecipe(data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("An error occurred. Please try again.")
      }
    }

    fetchRecipe()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          history.push("/")
        } else {
          const data = await response.json()
          setError(data.message)
        }
      } catch (err) {
        setError("An error occurred. Please try again.")
      }
    }
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (!recipe) {
    return <p>Loading...</p>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
      <p className="text-gray-600 mb-4">By {recipe.author.username}</p>
      <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
      <p className="whitespace-pre-line">{recipe.instructions}</p>
      {isAuthenticated && (
        <div className="mt-8">
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Delete Recipe
          </button>
        </div>
      )}
    </div>
  )
}

export default RecipeDetails

