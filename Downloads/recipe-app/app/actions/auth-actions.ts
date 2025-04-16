"use server"

import connectToDatabase from "@/lib/mongodb"
import User from "@/models/user"
import { createToken, removeToken, getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function signup(formData: FormData) {
  try {
    await connectToDatabase()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate input
    const result = signupSchema.safeParse({ name, email, password })
    if (!result.success) {
      return { success: false, error: result.error.errors[0].message }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Create session
    await createToken(user)

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "Failed to create account" }
  }
}

export async function login(formData: FormData) {
  try {
    await connectToDatabase()

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate input
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      return { success: false, error: result.error.errors[0].message }
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    await createToken(user)

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Failed to log in" }
  }
}

export async function logout() {
  removeToken()
  redirect("/")
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  try {
    await connectToDatabase()
    const user = await User.findById(session.id).select("-password")
    return user ? JSON.parse(JSON.stringify(user)) : null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
