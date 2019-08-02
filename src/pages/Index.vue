<template>
  <div class="page-index">
    <layout
      v-bind="layout"
    ></layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { askChatBot } from '@/API/chatBot'

export default {
  name: 'PageIndex',
  data () {
    return {
      layout: null
    }
  },
  created () {
    this.$store.dispatch('bookmark/init').then(() => {
      this.getLandingInfo()
    })
    // 因為 result page 會 keep-alive，所以才會在這邊做清除資料的動作
    this.$store.commit('bookmark/setAppQuestion', '')
  },
  mounted () {
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId'])
  },
  methods: {
    getLandingInfo () {
      askChatBot({'question': null, 'bookmark_id': this.bookmarkId}).then(res => {
        if (res.content.changed) {
          this.layout = res.content
        }
        this.$store.commit('chatBot/addSystemConversation', res.respond)
      })
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
