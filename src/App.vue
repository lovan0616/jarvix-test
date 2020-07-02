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
    locale () {
      return this.$store.state.setting.locale
    },
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
  },
  mounted () {
    this.init = true
    sessionStorage.setItem('themeColor', 'default')
  },
  methods: {
    checkLocale () {
      let prevLocale = localStorage.getItem('locale')
      let browserScale = (navigator.language || navigator.browserLanguage).toLowerCase()
      if (browserScale.includes('en')) {
        browserScale = 'en-US'
      } else if (browserScale === 'zh-tw') {
        browserScale = 'zh-TW'
      } else {
        browserScale = 'zh-CN'
      }
      let locale = prevLocale || browserScale
      this.$store.commit('setting/setLocale', locale)
    }
  },
}
</script>
