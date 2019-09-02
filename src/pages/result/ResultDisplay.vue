<template>
  <div class="result-layout">
    <empty-result
      v-if="isNoResult"
    ></empty-result>
    <layout
      v-else
      :key="timeStamp"
      v-bind="layout"
    ></layout>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { askChatBot } from '@/API/ChatBot'

export default {
  name: 'ResultDisplay',
  data () {
    return {
      layout: null,
      isNoResult: false,
      askCancelFunction: null,
      timeStamp: this.$route.query.stamp
    }
  },
  watch: {
    '$route.query' ({ question, action }) {
      if (!question) return false
      this.fetchApiAsk({question, 'bookmark_id': this.bookmarkId, 'action_tag': action, 'chatbot_id': this.chatBotId})
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'appQuestion']),
    chatBotId () {
      return this.$store.state.chatBot.chatBotId
    }
  },
  methods: {
    fetchData () {
      let question = this.$route.query.question
      let bookmarkId = parseInt(this.$route.query.bookmarkId)
      let actionTag = this.$route.query.action
      if (question) {
        this.fetchApiAsk({question, 'bookmark_id': bookmarkId, 'action_tag': actionTag, 'chatbot_id': this.chatBotId})
      }
    },
    clearLayout () {
      this.layout = null
    },
    fetchApiAsk (data) {
      this.isNoResult = false
      this.$store.commit('chatBot/addUserConversation', data.question)
      this.$store.commit('chatBot/updateAnalyzeStatus', true)
      this.clearLayout()

      const _this = this
      this.cancelRequest()
      askChatBot(data, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(res => {
          this.$store.commit('chatBot/updateChatBotId', res.chatbot_id)
          this.timeStamp = this.$route.query.stamp
          if (res.content.changed) {
            this.layout = res.content
          }
          this.$nextTick(() => {
            window.setTimeout(() => {
              this.$store.commit('chatBot/updateAnalyzeStatus', false)
              this.$store.commit('chatBot/addSystemConversation', res.respond)
            }, 2000)
          })
        }).catch(() => {
          this.isNoResult = true
          this.$store.commit('chatBot/updateAnalyzeStatus', false)
        })
    },
    cancelRequest () {
      if (typeof this.askCancelFunction === 'function') {
        this.askCancelFunction('cancel request')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.result-page {
  .result-question-select-block {
    display: flex;
    margin-bottom: 20px;
  }
}
.result-layout {
  width: 100%;

  .seciotn-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }
  .recommend-question-list-block {
    margin-top: 64px;

    .block-title {
      font-size: 24px;
      line-height: 40px;
      letter-spacing: 0.1em;
      margin-bottom: 48px;
    }

    .category-title {
      font-size: 18px;
      line-height: 26px;
      margin-bottom: 12px;
    }
  }

  .category-question-list {
    display: flex;
    flex-wrap: wrap;

    .result-board {
      width: 31.34%;

      &:not(:nth-child(3n)) {
        margin-right: 2.99%;
      }
    }
  }
}
</style>
