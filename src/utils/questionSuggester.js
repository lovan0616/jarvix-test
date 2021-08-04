import { Fzf } from 'fzf'

/**
 * @typedef {'unknown' | 'dataColumn' | 'dataValue'} TermType
 */

/**
 * @typedef {Object} Term
 * @property {TermType} type
 * @property {string} value
 */

/**
 * @typedef {'known' | 'unknown'} TokenType
 */

/**
 * @typedef {Object} Token
 * @property {TokenType} type
 * @property {Term} value
 * @property {number} startGapIndex
 * @property {number} endGapIndex
 */

/**
 * @typedef {Object} SuggestionResult
 * @property {Term} value
 * @property {number[]} positions
 * @property {number} score
 */

/**
 * @typedef {Object} Suggestion
 * @property {Token} token
 * @property {SuggestionResult} result
 */

/**
 * @typedef {Object} SuggestionListItem
 * @property {string} iconClass
 * @property {string} question
 * @property {string} html
 */

/**
 * Check if `num` is between [`min`, `max`]
 *
 * @param {number} max
 * @param {number} min
 * @param {number} num
 * @returns {boolean}
 */
function between (min, max, num) {
  return max >= num && num >= min
}

/**
 * Replace the part of `fullStr` between [`start`, `end`) with `str`
 *
 * @param {string} fullStr
 * @param {number} start
 * @param {number} end
 * @param {string} str
 * @returns {string}
 */
export function replaceWith (fullStr, start, end, str) {
  return `${fullStr.substring(0, start)}${str}${fullStr.substring(end)}`
}

/**
 *
 * @param {string} str
 * @returns {string}
 */
export function trimRedundant (str) {
  return str.replace(/\s+/g, ' ').trim()
}

/**
 * Define a term
 *
 * @param {Term} term
 * @returns {Term}
 */
export function defineTerm (term) {
  return {
    ...term,
    toString: () => term.value.toString()
  }
}

/**
 * Define a token
 *
 * @param {Token} token
 * @returns {Token}
 */
function defineToken (token) {
  return {
    ...token,
    toString: () => token.value.toString()
  }
}

/**
 * Define a suggestion
 *
 * @param {Suggestion} suggestion
 * @return {Suggestion}
 */
export function defineSuggestion (suggestion) {
  return {
    ...suggestion,
    toString: () => suggestion.result.value.toString()
  }
}

/**
 * Define a suggestionListItem
 *
 * @param {SuggestionListItem} suggestionListItem
 * @returns {SuggestionListItem}
 */
export function defineSuggestionListItem (suggestionListItem) {
  return suggestionListItem
}

export class Suggester {
  /** @type {Term[]} */
  _knownTerms = []
  /** @type {number} */
  _caretGapIndex = 0
  /** @type {string} */
  _inputString = ''
  /** @type {Token[]} */
  _tokens = []
  /** @type {Token | null} */
  _editingToken = null
  /** @type {Suggestion[]} */
  _suggestions = []
  /** @type {SuggestionListItem[]} */
  suggestions = []

  /**
   * @param {Term[]} toAppend
   */
  appendKnownTerms (toAppend) {
    const map = {}
    this._knownTerms.push(...toAppend)
    this._knownTerms.forEach((term) => {
      map[term.value] = term
    })
    this._knownTerms = Object.values(map)
    this._knownTerms = this._knownTerms.sort((termA, termB) => termB.value.length - termA.value.length)
    this._update()
  }

  /**
   * Invoke suggester update
   *
   * @param {string} inputString
   * @param {number} caretGapIndex
   */
  update (inputString, caretGapIndex) {
    const hasChanged = inputString !== this._inputString || caretGapIndex !== this._caretGapIndex
    this._inputString = inputString
    this._caretGapIndex = caretGapIndex
    if (!hasChanged) return

    this._update()
  }

  _update () {
    this._updateTokens()
    this._updateEditingToken()
    this._updateSuggestions()
    this._updateSuggestionListItem()
  }

  _updateTokens () {
    if (this._inputString.length === 0) {
      this._tokens = []
      return
    }
    let tokens = [defineToken({
      type: 'unknown',
      startGapIndex: 0,
      endGapIndex: this._inputString.length,
      value: defineTerm({ type: 'unknown', value: this._inputString })
    })]
    this._knownTerms.forEach(({ type: termType, value: termValue }) => {
      tokens = tokens.flatMap((token) => {
        if (token.type === 'known') return token
        const tokenTermValue = token.value.value
        const termIndexInToken = tokenTermValue.indexOf(termValue)
        if (termIndexInToken === -1) return token
        return [
          defineToken({
            type: 'unknown',
            value: defineTerm({ type: 'unknown', value: tokenTermValue.substring(0, termIndexInToken) }),
            startGapIndex: token.startGapIndex,
            endGapIndex: token.startGapIndex + termIndexInToken
          }),
          defineToken({
            type: 'known',
            value: defineTerm({ type: termType, value: termValue }),
            startGapIndex: token.startGapIndex + termIndexInToken,
            endGapIndex: token.startGapIndex + termIndexInToken + termValue.length
          }),
          defineToken({
            type: 'unknown',
            value: defineTerm({ type: 'unknown', value: tokenTermValue.substring(termIndexInToken + termValue.length) }),
            startGapIndex: token.startGapIndex + termIndexInToken + termValue.length,
            endGapIndex: token.endGapIndex
          })
        ]
          .filter((token) => token.value.value.length > 0)
      })
    })
    tokens = tokens.flatMap((token) => {
      if (token.type === 'known') return token
      const tokenTermValue = token.toString()
      const offset = token.startGapIndex
      const splitted = tokenTermValue.split(/\s/)
      return splitted.map((str) => {
        const startGapIndex = offset + tokenTermValue.indexOf(str)
        const endGapIndex = startGapIndex + str.length
        return defineToken({
          type: 'unknown',
          startGapIndex,
          endGapIndex,
          value: defineTerm({ type: 'unknown', value: str })
        })
      })
    })
      .filter((token) => token.value.value.length > 0)
    this._tokens = tokens
  }

  _updateEditingToken () {
    const result = this._tokens.find((token) => between(token.startGapIndex, token.endGapIndex, this._caretGapIndex))
    this._editingToken = result ?? null
  }

  _updateSuggestions () {
    this._suggestions = []

    if (this._editingToken === null) return

    const token = this._editingToken
    const editingTokenTermValue = token.value.value

    if (editingTokenTermValue.length === 0) return

    const fzf = new Fzf(this._knownTerms, {
      selector: (term) => term.value
    })
    const entries = fzf.find(editingTokenTermValue.trim())

    /** @type {Suggestion[]} */
    const result = entries
      .sort((entryA, entryB) => entryB.result.score - entryA.result.score)
      .map((entry) => defineSuggestion({
        token,
        result: {
          value: entry.item,
          positions: entry.positions ?? [],
          score: entry.result.score
        }
      }))

    this._suggestions.push(...result)
  }

  _updateSuggestionListItem () {
    const suggestions = this._suggestions
    this.suggestions = suggestions.map((suggestion) => {
      const tokens = this._tokens
      const question = trimRedundant(
        tokens
          .map((token) =>
            token === suggestion.token
              ? suggestion.toString().trim()
              : token.toString().trim()
          )
          .join(' ')
      )
      const suggestionTermHighlightHtml = suggestion.toString()
        .split('')
        .map((c, i) =>
          suggestion.result.positions.includes(i)
            ? `<span class="highlight">${c}</span>`
            : c
        )
        .join('')
      const html = tokens
        .map((token) =>
          token === suggestion.token
            ? `<span class="bold">${suggestionTermHighlightHtml}</span>`
            : token.toString().trim()
        )
        .join(' ')
      return {
        iconClass: 'search',
        question,
        html
      }
    })
  }
}
