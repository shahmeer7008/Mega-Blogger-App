"use client"

import { useState } from "react"
import Header from "./header"
import BlogList from "./blog-list"
import CreateBlog from "./create-blog"
import BlogPost from "./blog-post"
import { useBlog } from "@/contexts/blog-context"

export default function BlogHome() {
  const [currentView, setCurrentView] = useState<"home" | "create" | "post">("home")
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null)
  const { state } = useBlog()

  const handleViewBlog = (blogId: string) => {
    setSelectedBlogId(blogId)
    setCurrentView("post")
  }

  const selectedBlog = selectedBlogId ? state.blogs.find((blog) => blog.id === selectedBlogId) : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      <main className="container mx-auto px-4 py-8">
        {currentView === "home" && <BlogList onViewBlog={handleViewBlog} />}

        {currentView === "create" && <CreateBlog onBack={() => setCurrentView("home")} />}

        {currentView === "post" && selectedBlog && (
          <BlogPost blog={selectedBlog} onBack={() => setCurrentView("home")} />
        )}
      </main>
    </div>
  )
}
