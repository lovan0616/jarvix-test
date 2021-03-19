<template>
  <div 
    id="app" 
    :lang="getLang"
    :theme="getColor"
  >
    <div class="app-bg"/>
    <transition 
      name="fade" 
      mode="out-in">
      <router-view 
        v-if="init"
        :key="locale"/>
      <spinner 
        v-else 
        style="height: 100vh;"/>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      intervalFunction: null,
      renderKey: 0,
      init: false
    }
  },
  computed: {
    ...mapState('setting', ['locale', 'languageDefault']),
    getLang () {
      return this.locale.split('-')[0]
    },
    getColor () {
      return sessionStorage.getItem('themeColor')
    }
  },
  watch: {
    locale (value) {
      // 更新 i18n
      this.$i18n.locale = value
    }
  },
  created () {
    this.checkLocale()
    // 檢察系統是否有寄信功能
    this.$store.dispatch('setting/checkSystemInfo')
  },
  mounted () {
    this.init = true
    sessionStorage.setItem('themeColor', 'default')
  },
  methods: {
    checkLocale () {
      let prevLocale = localStorage.getItem('locale')
      let browserLocale = (navigator.language || navigator.browserLanguage).toLowerCase()
      if (browserLocale.includes('en')) {
        browserLocale = 'en-US'
      } else if (browserLocale === 'zh-tw') {
        browserLocale = 'zh-TW'
      } else {
        browserLocale = this.languageDefault
      }
      let locale = prevLocale || browserLocale
      this.$store.commit('setting/setLocale', locale)
    }
  },
}
</script>
