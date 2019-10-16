<template>
  <nav class="nav-header">
    <router-link class="nav-item" to="/" exact>{{ $t('nav.index') }}</router-link>
    <router-link class="nav-item" to="/pinboard">{{ $t('nav.pinboard') }}</router-link>
    <router-link class="nav-item" to="/data-management">{{ $t('nav.dataManagement') }}</router-link>
    <div @mouseover="openSet" @mouseleave="closeSet" class="nav-item nav-set">
        <div class="nav-set-flex">
          <div>{{ $t('nav.setting') }}</div>
          <svg-icon icon-class="dropdown" :class="{setRotate: isShow}" class="icon nav-set-icon"></svg-icon>
        </div>
        <set-select
        v-if="isShow"
        @showLang="showLangDialog"
        @showLogout="showLogoutDialog"
        >
        </set-select>
    </div>

    <setting-dialog @closeDialog="closeLangDialog" v-if="isShowLanguage" ref="langDialog">
        <div class="popup-lang-text">{{ $t('editing.languageSetting') }}</div>
        <sy-select class="popup-lang-select"
        :placeholder="$t('nav.languagePlaceholder')"
        :selected="language"
        :items="selectItems"
        v-on:update:selected="onSelected"
        ></sy-select>
        <div class="popup-lang-flex">
            <div @click="closeLangDialog" class="btn popup-cancel">{{ $t('button.cancel') }}</div>
            <div @click="changeLang" class="btn btn-default popup-logout">{{ $t('button.change') }}</div>
        </div>
    </setting-dialog>

    <setting-dialog @closeDialog="closeLogoutDialog" v-if="isShowLogout" ref="logoutDialog">
        <div class="popup-text">{{ $t('editing.sureLogout') }}</div>
        <div class="popup-flex">
            <div @click="closeLogoutDialog" class="btn popup-cancel">{{ $t('button.cancel') }}</div>
            <div @click="onBtnExitClick" class="btn btn-default popup-logout">{{ $t('button.logout') }}</div>
        </div>
    </setting-dialog>
  </nav>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import SetSelect from '@/components/select/SetSelect'
import SettingDialog from '@/components/dialog/SettingDialog'
import { mapGetters } from 'vuex'

export default {
  name: 'HeaderNav',
  components: {
    SySelect,
    SetSelect,
    SettingDialog
  },
  data () {
    return {
      isShow: false,
      isShowLanguage: false,
      isShowLogout: false,
      selectedLanguage: this.language
    }
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
    openSet () {
      this.isShow = true
    },
    closeSet () {
      this.isShow = false
    },
    onSelected (item) {
      this.selectedLanguage = item
    },
    onBtnExitClick () {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    showLangDialog () {
      this.isShowLanguage = true
    },
    closeLangDialog () {
      this.isShowLanguage = false
    },
    changeLang () {
      this.$store.dispatch('profile/updateLanguage', this.selectedLanguage)
      this.isShowLanguage = false
    },
    showLogoutDialog () {
      this.isShowLogout = true
    },
    closeLogoutDialog () {
      this.isShowLogout = false
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

  .nav-set {
    position: relative;
    cursor: pointer;

    .nav-set-flex{
      display: flex;
      align-items: center;
    }

    .nav-set-icon{
      margin-left: 6px;
      width: 12px;
      text-align: center;
    }

    .setRotate{
      transform: rotate(180deg);
      transition: all 0.3s;
    }
  }
}
</style>
