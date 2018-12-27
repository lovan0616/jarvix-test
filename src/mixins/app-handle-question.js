const suggestions = [
  { value: '什么产品销售热门' },
  { value: '什么产品常被订购' },
  { value: '什么产品被订购最多次' },
  { value: '我想知道订单的产品价格情况' },
  { value: '什么产品价格最贵' },
  { value: '订单的交货状况' },
  { value: '有多少司机正在执行送货任务' },
  { value: '我们有哪些客户' },
  { value: '我们有多少客户' },
  { value: '客户最常使用什么付款方式' },
  { value: '我想了解热门产品的付款方式' },
  { value: '我想了解送货司机与配送产品有没有关联性' }
]
export default {
  data () {
    return {
      app_question: '',
      app_question_placeholder: `范例：${suggestions[0].value}`,
      app_suggestions: suggestions
    }
  },
  methods: {
    app_setQuestion (d) {
      this.app_question = d
    },
    app_onEnterQuestion (e) {
      this.$refs.autocomplete.close()
      this.$refs.autocomplete.$refs.input.$refs.input.blur()
      this.$router.push({ name: 'PageResult', query: { question: this.app_question, '_': new Date().getTime() } })
    },
    app_querySearch (queryString, cb) {
      cb(this.app_suggestions)
    }
  }
}
