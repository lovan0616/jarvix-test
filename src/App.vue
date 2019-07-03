<template>
  <div id="app">
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
  watch: {
    // 監聽 bookmark 清單是否有 bookmark 正在建置中
    isBookmarkBuilding (value, oldValue) {
      if (value) {
        this.intervalFunction = window.setInterval(() => {
          this.$store.dispatch('bookmark/getBookmarkList')
        }, 30000)
      }
      // 建置完成
      if (!value && oldValue) {
        window.clearInterval(this.intervalFunction)
        Message({
          message: '资料源建立完成',
          type: 'success',
          duration: 3 * 1000
        })
      }
    }
  },
  methods: {
  },
  computed: {
    isBookmarkBuilding () {
      return this.$store.getters['bookmark/isBookmarkBuilding']
    }
  }
}
</script>
