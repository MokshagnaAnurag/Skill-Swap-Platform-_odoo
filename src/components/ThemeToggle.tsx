
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"
import { useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "system", icon: Monitor, label: "System" },
  ]

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                   hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-200/20 
                   dark:border-purple-300/20 transition-all duration-300 hover:scale-105"
      >
        <Palette className="h-5 w-5 text-blue-600 dark:text-purple-400 transition-colors" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 right-0 z-50 w-48 p-2 bg-white/95 dark:bg-gray-900/95 
                         backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 
                         shadow-xl animate-scale-in">
            <div className="space-y-1">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon
                const isActive = theme === themeOption.name
                
                return (
                  <button
                    key={themeOption.name}
                    onClick={() => {
                      setTheme(themeOption.name as any)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left 
                               transition-all duration-200 hover:bg-gradient-to-r 
                               ${isActive 
                                 ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-purple-300' 
                                 : 'hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700'
                               }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {themeOption.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
