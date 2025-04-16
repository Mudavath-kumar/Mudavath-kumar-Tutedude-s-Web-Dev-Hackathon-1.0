"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CookingPot, Heart, PlusCircle, Settings, User } from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: User,
  },
  {
    title: "My Recipes",
    href: "/dashboard/recipes",
    icon: CookingPot,
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Button>
        </Link>
      ))}
      <Link href="/recipes/new">
        <Button className="w-full mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Recipe
        </Button>
      </Link>
    </nav>
  )
}
