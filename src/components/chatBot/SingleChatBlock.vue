<template>
  <div class="conversation-block"
    :class="[{'is-default': isDefault}, content.type === 'System' ? 'system' : 'user']"
  >
    <div class="response">{{ content.text }}</div>
    <div class="option-list">
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
    this.$el.scrollIntoView({behavior: 'smooth', block: 'start'})
  },
  methods: {
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
  width: 240px;

  &.user {
    text-align: right;
    align-self: flex-end;
    color: #98FFFF;
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
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 5px 16px;
    letter-spacing: 0.05em;
    cursor: pointer;
    font-size: 14px;
    transition: color 0.3s;

    &:hover {
      background-color: rgba(101, 207, 217, 0.45);
    }

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
}
</style>
