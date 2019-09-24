<template>
  <nav class="nav-header">
    <router-link class="nav-item" to="/" exact>首页</router-link>
    <router-link class="nav-item" to="/pinboard">个人钉板</router-link>
    <router-link class="nav-item" to="/data-management">资料管理</router-link>
    <sy-select class="nav-select"
      placeholder="语系"
      :selected="language"
      :items="selectItems"
      v-on:update:selected="onSelected"
    ></sy-select>
  </nav>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import { mapGetters } from 'vuex'

export default {
  name: 'HeaderNav',
  components: {
    SySelect
  },
  computed: {
    ...mapGetters('profile', ['language', 'languages']),
    selectItems () {
      return Object.keys(this.languages).map(key => {
        return {
          id: key,
          name: this.languages[key]
        }
      })
    }
  },
  methods: {
    onSelected (item) {
      this.$store.dispatch('profile/updateLanguage', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-header {
  display: flex;
  flex: 1;
  justify-content: flex-end;

  .nav-item {
    line-height: 54px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #a7a7a7;

    &:not(:last-child) {
      margin-right: 30px;
    }

    &:hover {
      color: #fff;
    }

    &.active {
      color: #fff;
      border-bottom: 2px solid #fff;
    }
  }

  .nav-select {
    display: flex;
    width: 100px;
    align-items: center;
  }
}
</style>
