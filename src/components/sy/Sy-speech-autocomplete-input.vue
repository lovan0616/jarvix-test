<template>
  <el-autocomplete :class="['sy-speech-autocomplete-input', 'el-input--round', {'is-recognizing': recognizing}]"
    ref="autocomplete"
    :placeholder="placeholder"
    :value="inputValue"
    @keypress.enter.native="onEnter"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
    :fetch-suggestions="querySearch"
    :trigger-on-focus="false"
    @select="handleSelect"
    :disabled="disabled"
    custom-item="aucocomplete-item"
    popper-class="autocomplete-item"
  >
    <i
      class="el-input__icon ion ion-ios-mic-outline"
      slot="suffix"
      @click="onVoiceClick">
    </i>
  </el-autocomplete>
</template>

<script>
import SpeechCognition from './speechRecognition'
import fuzzball from 'fuzzball'
import Vue from 'vue'
Vue.component('aucocomplete-item', {
  functional: true,
  render: function (h, ctx) {
    var item = ctx.props.item
    return h('li', ctx.data, [
      h('div', { attrs: { class: 'value' } }, [item.value]),
      h('span', { attrs: { class: 'info' } }, [item.info])
    ])
  },
  props: {
    item: { type: Object, required: true }
  }
})
export default {
  name: 'SySpeechAutocompleteInput',
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    suggestionsData: { type: Array, default: () => [] },
    suggestionsThreshold: { type: Number, default: 40 },
    suggestionsMinNum: { type: Number, default: 5 }
  },
  data () {
    return {
      suggestions: [],
      speechCognition: undefined,
      inputValue: this.value,
      disabled: false
    }
  },
  watch: {
    value (e) {
      this.inputValue = e
    }
  },
  created () {
    this.initSpeech()
    console.log(this.speechCognition)
  },
  destroyed () {
    this.endSpeech()
  },
  computed: {
    recognizing () {
      if (!this.speechCognition) return false
      else return this.speechCognition.recognizing
    }
  },
  mounted () {
    this.suggestions = this.loadAll()
  },
  methods: {
    querySearch (queryString, cb) {
      let suggestions = this.suggestions
      let results = queryString ? this.filterSuggestions(queryString, suggestions) : []
      // call callback function to return suggestions
      cb(results)
    },
    filterSuggestions (value, list) {
      let result = []
      let strAry = list.map(item => item.value)
      let tmpScore = 0
      let maxSameScore = 1000
      let tmpSameScoreN = 0
      fuzzball.extract(value, strAry).map((item, index) => {
        if (item[1] !== tmpScore) {
          tmpScore = item[1]
          tmpSameScoreN = 0
        } else {
          tmpSameScoreN++
        }
        let check = (index < this.suggestionsMinNum ||
          item[1] > this.suggestionsThreshold) &&
          tmpSameScoreN < maxSameScore
        if (!check) return
        let obj = { ...list[item[2]] }
        obj.score = item[1]
        obj.info = `score: ${obj.score}`
        result.push(obj)
      })
      return result
    },
    loadAll () {
      return this.suggestionsData.map(str => {
        return { value: str }
      })
    },
    handleSelect (item) {
      this.onInput(item.value)
      this.onEnter()
    },
    onInput (e) {
      this.inputValue = e
      this.$emit('input', this.inputValue)
    },
    onEnter () {
      this.$refs.autocomplete.close()
      this.$refs.autocomplete.$refs.input.$refs.input.blur()
      this.$emit('onEnter', this.inputValue)
    },
    onFocus () {
      this.endSpeech()
    },
    onBlur () {
      // console.log('onBlur')
    },
    onVoiceClick (e) {
      console.log('hello')
      return (!this.recognizing) ? this.startSpeech() : this.endSpeech()
    },
    initSpeech () {
      const self = this
      this.speechCognition = new SpeechCognition({
        lang: 'cmn-Hant-TW',
        onStart () {
          console.log('onStart')
        },
        onResult (e) {
          console.log('onResult', e)
          self.$emit('input', self.inputValue)
          self.inputValue = e
        },
        onError (e) {
          console.log('onError', e)
        },
        onEnd () {
          console.log('onEnd')
        }
      })
    },
    startSpeech () {
      if (this.recognizing) return
      this.speechCognition.start()
    },
    endSpeech () {
      if (!this.recognizing) return
      this.speechCognition.end()
    }
  }
}
</script>
