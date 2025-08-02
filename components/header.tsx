"use client"

import { PenTool, Home, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

interface HeaderProps {
  currentView: "home" | "create" | "post"
  setCurrentView: (view: "home" | "create" | "post") => void
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mega Blogger App</h1>
          </div>

          <nav className="flex items-center space-x-4">
            <Button
              variant={currentView === "home" ? "default" : "ghost"}
              onClick={() => setCurrentView("home")}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>

            <Button
              variant={currentView === "create" ? "default" : "ghost"}
              onClick={() => setCurrentView("create")}
              className="flex items-center space-x-2"
            >
              <PenTool className="w-4 h-4" />
              <span>Write</span>
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-4">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
