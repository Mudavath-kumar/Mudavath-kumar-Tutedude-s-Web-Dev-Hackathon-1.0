import { getUserRecipes, getFavoriteRecipes } from "@/app/actions/recipe-actions"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CookingPot, Heart, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const recipes = await getUserRecipes()
  const favorites = await getFavoriteRecipes()

  const recentRecipes = recipes.slice(0, 3)
  const recentFavorites = favorites.slice(0, 3)

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const joinedDate = new Date(user.createdAt)
  const joinedAgo = formatDistanceToNow(joinedDate, { addSuffix: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">Joined {joinedAgo}</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Recipe
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <CookingPot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.length}</div>
            <p className="text-xs text-muted-foreground">
              {recipes.length === 0
                ? "No recipes yet"
                : `${recipes.length} recipe${recipes.length === 1 ? "" : "s"} created`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Recipes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites.length}</div>
            <p className="text-xs text-muted-foreground">
              {favorites.length === 0
                ? "No favorites yet"
                : `${favorites.length} recipe${favorites.length === 1 ? "" : "s"} favorited`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Recipes</CardTitle>
            <CardDescription>Your recently created recipes</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecipes.length > 0 ? (
              <div className="space-y-4">
                {recentRecipes.map((recipe) => (
                  <div key={recipe._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CookingPot className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <Link href={`/recipes/${recipe._id}`} className="font-medium hover:underline">
                          {recipe.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/recipes/${recipe._id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CookingPot className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No recipes yet</h3>
                <p className="text-sm text-muted-foreground">Create your first recipe to get started.</p>
                <Button asChild className="mt-4">
                  <Link href="/recipes/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Recipe
                  </Link>
                </Button>
              </div>
            )}
            {recentRecipes.length > 0 && (
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/recipes">View all recipes</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Favorite Recipes</CardTitle>
            <CardDescription>Recipes you've favorited</CardDescription>
          </CardHeader>
          <CardContent>
            {recentFavorites.length > 0 ? (
              <div className="space-y-4">
                {recentFavorites.map((recipe) => (
                  <div key={recipe._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <Link href={`/recipes/${recipe._id}`} className="font-medium hover:underline">
                          {recipe.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">by {recipe.user.name}</p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/recipes/${recipe._id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No favorites yet</h3>
                <p className="text-sm text-muted-foreground">Favorite recipes to see them here.</p>
                <Button asChild className="mt-4">
                  <Link href="/recipes">Browse recipes</Link>
                </Button>
              </div>
            )}
            {recentFavorites.length > 0 && (
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/favorites">View all favorites</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
