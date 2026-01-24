import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { describedBy } from '@/shared/components/form/describedBy'
import { FieldError, FormField } from '@/shared/components/form/FormField'
import formStyles from '@/shared/components/form/Form.module.css'
import { PlusIcon, TrashIcon } from '@/shared/components/icons'
import { categoryLabel } from '@/shared/utils/labels'
import {
  EMPTY_RECIPE_FORM,
  MAX_INGREDIENTS,
  recipeFormSchema,
  type RecipeFormInput,
  type RecipeFormValues,
} from '../schema'
import styles from './RecipeForm.module.css'

const CATEGORY_SUGGESTIONS = [
  'Beef',
  'Breakfast',
  'Chicken',
  'Dessert',
  'Lamb',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
]

interface RecipeFormProps {
  defaultValues?: RecipeFormInput
  submitLabel: string
  onSubmit: (values: RecipeFormValues) => void
  onCancel: () => void
}

export function RecipeForm({
  defaultValues = EMPTY_RECIPE_FORM,
  submitLabel,
  onSubmit,
  onCancel,
}: RecipeFormProps) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormInput, unknown, RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' })
  const thumbnail = useWatch({ control, name: 'thumbnail' })
  const canPreview = !errors.thumbnail && /^https?:\/\/\S+$/.test(thumbnail.trim())

  const ingredientsError = errors.ingredients?.root?.message ?? errors.ingredients?.message

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset className={styles.section}>
        <legend className={styles.legend}>Informações básicas</legend>

        <FormField id={id('name')} label="Nome da receita" required error={errors.name?.message}>
          <input
            id={id('name')}
            className={formStyles.control}
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy(id('name'), { error: errors.name })}
            {...register('name')}
          />
        </FormField>

        <div className={styles.row}>
          <FormField
            id={id('category')}
            label="Categoria"
            hint="Escolha uma sugestão ou digite livremente."
            error={errors.category?.message}
          >
            <input
              id={id('category')}
              className={formStyles.control}
              list={id('category-list')}
              autoComplete="off"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={describedBy(id('category'), {
                hint: true,
                error: errors.category,
              })}
              {...register('category')}
            />
            <datalist id={id('category-list')}>
              {CATEGORY_SUGGESTIONS.map((category) => (
                <option key={category} value={category}>
                  {categoryLabel(category)}
                </option>
              ))}
            </datalist>
          </FormField>

          <FormField id={id('area')} label="Cozinha / país" error={errors.area?.message}>
            <input
              id={id('area')}
              className={formStyles.control}
              placeholder="Ex.: Brazil"
              autoComplete="off"
              aria-invalid={Boolean(errors.area)}
              aria-describedby={describedBy(id('area'), { error: errors.area })}
              {...register('area')}
            />
          </FormField>
        </div>

        <div className={styles.row}>
          <FormField
            id={id('thumbnail')}
            label="Endereço da imagem"
            error={errors.thumbnail?.message}
          >
            <input
              id={id('thumbnail')}
              type="url"
              inputMode="url"
              className={formStyles.control}
              placeholder="https://…"
              aria-invalid={Boolean(errors.thumbnail)}
              aria-describedby={describedBy(id('thumbnail'), { error: errors.thumbnail })}
              {...register('thumbnail')}
            />
          </FormField>

          <FormField id={id('youtube')} label="Vídeo no YouTube" error={errors.youtubeUrl?.message}>
            <input
              id={id('youtube')}
              type="url"
              inputMode="url"
              className={formStyles.control}
              placeholder="https://www.youtube.com/watch?v=…"
              aria-invalid={Boolean(errors.youtubeUrl)}
              aria-describedby={describedBy(id('youtube'), { error: errors.youtubeUrl })}
              {...register('youtubeUrl')}
            />
          </FormField>
        </div>

        {canPreview && (
          <img
            className={styles.preview}
            src={thumbnail.trim()}
            alt="Pré-visualização da imagem da receita"
            width={160}
            height={120}
          />
        )}
      </fieldset>

      <fieldset
        className={styles.section}
        aria-describedby={ingredientsError ? id('ingredients-error') : undefined}
      >
        <legend className={styles.legend}>
          Ingredientes <span className={styles.counter}>({fields.length})</span>
        </legend>

        <ol className={styles.ingredients}>
          {fields.map((field, index) => {
            const fieldErrors = errors.ingredients?.[index]
            const nameId = id(`ingredient-${index}-name`)
            const measureId = id(`ingredient-${index}-measure`)
            return (
              <li key={field.id} className={styles.ingredientRow}>
                <span className={styles.index} aria-hidden="true">
                  {index + 1}
                </span>
                <div className={formStyles.field}>
                  <label htmlFor={nameId} className="visually-hidden">
                    Ingrediente {index + 1}
                  </label>
                  <input
                    id={nameId}
                    className={formStyles.control}
                    placeholder="Ingrediente"
                    autoComplete="off"
                    aria-invalid={Boolean(fieldErrors?.name)}
                    aria-describedby={describedBy(nameId, { error: fieldErrors?.name })}
                    {...register(`ingredients.${index}.name`)}
                  />
                  {fieldErrors?.name?.message && (
                    <FieldError id={`${nameId}-error`} message={fieldErrors.name.message} />
                  )}
                </div>
                <div className={formStyles.field}>
                  <label htmlFor={measureId} className="visually-hidden">
                    Quantidade do ingrediente {index + 1}
                  </label>
                  <input
                    id={measureId}
                    className={formStyles.control}
                    placeholder="Quantidade"
                    autoComplete="off"
                    aria-invalid={Boolean(fieldErrors?.measure)}
                    aria-describedby={describedBy(measureId, { error: fieldErrors?.measure })}
                    {...register(`ingredients.${index}.measure`)}
                  />
                  {fieldErrors?.measure?.message && (
                    <FieldError id={`${measureId}-error`} message={fieldErrors.measure.message} />
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label={`Remover ingrediente ${index + 1}`}
                  title="Remover"
                >
                  <TrashIcon size={18} />
                </button>
              </li>
            )
          })}
        </ol>

        {ingredientsError && <FieldError id={id('ingredients-error')} message={ingredientsError} />}

        <div>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => append({ name: '', measure: '' })}
            disabled={fields.length >= MAX_INGREDIENTS}
          >
            <PlusIcon size={18} />
            Adicionar ingrediente
          </button>
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.legend}>Modo de preparo</legend>
        <FormField
          id={id('instructions')}
          label="Instruções"
          required
          hint="Escreva uma etapa por linha; cada linha vira um passo numerado."
          error={errors.instructions?.message}
        >
          <textarea
            id={id('instructions')}
            className={formStyles.control}
            rows={8}
            aria-invalid={Boolean(errors.instructions)}
            aria-describedby={describedBy(id('instructions'), {
              hint: true,
              error: errors.instructions,
            })}
            {...register('instructions')}
          />
        </FormField>
      </fieldset>

      <div className={styles.actions}>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
