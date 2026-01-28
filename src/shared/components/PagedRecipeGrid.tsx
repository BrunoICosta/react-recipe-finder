import { Fragment, type ReactNode } from 'react'
import { useIncrementalList } from '@/shared/hooks/useIncrementalList'
import { LoadMoreButton } from './LoadMoreButton'
import { RecipeGrid } from './RecipeGrid'

interface PagedRecipeGridProps<T extends { id: string }> {
  items: readonly T[]
  label: string
  renderItem: (item: T) => ReactNode
}

export function PagedRecipeGrid<T extends { id: string }>({
  items,
  label,
  renderItem,
}: PagedRecipeGridProps<T>) {
  const { visible, remaining, hasMore, showMore } = useIncrementalList(items)

  return (
    <>
      <RecipeGrid label={label}>
        {visible.map((item) => (
          <Fragment key={item.id}>{renderItem(item)}</Fragment>
        ))}
      </RecipeGrid>
      {hasMore && <LoadMoreButton remaining={remaining} onClick={showMore} />}
    </>
  )
}
