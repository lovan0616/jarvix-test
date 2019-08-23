<template>
  <div class="conversation-block"
    :class="[{'is-default': isDefault}, content.type === 'System' ? 'system' : 'user']"
  >
    <div class="response"
      @click="askAgain(content.text)"
    >{{ content.text }}</div>
    <div class="option-list"
      v-show="content.options"
    >
      <div class="option"
        v-for="(option, index) in content.options"
        :key="index + '-option-' + new Date().getTime()"
        @click="askChatBot(option.text)"
      >{{ option.text }}</div>
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
    },
    isDefault: {
      type: Boolean,
      default: false
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
      this.$store.commit('bookmark/setAppQuestion', value)
      this.$store.dispatch('bookmark/updateResultRouter')
    },
    askChatBot (value) {
      this.$store.commit('bookmark/setAppQuestion', value)
      this.$store.dispatch('bookmark/updateResultRouter')
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
      background-color: #4DE2F0;
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

  &.is-default {
    width: 100%;
    text-align: center;
    margin: 0 auto;

    .response {
      font-size: 18px;
      line-height: 32px;
      text-align: center;
    }
  }

  .option-list {
    margin-top: 12px;
  }

  .response {
    display: inline-block;
    text-align: left;
  }

  .option {
    background-color: $theme-bg-lighter-color;
    border-radius: 5px;
    padding: 5px 16px;
    letter-spacing: 0.05em;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(101, 207, 217, 0.45);
    }

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
}
</style>
