# Receitário — React Recipe Finder

Aplicação web para descobrir receitas do mundo todo: busque pelo nome do prato ou pelo ingrediente que
você tem em casa, navegue por categorias e cozinhas, veja ingredientes e modo de preparo passo a passo,
salve suas favoritas e mantenha um caderno com as suas próprias receitas. Os dados vêm da API pública
[TheMealDB](https://www.themealdb.com/api.php) (chave de teste gratuita, sem cadastro) e tudo o que é do
usuário fica salvo no `localStorage` do navegador.

**Demo:** https://brunoicosta.github.io/react-recipe-finder/

![Tela de busca do Receitário](docs/screenshot.png)

## Funcionalidades

- **Busca com debounce** por nome do prato ou por ingrediente, com a consulta refletida na URL
  (`?q=…&por=ingrediente`) — dá para compartilhar o link e usar voltar/avançar do navegador.
- **Categorias** (com nomes traduzidos) e **cozinhas por país**, com filtro instantâneo da lista de países.
- **Página da receita** com foto, categoria, país, tags, lista de ingredientes com medidas (marcável,
  para usar na hora das compras) e modo de preparo em etapas numeradas, além do link para o vídeo no YouTube.
- **Favoritas** persistidas no `localStorage`, com contador no menu e sincronização entre abas.
- **Minhas receitas**: criar, editar e excluir receitas próprias em um formulário validado
  (React Hook Form + Zod), com lista dinâmica de ingredientes (`useFieldArray`) e confirmação de exclusão.
- **Surpreenda-me**: abre uma receita aleatória.
- Skeletons de carregamento, estados vazios e de erro com "Tentar novamente", paginação "Mostrar mais"
  para listas longas.
- **Tema escuro** que segue o sistema, com alternância manual salva e aplicada antes da primeira pintura.
- Layout responsivo (mobile first) e acessível: link "pular para o conteúdo", foco visível, rótulos e
  mensagens de erro associados aos campos, `aria-pressed`, `aria-live` e diálogo modal nativo.

## Stack

| Tecnologia                                                     | Versão            |
| -------------------------------------------------------------- | ----------------- |
| React / React DOM                                              | 19.2              |
| TypeScript (strict)                                            | 5.9               |
| Vite + @vitejs/plugin-react                                    | 7.3 / 5.1         |
| React Router                                                   | 7.11              |
| React Hook Form + @hookform/resolvers                          | 7.70 / 5.2        |
| Zod                                                            | 4.3               |
| Vitest + Testing Library (React, user-event, jest-dom) + jsdom | 4.0 / 16.3 / 27.4 |
| ESLint (typescript-eslint, react-hooks) + Prettier             | 9.39 / 3.7        |

CSS Modules com design tokens em CSS custom properties — nenhuma biblioteca de UI.

## Arquitetura e decisões

- **Organização por feature** (`features/search`, `features/recipe`, `features/my-recipes`…), com
  `core` para infraestrutura (cliente HTTP, hooks genéricos, tema) e `shared` para componentes de UI
  reutilizáveis. Cada página é carregada sob demanda com `React.lazy` + `Suspense`, então quem só busca
  receitas não baixa o Zod nem o React Hook Form.
- **Cliente de API tipado** (`core/api`): os payloads crus da TheMealDB (com `strIngredient1…20`,
  `meals: null` etc.) são convertidos em um modelo de domínio limpo (`Recipe`, `RecipeSummary`). A
  normalização transforma o texto livre de instruções em etapas, remove marcadores como "STEP 1" e "▢",
  e trata a mudança recente da API de "área" para "país". Respostas de dados de referência ficam em cache
  na memória, e o resultado do sorteio já alimenta o cache da página de detalhe.
- **`useAsync`** em vez de uma biblioteca de data fetching: cancela a requisição anterior com
  `AbortController` (nada de resposta antiga sobrescrevendo a nova) e deriva o estado de carregamento em
  vez de chamar `setState` dentro do efeito, seguindo as regras do `eslint-plugin-react-hooks` 7.
- **`useLocalStorage`** baseado em `useSyncExternalStore`: todos os componentes que usam a mesma chave
  compartilham o valor (o contador de favoritas no menu atualiza na hora), outras abas são sincronizadas
  pelo evento `storage`, e os dados lidos passam por validação — no caso das receitas do usuário, pelo
  mesmo schema Zod do formulário, descartando só o item corrompido.
- **URL como fonte da verdade da busca** (`useSearchQuery`): o campo responde a cada tecla, a URL recebe
  o termo com debounce e o fetch reage à URL.
- **Formulário** com React Hook Form + `zodResolver`: o schema é a única fonte das regras e dos tipos
  (`z.input`/`z.output`), os erros são anunciados via `aria-describedby` e o foco vai para o primeiro
  campo inválido.
- **Sem biblioteca de UI**: tokens de cor/espaçamento em CSS custom properties com variação escura via
  `data-theme`, ícones SVG inline e `<dialog>` nativo para a confirmação.

## Como rodar

Pré-requisito: Node.js 22+.

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # testes unitários e de componentes (Vitest)
npm run lint         # ESLint
npm run build        # build de produção em dist/
npm run preview      # serve o build em http://localhost:4173/react-recipe-finder/
```

## Estrutura de pastas

```
src/
├── app/                 # roteador, layout (header, tema), páginas 404 e de erro
├── core/
│   ├── api/             # cliente TheMealDB, tipos crus e normalização
│   ├── hooks/           # useAsync, useDebounce, useLocalStorage, useDocumentTitle
│   ├── models/          # modelo de domínio (Recipe, Category…)
│   └── theme/           # preferência de tema claro/escuro
├── features/
│   ├── browse/          # categorias e cozinhas
│   ├── favorites/       # favoritas (store, botão, página)
│   ├── my-recipes/      # schema Zod, store e páginas das receitas do usuário
│   ├── random/          # botão "Surpreenda-me"
│   ├── recipe/          # página e componentes de detalhe
│   └── search/          # busca por nome/ingrediente
├── shared/              # componentes, hooks e utilitários reutilizáveis
├── styles/              # tokens e estilos globais
└── test/                # setup do Vitest, fixtures e helpers de render
```

## Próximos passos

- Lista de compras combinando ingredientes de várias receitas.
- Upload de foto (IndexedDB) e exportação/importação das receitas do usuário em JSON.
- Tradução automática de instruções e ingredientes para português.
- Testes end-to-end com Playwright e PWA para uso offline.

## Autor

Bruno Vinicius Isaac Costa — https://github.com/BrunoICosta

Licença [MIT](LICENSE).
