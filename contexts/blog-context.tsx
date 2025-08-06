"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  author: string
  date: string
  thumbnail?: string
  likes: number
  likedBy: string[]
  comments: Comment[]
}

export interface Comment {
  id: string
  author: string
  content: string
  date: string
}

interface BlogState {
  blogs: Blog[]
  currentUser: string
  searchTerm: string
  selectedCategory: string
  sortBy: "newest" | "likes" | "trending"
}

type BlogAction =
  | { type: "ADD_BLOG"; payload: Blog }
  | { type: "LIKE_BLOG"; payload: { blogId: string; userId: string } }
  | { type: "ADD_COMMENT"; payload: { blogId: string; comment: Comment } }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_SORT_BY"; payload: "newest" | "likes" | "trending" }
  | { type: "LOAD_BLOGS"; payload: Blog[] }

const initialState: BlogState = {
  blogs: [],
  currentUser: "John Doe",
  searchTerm: "",
  selectedCategory: "all",
  sortBy: "newest",
}

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case "ADD_BLOG":
      return { ...state, blogs: [action.payload, ...state.blogs] }
    case "LIKE_BLOG":
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload.blogId
            ? {
                ...blog,
                likes: blog.likedBy.includes(action.payload.userId) ? blog.likes - 1 : blog.likes + 1,
                likedBy: blog.likedBy.includes(action.payload.userId)
                  ? blog.likedBy.filter((id) => id !== action.payload.userId)
                  : [...blog.likedBy, action.payload.userId],
              }
            : blog,
        ),
      }
    case "ADD_COMMENT":
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload.blogId ? { ...blog, comments: [...blog.comments, action.payload.comment] } : blog,
        ),
      }
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload }
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload }
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload }
    case "LOAD_BLOGS":
      return { ...state, blogs: action.payload }
    default:
      return state
  }
}

const BlogContext = createContext<{
  state: BlogState
  dispatch: React.Dispatch<BlogAction>
} | null>(null)

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState)

  useEffect(() => {
    const savedBlogs = localStorage.getItem("blogs")
    if (savedBlogs) {
      dispatch({ type: "LOAD_BLOGS", payload: JSON.parse(savedBlogs) })
    } else {
      // Load sample data
      const sampleBlogs: Blog[] = [
        {
          id: "1",
          title: "Getting Started with React and Tailwind CSS",
          content:
            "React and Tailwind CSS make a powerful combination for building modern web applications. In this comprehensive guide, we'll explore how to set up your development environment and create beautiful, responsive user interfaces.",
          excerpt: "Learn how to combine React and Tailwind CSS for modern web development.",
          category: "Web Development",
          author: "Jane Smith",
          date: "2024-01-15",
          thumbnail: "/react.png?height=200&width=400",
          likes: 24,
          likedBy: [],
          comments: [
            {
              id: "1",
              author: "Mike Johnson",
              content: "Great tutorial! Very helpful for beginners.",
              date: "2024-01-16",
            },
          ],
        },
        {
          id: "2",
          title: "The Future of Artificial Intelligence",
          content:
            "Artificial Intelligence is rapidly evolving and transforming industries across the globe. From machine learning to natural language processing, AI technologies are becoming more sophisticated and accessible.",
          excerpt: "Exploring the latest trends and developments in AI technology.",
          category: "Technology",
          author: "Alex Chen",
          date: "2024-01-14",
          thumbnail: "/ai.avif?height=200&width=400",
          likes: 18,
          likedBy: [],
          comments: [],
        },
        {
          id: "3",
          title: "Sustainable Living: Small Changes, Big Impact",
          content:
            "Making sustainable choices doesn't have to be overwhelming. This article explores simple lifestyle changes that can make a significant difference for our environment.",
          excerpt: "Discover practical tips for living more sustainably.",
          category: "Lifestyle",
          author: "Sarah Green",
          date: "2024-01-13",
          thumbnail: "/life.jpg?height=200&width=400",
          likes: 31,
          likedBy: [],
          comments: [
            {
              id: "2",
              author: "Emma Wilson",
              content: "Love these practical tips! Already started implementing some.",
              date: "2024-01-14",
            },
            {
              id: "3",
              author: "David Brown",
              content: "Very inspiring article. We all need to do our part.",
              date: "2024-01-14",
            },
          ],
        },
      ]
      dispatch({ type: "LOAD_BLOGS", payload: sampleBlogs })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(state.blogs))
  }, [state.blogs])

  return <BlogContext.Provider value={{ state, dispatch }}>{children}</BlogContext.Provider>
}

export const useBlog = () => {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider")
  }
  return context
}
