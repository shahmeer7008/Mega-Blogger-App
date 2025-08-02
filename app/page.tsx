"use client"

import { BlogProvider } from "@/contexts/blog-context"
import { ThemeProvider } from "@/contexts/theme-context"
import BlogHome from "@/components/blog-home"

export default function Home() {
  return (
    <ThemeProvider>
      <BlogProvider>
        <BlogHome />
      </BlogProvider>
    </ThemeProvider>
  )
}
