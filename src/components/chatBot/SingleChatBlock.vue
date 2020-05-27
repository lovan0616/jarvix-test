<template>
  <div class="conversation-block"
    :class="[content.type === 'System' ? 'system' : 'user']"
  >
    <div class="response"
      @click="askAgain(content.text)"
    >
      <svg-icon icon-class="triangle" class="icon"
        v-if="content.type === 'System'"
      ></svg-icon>
      {{ content.text }}</div>
    <div class="option-list"
      v-show="content.options"
    >
      <div class="option"
        v-for="(option, index) in content.options"
        :key="index + '-option-' + new Date().getTime()"
        @click="askChatBot(option)"
      >{{ option.question }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SingleChatBlock',
  props: {
    content: {
      type: Object,
      default () {
        return {
          type: null,
          text: null,
          options: []
        }
      }
    }
  },
  mounted () {
    if (this.content.type === 'System') {
      this.$el.scrollIntoView({behavior: 'smooth', block: 'center'})
    } else {
      this.$el.scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  },
  methods: {
    // 點擊使用者問的問題
    askAgain (value) {
      if (this.content.type === 'System') return false
      this.$store.commit('dataSource/setAppQuestion', value)
      this.$store.dispatch('dataSource/updateResultRouter', 'click_history')
    },
    askChatBot (questionInfo) {
      this.$store.commit('dataSource/setAppQuestion', questionInfo.question)
      // 區分使用者是點擊推薦問句或是點擊過往的問句
      this.$store.dispatch('dataSource/updateResultRouter', this.content.type === 'System' ? 'click_recommend_chatbot' : 'click_history')
    }
  }
}
</script>
<style lang="scss" scoped>
.conversation-block {
  text-align: left;
  line-height: 28px;
  margin-bottom: 32px;
  max-width: 240px;

  &.user {
    text-align: right;
    align-self: flex-end;
    color: #98FFFF;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    padding: 5px 16px;
    box-shadow: 0 0 1px 1px #679ca0 inset;
    transition: all 0.3s;

    &:hover {
      background-color: $theme-color-primary;
      color: #fff;
    }

    &:active {
      background-color: #42A5B3;
      color: #fff;
    }

    .response {
      cursor: pointer;
    }
  }

  &.system {

  }

  .option-list {
    margin-top: 12px;
  }

  .response {
    position: relative;
    display: inline-block;
    text-align: left;

    .icon {
      position: absolute;
      transform: rotate(90deg);
      top: 6px;
      left: -12px;
      width: 10px;
    }
  }

  .option {
    background-color: $theme-bg-lighter-color;
    border-radius: 5px;
    padding: 8px 16px;
    letter-spacing: 0.05em;
    cursor: pointer;
    font-size: 14px;
    line-height: 28px;
    transition: background-color 0.3s;
    border: 1px solid #9DBDBD;

    &:hover {
      background-color: rgba(101, 207, 217, 0.45);
    }

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
}
</style>
