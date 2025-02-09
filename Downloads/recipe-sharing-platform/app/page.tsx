"use client"

import App from "../App"
import { Suspense } from "react"

export default function SyntheticV0PageForDeployment() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  )
}

export function ErrorBoundary() {
  return <div>Something went wrong. Please try again.</div>
}