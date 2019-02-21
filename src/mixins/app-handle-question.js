import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      app_question: '',
      app_question_placeholder: '请输入你想问的问题'
    }
  },
  computed: {
    ...mapGetters('bookmark', {
      app_suggestions: 'suggestions'
    })
  },
  methods: {
    app_setQuestion (d) {
      this.app_question = d
      return this
    },
    app_onEnterQuestion (e) {
      this.$refs.autocomplete.close()
      this.$refs.autocomplete.$refs.input.$refs.input.blur()
      return this.app_enterQuestion()
    },
    app_querySearch (queryString, cb) {
      cb(this.app_suggestions.map(value => ({ value })))
    },
    app_enterQuestion () {
      this.$router.push({ name: 'PageResult', query: { question: this.app_question, '_': new Date().getTime() } })
      return this
    },
    app_setAndEnterQuestion (question) {
      return this.app_setQuestion(question).app_enterQuestion()
    }
  }
}
