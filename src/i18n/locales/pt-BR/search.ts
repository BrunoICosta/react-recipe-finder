const search = {
  title: 'Busca: {{query}}',
  hero: {
    eyebrow: 'Receitas do mundo todo',
    title: 'O que vamos cozinhar hoje?',
    subtitle: 'Busque pelo nome do prato ou pelo ingrediente que está na sua geladeira.',
  },
  modeLegend: 'Buscar por',
  modes: {
    nome: {
      label: 'Nome do prato',
      inputLabel: 'Buscar receitas pelo nome',
      placeholder: 'Ex.: lasagne, curry, pancakes…',
      idleTitle: 'Comece digitando o nome de um prato',
      emptyHint: 'Confira a ortografia ou tente um termo mais genérico, em inglês.',
      count_one: '{{count}} receita para “{{query}}”',
      count_other: '{{count}} receitas para “{{query}}”',
    },
    ingrediente: {
      label: 'Ingrediente',
      inputLabel: 'Buscar receitas por ingrediente',
      placeholder: 'Ex.: garlic, chicken breast, rice…',
      idleTitle: 'Digite um ingrediente que você tem em casa',
      emptyHint:
        'Use o nome do ingrediente em inglês, como aparece nas receitas (ex.: “eggs”, “garlic”).',
      count_one: '{{count}} receita com “{{query}}”',
      count_other: '{{count}} receitas com “{{query}}”',
    },
  },
  hint: 'A base de receitas está em inglês. Experimente:',
  idleDescription: 'Os resultados aparecem enquanto você digita.',
  resultsHeading: 'Resultados',
  resultsLabel: 'Receitas para {{query}}',
  emptyTitle: 'Nenhuma receita encontrada para “{{query}}”',
}

export default search
