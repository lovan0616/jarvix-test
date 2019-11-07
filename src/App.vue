<template>
  <div id="app">
    <div class="app-bg"></div>
    <transition name="fade" mode="out-in">
      <router-view v-if="init" :key="locale"/>
      <spinner v-else style="height: 100vh;"></spinner>
    </transition>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Spinner from '@/components/Spinner'

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
    this.checkLocale()
  },
  mounted () {
    this.init = true
  },
  methods: {
    checkLocale () {
      let locale = localStorage.getItem('locale')
      let browserScale = (navigator.language || navigator.browserLanguage).toLowerCase()
      if (locale) {
        this.$store.commit('setting/setLocale', locale)
      } else {
        this.$store.commit('setting/setLocale', browserScale === 'zh-tw' ? 'zh-hant' : 'zh-hans')
      }
    }
  },
  watch: {
    locale (value) {
      // 更新 i18n
      this.$i18n.locale = value
    },
    // 監聽 bookmark 清單是否有 bookmark 正在建置中
    isDataSourceBuilding (value, oldValue) {
      if (value) {
        this.intervalFunction = window.setInterval(() => {
          this.$store.dispatch('dataSource/getDataSourceList')
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
    }
  },
  computed: {
    locale () {
      return this.$store.state.setting.locale
    },
    isDataSourceBuilding () {
      return this.$store.getters['dataSource/isDataSourceBuilding']
    }
  }
}
</script>
