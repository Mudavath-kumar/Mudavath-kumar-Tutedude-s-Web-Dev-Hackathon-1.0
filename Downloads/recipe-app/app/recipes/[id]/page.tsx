import { getRecipeById, checkIsFavorite } from "@/app/actions/recipe-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Edit, Heart, Share2, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import DeleteRecipeButton from "./delete-recipe-button"
import { getSession } from "@/lib/auth"
import { FavoriteButton } from "@/components/favorite-button"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  try {
    const recipe = await getRecipeById(params.id)
    const session = await getSession()
    const isFavorite = await checkIsFavorite(params.id)
    const isOwner = session && recipe.user._id === session.id

    const createdAt = new Date(recipe.createdAt)
    const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })

    const initials = recipe.user.name
      ? recipe.user.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "U"

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
          <div className="flex items-center gap-2">
            {session && <FavoriteButton recipeId={recipe._id} initialIsFavorite={isFavorite} />}
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {isOwner && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/recipes/${recipe._id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <DeleteRecipeButton id={recipe._id} />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipe.user.image || ""} alt={recipe.user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span>{recipe.user.name}</span>
          </div>
          <div>•</div>
          <div>{timeAgo}</div>
          <div>•</div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{recipe.likes || 0} likes</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {recipe.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={recipe.imageUrl || "/placeholder.svg?height=300&width=500"}
                  alt={recipe.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{recipe.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <div className="prose max-w-none dark:prose-invert">
                {recipe.instructions.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-3">Recipe Details</h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Cooking Time:</span>
                </div>
                <div>{recipe.cookingTime} mins</div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Servings:</span>
                </div>
                <div>{recipe.servings}</div>

                <div>Difficulty:</div>
                <div>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="block h-2 w-2 rounded-full bg-primary mt-2" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return notFound()
  }
}
