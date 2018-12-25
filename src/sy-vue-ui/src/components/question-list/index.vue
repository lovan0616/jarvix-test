<template>
  <div :class="['sy-question-list', theme]">
    <template v-if="!btns.length">
      <span>{{emptyMsg}}</span>
    </template>
    <template v-else>
      <div class="question-list-btn"
        v-for="(item, index) in btns"
        :key="index"
        @click="onItemClick($event, item)"
      >
        <div class="question-list-icon">
          <i class="el-icon-search"></i>
        </div>
        <div class="question-list-text">
          {{item}}
        </div>
      </div>
    </template>
  </div>
</template>
<script>

export default {
  name: 'SyQuestionList',
  props: {
    theme: { type: String, default: 'primary' },
    data: { type: Array, default: () => [] },
    reverse: { type: Boolean, default: false },
    maxNum: { type: Number, default: -1 },
    emptyMsg: { type: String, default: '' }
  },
  computed: {
    btns () {
      let result = []
      this.data.forEach((item, index) => {
        if (this.maxNum > -1 && index + 1 >= this.maxNum) return
        if (this.reverse) result.unshift(`“${item}”`)
        else result.push(`“${item}”`)
      })
      return result
    }
  },
  methods: {
    onItemClick (e, d) {
      this.$emit('onItemClick', e, d.replace(/(“|”)/g, ''))
    }
  }
}
</script>
