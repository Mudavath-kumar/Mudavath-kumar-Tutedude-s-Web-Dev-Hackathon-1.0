"use client"

import { toggleFavorite } from "@/app/actions/recipe-actions"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FavoriteButtonProps {
  recipeId: string
  initialIsFavorite: boolean
}

export function FavoriteButton({ recipeId, initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleToggleFavorite = async () => {
    setIsLoading(true)
    try {
      const result = await toggleFavorite(recipeId)

      if (result.success) {
        setIsFavorite(!isFavorite)
        toast({
          title: isFavorite ? "Removed from favorites" : "Added to favorites",
          description: isFavorite ? "Recipe removed from your favorites" : "Recipe added to your favorites",
        })
      } else {
        throw new Error(result.error || "Failed to update favorite status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "You must be logged in to favorite recipes",
        variant: "destructive",
      })
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size="sm"
      className={isFavorite ? "bg-primary text-primary-foreground" : ""}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "Favorited" : "Favorite"}
    </Button>
  )
}
