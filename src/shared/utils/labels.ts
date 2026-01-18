/** TheMealDB data is in English; categories are few and stable, so they get pt-BR labels. */
const CATEGORY_LABELS: Record<string, string> = {
  Beef: 'Carne bovina',
  Breakfast: 'Café da manhã',
  Chicken: 'Frango',
  Dessert: 'Sobremesas',
  Goat: 'Cabrito',
  Lamb: 'Cordeiro',
  Miscellaneous: 'Diversos',
  Pasta: 'Massas',
  Pork: 'Carne suína',
  Seafood: 'Frutos do mar',
  Side: 'Acompanhamentos',
  Starter: 'Entradas',
  Vegan: 'Veganas',
  Vegetarian: 'Vegetarianas',
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category
}
