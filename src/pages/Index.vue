<template>
  <div class="page-index">
    <layout
      v-bind="layout"
    ></layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { askChatBot } from '@/API/ChatBot'

export default {
  name: 'PageIndex',
  data () {
    return {
      layout: null
    }
  },
  mounted () {
    this.$store.commit('updateChatRoomStatus', true)
    // 變更 bookmark 從其他頁回到首頁的時候，如果是 null 代表如果是直接進首頁的話，會藉由 watch 觸發
    if (this.bookmarkId !== null) {
      this.getLandingInfo()
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId'])
  },
  methods: {
    getLandingInfo () {
      askChatBot({'question': null, 'bookmark_id': this.bookmarkId}).then(res => {
        // 取得對話紀錄用的 chtabot id
        this.$store.commit('chatBot/updateChatBotId', res.chatbot_id)
        if (res.content.changed) {
          this.layout = res.content
        }
        this.$store.commit('chatBot/addSystemConversation', res.respond)
      })
    }
  },
  watch: {
    bookmarkId () {
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
<style lang="scss">
.quick-start-list {
  display: flex;
  justify-content: space-between;
  min-height: 50px;

  .single-result-board {
    width: 31.34%;
  }
}
</style>
