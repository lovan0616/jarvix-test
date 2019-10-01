<template>
  <div id="app">
    <div class="app-bg"></div>
    <transition name="fade" mode="out-in">
      <router-view v-if="init" :key="language"/>
      <spinner v-else style="height: 100vh;"></spinner>
    </transition>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Spinner from '@/components/Spinner'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Spinner
  },
  data () {
    return {
      intervalFunction: null,
      renderKey: 0,
      init: false
    }
  },
  created () {
    this.$store.dispatch('profile/initProfile').then(res => {
      this.init = true
    }).catch(() => {
      this.init = true
    })
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
    ...mapGetters('profile', ['language']),
    isBookmarkBuilding () {
      return this.$store.getters['bookmark/isBookmarkBuilding']
    }
  }
}
</script>
