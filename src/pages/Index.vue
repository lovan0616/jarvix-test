<template>
  <div class="page-index">
    <empty-result
      v-if="isNoResult"
      :title="$t('editing.indexErrorTitle')"
      :description="$t('editing.indexErrorDescription')"
    ></empty-result>
    <layout
      v-else
      :key="'layout-' + dataSourceId"
      v-bind="layout"
    ></layout>
  </div>
</template>

<script>
import { askChatBot } from '@/API/ChatBot'

export default {
  name: 'PageIndex',
  data () {
    return {
      isNoResult: false,
      layout: null
    }
  },
  mounted () {
    this.$store.commit('updateChatRoomStatus', true)
    // 變更 bookmark 從其他頁回到首頁的時候，如果是 null 代表如果是直接進首頁的話，會藉由 watch 觸發
    if (this.dataSourceId !== null) {
      this.getLandingInfo()
    }
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    }
  },
  methods: {
    getLandingInfo () {
      this.$store.commit('chatBot/updateAnalyzeStatus', true)
      askChatBot({'question': null, 'bookmark_id': this.dataSourceId}).then(res => {
        // 取得對話紀錄用的 chtabot id
        this.$store.commit('chatBot/updateChatBotId', res.chatbot_id)
        if (res.content.changed) {
          this.layout = res.content
        }
        this.$store.commit('chatBot/updateAnalyzeStatus', false)
        this.$store.commit('chatBot/addSystemConversation', res.respond)
      }).catch(() => {
        this.isNoResult = true
      })
    }
  },
  watch: {
    dataSourceId () {
      this.layout = null
      this.isNoResult = false
      this.getLandingInfo()
    }
  }
}
</script>
<style lang="scss" scoped>
.page-index {
  margin: 0 auto;
  text-align: center;
}
</style>
