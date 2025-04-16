import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"
import { getSession } from "@/lib/auth"
import { UserMenu } from "./user-menu"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "./theme-toggle"

export default async function Header() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Recipe Manager</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-6">
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/recipes" className="text-sm font-medium hover:text-primary transition-colors">
              Recipes
            </Link>
            {session && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <UserMenu user={session} />
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <MobileNav session={session} />
        </div>
      </div>
    </header>
  )
}
