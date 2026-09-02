import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/features/theme'

function Consumer() {
  const { theme, toggleTheme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button data-testid="toggle" onClick={toggleTheme}>toggle</button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>light</button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>dark</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('defaults to light theme when nothing is stored', () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('reads the stored theme on mount', () => {
    window.localStorage.setItem('app:theme', 'dark')
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme flips light to dark and back', () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )
    act(() => { fireEvent.click(screen.getByTestId('toggle')) })
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('app:theme')).toBe('dark')

    act(() => { fireEvent.click(screen.getByTestId('toggle')) })
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('app:theme')).toBe('light')
  })

  it('setTheme applies the chosen theme and persists it', () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )
    act(() => { fireEvent.click(screen.getByTestId('set-dark')) })
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(window.localStorage.getItem('app:theme')).toBe('dark')

    act(() => { fireEvent.click(screen.getByTestId('set-light')) })
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(window.localStorage.getItem('app:theme')).toBe('light')
  })
})
