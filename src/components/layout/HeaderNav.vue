<template>
  <nav class="nav-header">
    <router-link class="nav-item" to="/" exact>{{ $t('nav.index') }}</router-link>
    <router-link class="nav-item" to="/pinboard">{{ $t('nav.pinboard') }}</router-link>
    <router-link class="nav-item" to="/data-management">{{ $t('nav.dataManagement') }}</router-link>
    <sy-select class="nav-select"
      :placeholder="$t('nav.languagePlaceholder')"
      :selected="language"
      :items="selectItems"
      v-on:update:selected="onSelected"
    ></sy-select>
    <div class="btn-exit"
      @click="onBtnExitClick"
    >
      <svg-icon icon-class="exit" class="icon"></svg-icon>
    </div>
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
    },
    onBtnExitClick () {
      localStorage.removeItem('token')
      this.$router.push('/login')
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
    width: 70px;
    align-items: center;
  }

  .btn-exit {
    display: flex;
    width: 50px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
