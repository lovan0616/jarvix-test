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
    <div class="related-question-block" v-if="previews.length || previewLoading">
      <spinner v-if="previewLoading" style="margin-bottom:24px;"></spinner>
      <div v-else>
        <div class="block-title">{{ $t('editing.relatedQuesion') }}</div>
        <div class="related-question-list">
          <preview-result-board class="result-board" v-for="(preview, index) in previews" v-bind:key="index"
            :question-info="preview"
          ></preview-result-board>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { askChatBot, getRelatedQuestions } from '@/API/ChatBot'

export default {
  name: 'ResultDisplay',
  data () {
    return {
      layout: null,
      isNoResult: false,
      askCancelFunction: null,
      timeStamp: this.$route.query.stamp,
      previews: [],
      previewLoading: false
    }
  },
  watch: {
    '$route.query' ({ question, action }) {
      if (!question) return false
      this.fetchApiAsk({question, 'bookmark_id': this.dataSourceId, 'action_tag': action, 'chatbot_id': this.chatBotId})
    }
  },
  mounted () {
    this.fetchData()
    this.$events.on('cleanPreview', () => {
      this.previewLoading = false
      this.previews = []
    })
  },
  computed: {
    ...mapGetters('bookmark', ['appQuestion']),
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    chatBotId () {
      return this.$store.state.chatBot.chatBotId
    }
  },
  methods: {
    fetchData () {
      let question = this.$route.query.question
      let dataSourceId = parseInt(this.$route.query.dataSourceId)
      let actionTag = this.$route.query.action
      if (question) {
        this.fetchApiAsk({question, 'bookmark_id': dataSourceId, 'action_tag': actionTag, 'chatbot_id': this.chatBotId})
      }
    },
    clearLayout () {
      this.layout = null
    },
    fetchApiAsk (data) {
      this.isNoResult = false
      this.previews = []
      this.$store.commit('chatBot/addUserConversation', data.question)
      this.$store.commit('chatBot/updateAnalyzeStatus', true)
      this.clearLayout()

      const _this = this
      this.cancelRequest()
      askChatBot(data, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(res => {
          this.$store.dispatch('dataSource/getHistoryQuestionList', this.dataSourceId)
          this.$store.commit('chatBot/updateChatBotId', res.chatbot_id)
          this.timeStamp = this.$route.query.stamp
          if (res.content.changed) {
            this.layout = res.content
          }
          this.previewLoading = true
          this.$nextTick(() => {
            window.setTimeout(() => {
              this.$store.commit('chatBot/updateAnalyzeStatus', false)
              this.$store.commit('chatBot/addSystemConversation', res.respond)
              getRelatedQuestions(data).then(res => {
                this.previews = res.previews || []
                this.previewLoading = false
              }).catch(() => {
                window.setTimeout(() => {
                  this.previews = []
                  this.previewLoading = false
                }, 100)
              })
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

  .related-question-block {
    background-color: $theme-bg-color;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 28px 28px 4px;

    .block-title {
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 18px;
    }

    .related-question-list {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
