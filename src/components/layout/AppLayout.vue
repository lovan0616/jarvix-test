<template>
  <div
    :class="{ 'app-layout--loading': isAppLoading }"
    class="app-layout"
  >
    <app-header>
      <HeaderNav slot="nav" />
    </app-header>
    <AppSideNav />
    <main class="main">
      <transition
        name="fade" 
        mode="out-in">
        <router-view />
      </transition>
    </main>
    <spinner 
      v-if="isAppLoading"
      :title="$t('message.switching')"
      class="spinner"
      size="50"
    />
  </div>
</template>
<script>
import AppHeader from './AppHeader'
import HeaderNav from './HeaderNav'
import AppSideNav from './AppSideNav'
import { Message } from 'element-ui'
import { mapState } from 'vuex'

export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    HeaderNav,
    AppSideNav
  },
  data () {
    return {
      intervalFunction: null
    }
  },
  computed: {
    ...mapState(['isAppLoading']),
    dataSourceBuildingStatusList () {
      return this.$store.getters['dataSource/dataSourceBuildingStatusList']
    },
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    }
  },
  watch: {
    // 監聽有 dataframe 建置中的 dataSource 清單是否有變化
    dataSourceBuildingStatusList (newValue, oldValue) {
      if (newValue.length === 0 && oldValue.length === 0) return
      window.clearInterval(this.intervalFunction)
      if (newValue.length > 0) {
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
        })
    },
    currentGroupId (value, oldValue) {
      if (value && oldValue) {
        window.clearInterval(this.intervalFunction)
      }
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
          || oldList[i].processDataFrameCount > newList.find(dataFrame => dataFrame.id === oldList[i].id).processDataFrameCount
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

  &--loading {
    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1001;
    }
  }

  .main {
    width: calc(100% - #{$app-side-nav-closed-width});
    position: absolute;
    right: 0;
  }

  .spinner {
    position:relative;
    height: 100vh;
    z-index: 1002;
    /* 避免點擊文字 */
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
}
</style>
