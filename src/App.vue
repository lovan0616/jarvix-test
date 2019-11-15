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
      let prevLocale = localStorage.getItem('locale')
      let browserScale = (navigator.language || navigator.browserLanguage).toLowerCase()
      let locale = prevLocale || browserScale
      this.$store.commit('setting/setLocale', locale === 'zh-tw' ? 'zh-TW' : 'zh-CN')
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
