import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getRecipes } from "../actions/recipe-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, UtensilsCrossed } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function RecipesPage() {
  const recipes = await getRecipes()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">All Recipes</h1>
        <Button asChild>
          <Link href="/recipes/new">Add Recipe</Link>
        </Button>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe._id} className="overflow-hidden">
              {recipe.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={recipe.imageUrl || "/placeholder.svg?height=300&width=500"}
                    alt={recipe.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{recipe.title}</CardTitle>
                <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookingTime} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/recipes/${recipe._id}`}>View Recipe</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No recipes found</h3>
          <p className="text-muted-foreground">Add your first recipe to get started.</p>
          <Button asChild className="mt-4">
            <Link href="/recipes/new">Add Recipe</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
