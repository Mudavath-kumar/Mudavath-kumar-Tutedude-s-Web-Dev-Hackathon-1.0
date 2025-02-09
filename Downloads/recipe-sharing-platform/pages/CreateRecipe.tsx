"use client"

import type React from "react"
import { useState } from "react"
import { useHistory } from "react-router-dom"

const CreateRecipe: React.FC = () => {
  const [title, setTitle] = useState("")
  const [ingredients, setIngredients] = useState([""])
  const [instructions, setInstructions] = useState("")
  const [error, setError] = useState("")
  const history = useHistory()

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          ingredients: ingredients.filter((ingredient) => ingredient.trim() !== ""),
          instructions,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        history.push("/")
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Recipe</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2"
            />
          ))}
          <button type="button" onClick={handleAddIngredient} className="bg-gray-200 px-3 py-1 rounded">
            Add Ingredient
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="instructions" className="block mb-2">
            Instructions
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows={5}
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Recipe
        </button>
      </form>
    </div>
  )
}

export default CreateRecipe

