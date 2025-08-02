"use client"

import type React from "react"

import { Heart, MessageCircle, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBlog, type Blog } from "@/contexts/blog-context"
import Image from "next/image"

interface BlogCardProps {
  blog: Blog
  onView: () => void
}

export default function BlogCard({ blog, onView }: BlogCardProps) {
  const { state, dispatch } = useBlog()
  const isLiked = blog.likedBy.includes(state.currentUser)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: "LIKE_BLOG",
      payload: { blogId: blog.id, userId: state.currentUser },
    })
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
      <CardHeader className="p-0">
        {blog.thumbnail && (
          <div className="relative h-48 w-full">
            <Image
              src={blog.thumbnail || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4" onClick={onView}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{blog.category}</Badge>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(blog.date).toLocaleDateString()}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">{blog.title}</h3>

          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{blog.excerpt}</p>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <User className="w-4 h-4 mr-1" />
            {blog.author}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{blog.likes}</span>
          </Button>

          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span>{blog.comments.length}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onView}>
          Read More
        </Button>
      </CardFooter>
    </Card>
  )
}
