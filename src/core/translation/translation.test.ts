import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readCached } from './cache'
import { MYMEMORY_MAX_CHARS, splitForRequest, TranslationLimitError } from './providers'
import { translateText, translateTexts } from './translation'

const fetchMock = vi.fn<typeof fetch>()

function myMemory(translatedText: string, extra: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({ responseData: { translatedText }, responseStatus: 200, ...extra }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}

/** Echo server: "translates" every line by prefixing it with "PT ". */
function echo() {
  fetchMock.mockImplementation((input) => {
    const q = new URL(String(input)).searchParams.get('q') ?? ''
    return Promise.resolve(
      myMemory(
        q
          .split('\n')
          .map((line) => `PT ${line}`)
          .join('\n'),
      ),
    )
  })
}

function requestedTexts(): string[] {
  return fetchMock.mock.calls.map(([input]) => new URL(String(input)).searchParams.get('q') ?? '')
}

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('translateTexts with MyMemory', () => {
  it('sends texts together as line-separated requests and maps the results back', async () => {
    echo()

    await expect(translateTexts(['Chicken', 'soy sauce', 'Chicken'], 'pt-BR')).resolves.toEqual([
      'PT Chicken',
      'PT soy sauce',
      'PT Chicken',
    ])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = new URL(String(fetchMock.mock.calls[0][0]))
    expect(url.origin + url.pathname).toBe('https://api.mymemory.translated.net/get')
    expect(url.searchParams.get('langpair')).toBe('en|pt-BR')
    // Duplicates are only sent once.
    expect(url.searchParams.get('q')).toBe('Chicken\nsoy sauce')
  })

  it('serves repeated texts from the persistent cache', async () => {
    echo()
    await translateTexts(['Pancakes'], 'pt-BR')
    expect(readCached('Pancakes', 'pt-BR')).toBe('PT Pancakes')

    await expect(translateTexts(['Pancakes'], 'pt-BR')).resolves.toEqual(['PT Pancakes'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('keeps empty strings without requesting them', async () => {
    echo()
    await expect(translateTexts(['', 'Salt'], 'pt-BR')).resolves.toEqual(['', 'PT Salt'])
    expect(requestedTexts()).toEqual(['Salt'])
  })

  it('keeps every request within the 500 character limit', async () => {
    echo()
    const step = 'Stir the sauce slowly until it thickens and coats the back of a spoon. '
    const longText = step.repeat(20).trim()

    const [translated] = await translateTexts([longText, 'Serve.'], 'pt-BR')

    expect(fetchMock.mock.calls.length).toBeGreaterThan(1)
    for (const text of requestedTexts()) expect(text.length).toBeLessThanOrEqual(MYMEMORY_MAX_CHARS)
    expect(translated.startsWith('PT Stir the sauce')).toBe(true)
  })

  it('retries piece by piece when the service merges lines', async () => {
    fetchMock
      .mockResolvedValueOnce(myMemory('Um e dois'))
      .mockResolvedValueOnce(myMemory('Um'))
      .mockResolvedValueOnce(myMemory('Dois'))

    await expect(translateTexts(['One', 'Two'], 'pt-BR')).resolves.toEqual(['Um', 'Dois'])
    expect(requestedTexts()).toEqual(['One\nTwo', 'One', 'Two'])
  })

  it('decodes HTML entities returned by the service', async () => {
    fetchMock.mockResolvedValueOnce(
      myMemory('Torta de ma&#231;&#227; &amp; canela &quot;caseira&quot;'),
    )
    const [translated] = await translateTexts(['Apple & cinnamon pie'], 'pt-BR')
    expect(translated).toBe('Torta de maçã & canela "caseira"')
  })

  it('reports the daily limit and stops calling the API for the rest of the day', async () => {
    fetchMock.mockResolvedValue(
      myMemory('MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY', {
        quotaFinished: true,
      }),
    )

    await expect(translateTexts(['Beef stew'], 'pt-BR')).rejects.toBeInstanceOf(
      TranslationLimitError,
    )
    await expect(translateTexts(['Lamb stew'], 'pt-BR')).rejects.toBeInstanceOf(
      TranslationLimitError,
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('treats HTTP 429 as the limit too', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 429 }))
    await expect(translateTexts(['Soup'], 'pt-BR')).rejects.toBeInstanceOf(TranslationLimitError)
  })

  it('rejects on network failures so callers can show the original', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(translateTexts(['Soup'], 'pt-BR')).rejects.toThrow('Failed to fetch')
    expect(readCached('Soup', 'pt-BR')).toBeUndefined()
  })
})

describe('translateTexts with the browser Translator API', () => {
  it('prefers the on-device translator and makes no request', async () => {
    const translate = vi.fn((text: string) => Promise.resolve(`[pt] ${text}`))
    const create = vi.fn(() => Promise.resolve({ translate }))
    vi.stubGlobal('Translator', {
      availability: vi.fn(() => Promise.resolve('available')),
      create,
    })

    await expect(translateTexts(['Rice', 'Beans'], 'pt-BR')).resolves.toEqual([
      '[pt] Rice',
      '[pt] Beans',
    ])
    expect(create).toHaveBeenCalledWith({ sourceLanguage: 'en', targetLanguage: 'pt' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('falls back to MyMemory when the translator cannot be created', async () => {
    echo()
    vi.stubGlobal('Translator', {
      availability: vi.fn(() => Promise.resolve('downloadable')),
      create: vi.fn(() => Promise.reject(new DOMException('Needs user activation'))),
    })

    await expect(translateTexts(['Rice'], 'pt-BR')).resolves.toEqual(['PT Rice'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('translateText', () => {
  it('batches titles requested at the same time into one request', async () => {
    echo()

    const results = await Promise.all([
      translateText('Sticky Chicken', 'pt-BR'),
      translateText('Chicken Congee', 'pt-BR'),
    ])

    expect(results).toEqual(['PT Sticky Chicken', 'PT Chicken Congee'])
    expect(requestedTexts()).toEqual(['Sticky Chicken\nChicken Congee'])
  })
})

describe('splitForRequest', () => {
  it('splits at sentence boundaries without exceeding the limit', () => {
    const pieces = splitForRequest('First sentence. Second sentence. Third one.', 20)
    expect(pieces).toEqual(['First sentence.', 'Second sentence.', 'Third one.'])
  })

  it('flattens line breaks, which are used as separators', () => {
    expect(splitForRequest('Line one\nline two')).toEqual(['Line one line two'])
  })
})
