<template>
  <div class="app-layout">
    <app-header>
      <HeaderNav slot="nav" />
    </app-header>
    <transition 
      name="fade" 
      mode="out-in">
      <router-view />
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
  data () {
    return {
      intervalFunction: null
    }
  },
  computed: {
    isDataSourceBuilding () {
      return this.$store.getters['dataSource/isDataSourceBuilding']
    },
    dataSourceBuildingStatusList () {
      return this.$store.getters['dataSource/dataSourceBuildingStatusList']
    }
  },
  watch: {
    // 監聽有 dataframe 建置中的 dataSource 清單是否有變化
    dataSourceBuildingStatusList (newValue, oldValue) {
      if (newValue.length === 0 && oldValue.length === 0) return
      if (newValue.length > 0) {
        window.clearInterval(this.intervalFunction)
        this.intervalFunction = window.setInterval(() => {
          this.$store.dispatch('dataSource/getDataSourceList', {})
        }, 5000)
      }

      // 確認有無資料表建立完成
      if (!this.hasDataFrameBuilt(newValue, oldValue)) return

      // 避免建置完的 datasource 為當前的，需要重新取得其新的 dataframe list
      this.$store.dispatch('dataSource/updateDataFrameList')
        .then(() => {
          Message({
            message: this.$t('message.dataFrameBuilt'),
            type: 'success',
            duration: 3 * 1000
          })

          if (newValue.length === 0) window.clearInterval(this.intervalFunction)
        })
    }
  },
  created () {
    this.setDataSourceInfo()
  },
  destroyed () {
    window.clearInterval(this.intervalFunction)
    this.$store.commit('dataSource/setDataSourceList', [])
    this.$store.commit('dataSource/setIsInit', false)
  },
  methods: {
    setDataSourceInfo () {
      this.$store.dispatch('dataSource/init')
    },
    hasDataFrameBuilt (newList, oldList) {
      const newDataSourceList = new Set(newList.map(item => item.id))
      for (let i = 0; i < oldList.length; i++) {
        if (
          !newDataSourceList.has(oldList[i].id)
          || !newList[i].processDataFrameCount
          || oldList[i].processDataFrameCount > newList[i].processDataFrameCount
        ) return true
      }
      return false
    }
  },
}
</script>
<style lang="scss" scoped>
.app-layout {
  width: 100%;
  position: relative;
}
</style>
