import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeContext'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 -mr-2 rounded-full hover:bg-border/40 transition ${className}`}
      aria-label={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
      aria-pressed={isDark}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
