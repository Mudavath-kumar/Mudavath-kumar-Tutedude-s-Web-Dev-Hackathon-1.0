import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectToDatabase from "./mongodb"
import User from "@/models/user"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const TOKEN_NAME = "recipe_auth_token"

export interface UserSession {
  id: string
  name: string
  email: string
  image?: string
}

export async function createToken(user: { _id: string; name: string; email: string; image?: string }) {
  const token = jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )

  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return token
}

export function removeToken() {
  cookies().delete(TOKEN_NAME)
}

export async function getSession(): Promise<UserSession | null> {
  const token = cookies().get(TOKEN_NAME)?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession
    return decoded
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export async function getUserFromSession(): Promise<any | null> {
  const session = await getSession()

  if (!session?.id) return null

  try {
    await connectToDatabase()
    const user = await User.findById(session.id).select("-password")
    return user ? JSON.parse(JSON.stringify(user)) : null
  } catch (error) {
    console.error("Error getting user from session:", error)
    return null
  }
}

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(req, session)
  }
}
