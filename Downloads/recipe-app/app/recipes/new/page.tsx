"use client"

import { createRecipe } from "@/app/actions/recipe-actions"
import RecipeForm from "@/components/recipe-form"

export default function NewRecipePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add New Recipe</h1>
      <RecipeForm onSubmit={createRecipe} submitButtonText="Create Recipe" />
    </div>
  )
}
