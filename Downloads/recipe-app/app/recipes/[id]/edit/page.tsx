// Remove the "use client" directive
// "use client" 

import { getRecipeById, updateRecipe } from "@/app/actions/recipe-actions";
import RecipeForm from "@/components/recipe-form";
import { notFound } from "next/navigation"; // Import notFound

// The page component remains async as it's now a Server Component
export default async function EditRecipePage({ params }: { params: { id: string } }) {
  let recipe;
  try {
    recipe = await getRecipeById(params.id);

    // If recipe is null or undefined after fetching, trigger a 404
    if (!recipe) {
      notFound();
    }

    // The server action can be passed directly to the client component
    // Note: We don't need the handleUpdate wrapper function anymore
    // const handleUpdate = (formData: FormData) => {
    //   "use server"; // Ensure this is marked as a server action if defined here
    //   return updateRecipe(params.id, formData);
    // };

  } catch (error) {
    console.error("Failed to load recipe for editing:", error);
    // Optionally, render a specific error page or trigger notFound
    notFound(); 
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
      {/* Pass the fetched recipe and the server action directly */}
      <RecipeForm 
        recipe={recipe} 
        action={updateRecipe.bind(null, params.id)} // Bind the id to the server action
        buttonText="Update Recipe" 
      />
    </div>
  );
  // Removed the catch block that returned JSX, using notFound() instead for cleaner handling
}
