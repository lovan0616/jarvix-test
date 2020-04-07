<template>
  <nav class="nav-header">
    <div
      class="nav-item"
      v-for="nav in navItems"
      :key="nav.title">
      <router-link
        class="nav-link main-nav-link"
        :to="nav.path"
      >
        {{nav.title}}
      </router-link>
      <template v-if="nav.subNav">
        <router-link
          class="nav-link sub-nav-link"
          v-for="subNav in nav.subNav"
          :key="subNav.title"
          :to="subNav.path"
        >
          {{subNav.title}}
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'SideNav',
  props: {
    navItems: {
      type: Array,
      default: () => []
    }
  }
//   data () {
//     return {
//       navItems: [
//         {
//           title: this.$t('nav.index'),
//           path: '/'
//         },
//         {
//           title: '演算法',
//           path: '/algorithm'
//         },
//         {
//           title: this.$t('nav.pinboard'),
//           path: '/pinboard',
//           subNav: [
//             {
//               title: this.$t('nav.index'),
//               path: '/'
//             },
//             {
//               title: '演算法',
//               path: '/algorithm'
//             }
//           ]
//         }
//       ]
//     }
//   },
}
</script>
<style lang="scss" scoped>
.nav-header {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: rgba(0, 0, 0, .3);

  .nav-link {
    line-height: 54px;
    display: block;
    padding: 0 1rem;
    letter-spacing: 0.5px;
    color: #a7a7a7;
    position: relative;

    &:hover {
      color: #fff;
      background-color: rgba(0, 0, 0, 1);
    }

    &.active {
      color: #fff;
      font-weight: 800;
    }
  }

  .main-nav-link {
    &.active {
      &::before {
        position: absolute;
        content: '';
        top: 0;
        height: 100%;
        left: 0;
        width: 3px;
        background-color: white;
      }
    }
  }

  .sub-nav-link {
    background-color: rgba(0, 0, 0, .3);
  }
}
</style>
