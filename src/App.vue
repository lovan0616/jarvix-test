<template>
  <div id="app">
    <div class="app-bg"></div>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'App',
  data () {
    return {
      intervalFunction: null
    }
  },
  created () {
    this.$store.dispatch('profile/initProfile')
  },
  watch: {
    // 監聽 bookmark 清單是否有 bookmark 正在建置中
    isBookmarkBuilding (value, oldValue) {
      if (value) {
        this.intervalFunction = window.setInterval(() => {
          this.$store.dispatch('bookmark/getBookmarkList')
        }, 5000)
      }
      // 建置完成
      if (!value && oldValue) {
        window.clearInterval(this.intervalFunction)
        Message({
          message: this.$t('message.builded'),
          type: 'success',
          duration: 3 * 1000
        })
      }
    },
    language (lang, oldLang) {
      this.$i18n.locale = lang
    }
  },
  computed: {
    isBookmarkBuilding () {
      return this.$store.getters['bookmark/isBookmarkBuilding']
    },
    language () {
      return this.$store.getters['profile/language']
    }
  }
}
</script>
