"use client"

import { useState, useMemo } from "react"
import { Search, Filter, TrendingUp, Clock, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BlogCard from "./blog-card"
import { useBlog } from "@/contexts/blog-context"

interface BlogListProps {
  onViewBlog: (blogId: string) => void
}

export default function BlogList({ onViewBlog }: BlogListProps) {
  const { state, dispatch } = useBlog()
  const [searchTerm, setSearchTerm] = useState("")

  const categories = ["all", ...Array.from(new Set(state.blogs.map((blog) => blog.category)))]

  const filteredAndSortedBlogs = useMemo(() => {
    const filtered = state.blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = state.selectedCategory === "all" || blog.category === state.selectedCategory
      return matchesSearch && matchesCategory
    })

    return filtered.sort((a, b) => {
      switch (state.sortBy) {
        case "likes":
          return b.likes - a.likes
        case "trending":
          return b.likes + b.comments.length - (a.likes + a.comments.length)
        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })
  }, [state.blogs, searchTerm, state.selectedCategory, state.sortBy])

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={state.selectedCategory}
              onValueChange={(value) => dispatch({ type: "SET_CATEGORY", payload: value })}
            >
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={state.sortBy}
              onValueChange={(value: "newest" | "likes" | "trending") =>
                dispatch({ type: "SET_SORT_BY", payload: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Newest
                  </div>
                </SelectItem>
                <SelectItem value="likes">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Most Liked
                  </div>
                </SelectItem>
                <SelectItem value="trending">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} onView={() => onViewBlog(blog.id)} />
        ))}
      </div>

      {filteredAndSortedBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No blogs found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
