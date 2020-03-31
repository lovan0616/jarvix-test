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
import { checkUserPermission } from '@/API/Permission'

export default {
  name: 'App',
  data () {
    return {
      intervalFunction: null,
      renderKey: 0,
      init: false
    }
  },
  created () {
    this.checkLocale()
    this.checkPermission()
  },
  mounted () {
    this.init = true
  },
  methods: {
    checkLocale () {
      let prevLocale = localStorage.getItem('locale')
      let browserScale = (navigator.language || navigator.browserLanguage).toLowerCase()
      browserScale = browserScale === 'zh-tw' ? 'zh-TW' : 'zh-CN'
      let locale = prevLocale || browserScale
      this.$store.commit('setting/setLocale', locale)
    },
    checkPermission () {
      checkUserPermission().then(response => {
        this.$store.commit('setting/setUserPermission', response)
      })
    }
  },
  watch: {
    locale (value) {
      // 更新 i18n
      this.$i18n.locale = value
    }
  },
  computed: {
    locale () {
      return this.$store.state.setting.locale
    }
  }
}
</script>
