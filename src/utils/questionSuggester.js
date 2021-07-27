import store from '@/store'
import { dataValueSearch } from '@/API/DataSource'
import { Fzf } from 'fzf'

/**
 * @typedef {Object} Word
 * @property {string} value
 * @property {number} startGapIndex
 * @property {number} endGapIndex
 */

/**
 * @typedef {Object} Keyword
 * @property {Word[]} words
 */

/**
 * @typedef {Object} SuggestionResult
 * @property {string} value
 * @property {number[]} positions
 * @property {number} score
 */

/**
 * @typedef {Object} Suggestion
 * @property {Keyword} keyword
 * @property {SuggestionResult} result
 */

/**
 * @callback GetSuggestionsByKeyword
 * @param {Keyword} keyword
 * @returns {Promise<Suggestion[]>}
 */

/**
 * Check if `char` is match "\s" character
 *
 * @param {string} char
 * @returns {boolean}
 */
function isSpaceChar (char) {
  return /\s/.test(char)
}

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
 * Define a keyword
 *
 * @param {Keyword} keyword
 * @return {Keyword}
 */
export function defineKeyword (keyword) {
  return {
    ...keyword,
    toString: () => keyword.words.map(w => w.value).join(' ')
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
    toString: () => suggestion.value
  }
}

export class Suggester {
  constructor () {
    /** @type {number} */
    this._caretGapIndex = 0
    /** @type {string} */
    this._inputString = ''
    /** @type {Word[]} */
    this._words = []
    /** @type {Word | null} */
    this._editingWord = null
    /** @type {Word | null} */
    this._nearestLeftSideWord = null
    /** @type {Keyword[]} */
    this._candidateKeywords = []
    /** @type {Suggestion[]} */
    this.suggestions = []
  }

  setCaretGapIndex (value) {
    if (value === this._caretGapIndex) return
    this._caretGapIndex = value
    this._update()
  }

  getInputString () {
    return this._inputString
  }

  setInputString (value) {
    if (value === this._inputString) return
    this._inputString = value
    this._update()
  }

  _update () {
    this._updateWords()
    this._updateEditingWord()
    this._updateNearestLeftSideWord()
    this._updateCandidateKeywords()
    this._updateSuggestions()
  }

  _updateWords () {
    const inputString = this._inputString
    /** @type {Word[]} */
    const words = []
    for (let i = 0; i < inputString.length; i++) {
      const char = inputString[i]
      let lastWord = words.slice(-1)[0] ?? null
      if (isSpaceChar(char)) {
        if (lastWord === null || lastWord.value.length === 0) continue
        words.push({
          value: '',
          startGapIndex: -1,
          endGapIndex: -1
        })
      } else {
        if (lastWord === null) {
          words.push({
            value: '',
            startGapIndex: -1,
            endGapIndex: -1
          })
          lastWord = words.slice(-1)[0] ?? null
        }
        if (lastWord.startGapIndex === -1) lastWord.startGapIndex = i
        lastWord.endGapIndex = i + 1
        lastWord.value += char
      }
    }
    const lastWord = words.slice(-1)[0] ?? null
    if (lastWord !== null && lastWord.value.length === 0) {
      words.length -= 1
    }
    this._words = words
  }

  _updateEditingWord () {
    const result = this._words.find((word) => between(word.startGapIndex, word.endGapIndex, this._caretGapIndex))
    this._editingWord = result ?? null
  }

  _updateNearestLeftSideWord () {
    const result = this._words
      .filter((word) => word.endGapIndex < this._caretGapIndex)
      .pop()
    this._nearestLeftSideWord = result ?? null
  }

  _updateCandidateKeywords () {
    // TODO: Need a better solution
    /** @type {Keyword[]} */
    let result = []
    if (this._nearestLeftSideWord !== null && this._editingWord === null) {
      result = [
        defineKeyword({ words: [this._nearestLeftSideWord] })
      ]
    } else if (this._nearestLeftSideWord === null && this._editingWord !== null) {
      result = [
        defineKeyword({ words: [this._editingWord] })
      ]
    } else if (this._nearestLeftSideWord !== null && this._editingWord !== null) {
      result = [
        defineKeyword({ words: [this._editingWord] }),
        defineKeyword({ words: [this._nearestLeftSideWord, this._editingWord] })
      ]
    } else {
      result = []
    }
    this._candidateKeywords = result
  }

  async _updateSuggestions () {
    const suggestions = []
    this.suggestions = suggestions
    if (this._candidateKeywords.length === 0) return
    /** @type {Suggestion[]} */
    const result = (await Promise.all(
      this._candidateKeywords
        .map(async (keyword) => {
          const r = await this._fuzzySearchByKeyword(keyword)
          return r
        })
    ))
      .flat()
      .sort((itemA, itemB) => itemB.result.score - itemA.result.score)
    if (this.suggestions !== suggestions) return
    suggestions.push(...result)
  }

  /**
   * @param {Keyword} keyword
   * @returns {Promise<Suggestion[]>}
   */
  async _fuzzySearchByKeyword (keyword) {
    // search columns
    /** @type {string[]} */
    const columns = [...(new Set(Object.values(store.state.dataSource.dataSourceColumnInfoList).flat()))]
    // search data value
    // TODO: 暫時只搜尋 `test-account default group` > `Toby測試` > `運動商品範例資料.csv` > `產品` 的 data value
    /** @type {string[]} */
    const { fuzzySearchResult: dataValues } = await dataValueSearch(76387, { searchString: keyword.toString() })

    const fzf = new Fzf([...(new Set([...columns, ...dataValues]))], { casing: 'case-insensitive' })
    const entries = fzf.find(keyword.toString())

    /** @type {Suggestion[]} */
    const suggestions = entries.map((entry) => ({
      keyword,
      result: {
        value: entry.item,
        positions: entry.positions ?? [],
        score: entry.result.score
      }
    }))
    return suggestions
  }
}
