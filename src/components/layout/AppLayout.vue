<template>
  <div class="app-layout">
    <app-header>
      <HeaderNav slot="nav" />
    </app-header>
    <transition name="fade" mode="out-in">
      <router-view ></router-view>
    </transition>
  </div>
</template>
<script>
import AppHeader from './AppHeader'
import HeaderNav from './HeaderNav'
import { Message } from 'element-ui'

export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    HeaderNav
  },
  created () {
    this.setDataSourceInfo()
    this.getUserInfo()
  },
  destroyed () {
    window.clearInterval(this.intervalFunction)
    this.$store.commit('dataSource/setDataSourceList', [])
    this.$store.commit('dataSource/setIsInit', false)
  },
  methods: {
    setDataSourceInfo () {
      this.$store.dispatch('dataSource/init')
    }
  },
  watch: {
    // 監聽 dataSource 清單是否有 dataSource 正在建置中
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
    // 判斷關閉時機
    // '$route.name' (value) {
    //   if (value !== 'PageIndex' && value !== 'PageResult') {
    //     this.$store.commit('updateChatRoomStatus', false)
    //   }
    // }
  },
  computed: {
    isDataSourceBuilding () {
      return this.$store.getters['dataSource/isDataSourceBuilding']
    }
  }
}
</script>
<style lang="scss" scoped>
.app-layout {
  width: 100%;
  position: relative;
}
</style>
