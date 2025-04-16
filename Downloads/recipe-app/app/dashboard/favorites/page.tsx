import { getFavoriteRecipes } from "@/app/actions/recipe-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Heart, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function FavoritesPage() {
  const recipes = await getFavoriteRecipes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Favorite Recipes</h1>
        <Button asChild variant="outline">
          <Link href="/recipes">Browse Recipes</Link>
        </Button>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => {
            const initials = recipe.user.name
              ? recipe.user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)
              : "U"

            return (
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
                  <div className="flex items-center gap-4 text-sm mb-3">
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={recipe.user.image || ""} alt={recipe.user.name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span>by {recipe.user.name}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/recipes/${recipe._id}`}>View Recipe</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No favorites yet</h3>
          <p className="text-muted-foreground">Browse recipes and add them to your favorites.</p>
          <Button asChild className="mt-4">
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
