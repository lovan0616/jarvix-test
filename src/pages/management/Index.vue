<template>
  <div class="management-layout">
    <div class="management-wrapper">
      <div class="side-nav">
        <side-nav :navItems="nav" />
      </div>
      <div class="wrapper">
          <main class="main">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </main>
        </div>
    </div>
  </div>
</template>

<script>
import SideNav from '@/components/layout/SideNav'
import { mapGetters } from 'vuex'

export default {
  name: 'Management',
  components: {
    SideNav
  },
  data () {
    return {
      nav: []
    }
  },
  mounted () {
    this.getSideNav()
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission'])
  },
  methods: {
    getSideNav () {
      let currentModule = this.$router.options.routes[0]
      const layerList = this.$route.meta.layers

      for (let i = 0; i < layerList.length; i++) {
        // 依照 layer 往下找到子層
        currentModule = currentModule.children.find(group => group.path === layerList[i])
        if ((layerList.length - i) > 1) continue

        // 建構功能列: 此模組無子功能列表
        if (!currentModule.children) {
          return this.nav.push({
            title: this.$t('sideNav.' + this.lowercaseFirstLetter(currentModule.name)),
            routeName: currentModule.name,
            icon: this.$route.meta.icon
          })
        }

        // 建構功能列: 此模組有子功能列表
        let selectedMainNavIndex = null
        currentModule.children.forEach((navItem, index) => {
          if (!navItem.meta || (navItem.meta.isMainNav && index !== 0)) return

          // 顯示模組
          if (navItem.meta.isMainNav && index === 0) {
            this.nav.push({
              title: this.$t('sideNav.' + this.lowercaseFirstLetter(navItem.name)),
              routeName: navItem.name,
              icon: navItem.meta.icon
            })
            selectedMainNavIndex = index
            this.nav[selectedMainNavIndex].subNav = []

            // 顯示模組子功能列表
          } else {
            if (navItem.meta.isHiddenNav || (navItem.meta.permission && !this.hasPermission(navItem.meta.permission))) return

            this.nav[selectedMainNavIndex].subNav.push({
              title: this.$t('sideNav.' + this.lowercaseFirstLetter(navItem.name)),
              routeName: navItem.name
            })
          }
        })
      }
    }
  },
  watch: {
    $route () {
      this.nav = []
      this.getSideNav()
    }
  }
}
</script>

<style lang="scss" scoped>
.management-layout {
  .management-wrapper {
    width: 100%;
    height: calc(100vh - #{$header-height});
    position: absolute;
    top: $header-height;
    right: 0;
  }

  .side-nav {
    width: $side-nav-width;
    margin: 0 auto 0 0;
    height: calc(100vh - #{$header-height});
  }
  .wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: calc(100% - #{$side-nav-width});
    height: calc(100vh - #{$header-height});
  }

  .main {
    padding-top: 32px;
    padding-bottom: 64px;
    min-height: calc(100vh - #{$header-height});
  }
}
</style>
