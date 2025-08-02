"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Heart, MessageCircle, Calendar, User, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useBlog, type Blog } from "@/contexts/blog-context"
import Image from "next/image"

interface BlogPostProps {
  blog: Blog
  onBack: () => void
}

export default function BlogPost({ blog, onBack }: BlogPostProps) {
  const { state, dispatch } = useBlog()
  const [newComment, setNewComment] = useState("")
  const isLiked = blog.likedBy.includes(state.currentUser)

  const handleLike = () => {
    dispatch({
      type: "LIKE_BLOG",
      payload: { blogId: blog.id, userId: state.currentUser },
    })
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      author: state.currentUser,
      content: newComment.trim(),
      date: new Date().toISOString().split("T")[0],
    }

    dispatch({
      type: "ADD_COMMENT",
      payload: { blogId: blog.id, comment },
    })
    setNewComment("")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>
      </div>

      <article className="space-y-6">
        {/* Blog Header */}
        <Card>
          <CardHeader className="p-0">
            {blog.thumbnail && (
              <div className="relative h-64 md:h-80 w-full">
                <Image
                  src={blog.thumbnail || "/placeholder.svg"}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">
                  {blog.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(blog.date).toLocaleDateString()}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{blog.title}</h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  <span>By {blog.author}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`flex items-center space-x-1 ${
                      isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    <span>{blog.likes}</span>
                  </Button>

                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-5 h-5" />
                    <span>{blog.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Content */}
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{blog.content}</div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Comments ({blog.comments.length})
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="space-y-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </form>

            <Separator className="mb-6" />

            {/* Comments List */}
            <div className="space-y-4">
              {blog.comments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                blog.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
