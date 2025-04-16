"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChefHat, Heart, Home, LogOut, Menu, PlusCircle, Settings, User, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { logout } from "@/app/actions/auth-actions"

interface MobileNavProps {
  session: any
}

export function MobileNav({ session }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    router.refresh()
  }

  const closeSheet = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            Recipe Manager
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            onClick={closeSheet}
            className={`flex items-center gap-2 text-sm ${pathname === "/" ? "text-primary font-medium" : ""}`}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/recipes"
            onClick={closeSheet}
            className={`flex items-center gap-2 text-sm ${pathname === "/recipes" ? "text-primary font-medium" : ""}`}
          >
            <UtensilsCrossed className="h-4 w-4" />
            Recipes
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={closeSheet}
                className={`flex items-center gap-2 text-sm ${pathname === "/dashboard" ? "text-primary font-medium" : ""}`}
              >
                <User className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/recipes"
                onClick={closeSheet}
                className={`flex items-center gap-2 text-sm ${pathname.startsWith("/dashboard/recipes") ? "text-primary font-medium" : ""}`}
              >
                <UtensilsCrossed className="h-4 w-4" />
                My Recipes
              </Link>
              <Link
                href="/dashboard/favorites"
                onClick={closeSheet}
                className={`flex items-center gap-2 text-sm ${pathname === "/dashboard/favorites" ? "text-primary font-medium" : ""}`}
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Link>
              <Link
                href="/recipes/new"
                onClick={closeSheet}
                className={`flex items-center gap-2 text-sm ${pathname === "/recipes/new" ? "text-primary font-medium" : ""}`}
              >
                <PlusCircle className="h-4 w-4" />
                Add Recipe
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={closeSheet}
                className={`flex items-center gap-2 text-sm ${pathname === "/dashboard/settings" ? "text-primary font-medium" : ""}`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-left text-destructive mt-4"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              <Button asChild variant="outline" onClick={closeSheet}>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild onClick={closeSheet}>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
