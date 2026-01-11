import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the layout and the lazy home page', async () => {
    render(<App />)
    expect(screen.getByRole('link', { name: 'Receitário' })).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: 'O que vamos cozinhar hoje?' }),
    ).toBeInTheDocument()
  })
})
