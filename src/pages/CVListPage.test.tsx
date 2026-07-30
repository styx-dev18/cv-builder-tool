import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CVListPage } from './CVListPage'

describe('CVListPage', () => {
  it('renders the heading', () => {
    render(<CVListPage />)
    expect(screen.getByRole('heading', { name: /cv\/resume builder/i })).toBeInTheDocument()
  })
})
