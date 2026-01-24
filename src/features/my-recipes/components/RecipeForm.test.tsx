import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RecipeForm } from './RecipeForm'

function setup(props: Partial<Parameters<typeof RecipeForm>[0]> = {}) {
  const onSubmit = vi.fn()
  const onCancel = vi.fn()
  const user = userEvent.setup()
  render(<RecipeForm submitLabel="Salvar" onSubmit={onSubmit} onCancel={onCancel} {...props} />)
  return { user, onSubmit, onCancel }
}

describe('RecipeForm', () => {
  it('shows validation errors and does not submit an empty form', async () => {
    const { user, onSubmit } = setup()

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('O nome precisa ter pelo menos 3 caracteres.')).toBeVisible()
    expect(screen.getByText('Informe o ingrediente.')).toBeVisible()
    expect(screen.getByText('Descreva o modo de preparo (pelo menos 20 caracteres).')).toBeVisible()
    expect(screen.getByLabelText(/Nome da receita/)).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('adds and removes ingredient rows', async () => {
    const { user } = setup()
    const list = screen.getByRole('list')

    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Remover ingrediente 1' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Adicionar ingrediente/ }))
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByLabelText('Ingrediente 2')).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Remover ingrediente 1' }))
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
  })

  it('submits trimmed values', async () => {
    const { user, onSubmit } = setup()

    await user.type(screen.getByLabelText(/Nome da receita/), '  Pão de queijo ')
    await user.type(screen.getByLabelText('Ingrediente 1'), 'Polvilho azedo')
    await user.type(screen.getByLabelText('Quantidade do ingrediente 1'), '500 g')
    await user.click(screen.getByRole('button', { name: /Adicionar ingrediente/ }))
    await user.type(screen.getByLabelText('Ingrediente 2'), 'Queijo minas')
    await user.type(
      screen.getByLabelText(/Instruções/),
      'Misture tudo.{enter}Faça bolinhas e asse por 25 minutos.',
    )
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toEqual({
      name: 'Pão de queijo',
      category: '',
      area: '',
      thumbnail: '',
      youtubeUrl: '',
      ingredients: [
        { name: 'Polvilho azedo', measure: '500 g' },
        { name: 'Queijo minas', measure: '' },
      ],
      instructions: 'Misture tudo.\nFaça bolinhas e asse por 25 minutos.',
    })
  })

  it('rejects a non-YouTube video link', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/Vídeo no YouTube/), 'https://vimeo.com/1')
    await user.tab()

    expect(await screen.findByText('Informe um link do YouTube válido.')).toBeVisible()
  })

  it('starts from the given values when editing', () => {
    setup({
      defaultValues: {
        name: 'Brigadeiro',
        category: 'Dessert',
        area: 'Brazil',
        thumbnail: '',
        youtubeUrl: '',
        ingredients: [
          { name: 'Leite condensado', measure: '1 lata' },
          { name: 'Chocolate em pó', measure: '2 colheres' },
        ],
        instructions: 'Cozinhe mexendo até desgrudar do fundo.',
      },
    })

    expect(screen.getByLabelText(/Nome da receita/)).toHaveValue('Brigadeiro')
    expect(screen.getByLabelText('Ingrediente 2')).toHaveValue('Chocolate em pó')
  })

  it('calls onCancel', async () => {
    const { user, onCancel } = setup()
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
