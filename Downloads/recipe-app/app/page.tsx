import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getRecipes } from "./actions/recipe-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, UtensilsCrossed, ChefHat, Utensils, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function Home() {
  const recipes = await getRecipes(6)
  const featuredRecipes = recipes.slice(0, 3)

  return (
    <div className="space-y-12">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-4">
                Welcome to Recipe Manager
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Discover & Share <span className="text-primary">Delicious Recipes</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Create, store, and share your favorite recipes with our easy-to-use recipe management platform.
              </p>
            </div>
            <div className="space-x-4 mt-6">
              <Button asChild size="lg" className="animate-fade-in">
                <Link href="/recipes">Browse Recipes</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/signup">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <ChefHat className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Create Recipes</h3>
              <p className="text-muted-foreground">Easily create and organize your favorite recipes in one place.</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Cook with Ease</h3>
              <p className="text-muted-foreground">Follow step-by-step instructions and never lose a recipe again.</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Discover New Dishes</h3>
              <p className="text-muted-foreground">
                Explore recipes from other users and expand your culinary horizons.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 py-12 bg-muted/50 rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Recipes</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out some of our latest and greatest recipes.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {featuredRecipes.length > 0 ? (
            featuredRecipes.map((recipe) => {
              const initials = recipe.user.name
                ? recipe.user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)
                : "U"

              return (
                <Card key={recipe._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {recipe.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={recipe.imageUrl || "/placeholder.svg?height=300&width=500"}
                        alt={recipe.title}
                        className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
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
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No recipes yet</h3>
              <p className="text-muted-foreground">Add your first recipe to get started.</p>
              <Button asChild className="mt-4">
                <Link href="/recipes/new">Add Recipe</Link>
              </Button>
            </div>
          )}
        </div>
        {featuredRecipes.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/recipes">View All Recipes</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="container px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Our Community</h2>
            <p className="text-muted-foreground md:text-xl">
              Create an account to save your favorite recipes, create your own collection, and share with others.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Food preparation"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
