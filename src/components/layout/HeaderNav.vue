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
    <select-dialog 
    v-if="isShowLanguage"
    :title="$t('editing.languageSetting')"
    :button="$t('button.change')"
    @closeDialog="closeLangDialog"
    @confirmBtn="changeLang"
    :showBoth="true"
    >
        <sy-select class="dialog-select"
        :placeholder="$t('nav.languagePlaceholder')"
        :selected="language"
        :items="selectItems"
        v-on:update:selected="onSelected"
        ></sy-select>
    </select-dialog>

    <setting-dialog
    v-if="isShowLogout"
    :title="$t('editing.sureLogout')"
    :type="'logout'"
    @closeDialog="closeLogoutDialog"
    @confirmBtn="onBtnExitClick"
    >
    </setting-dialog>
  </nav>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import SetSelect from '@/components/select/SetSelect'
import SettingDialog from '@/components/dialog/SettingDialog'
import SelectDialog from '@/components/dialog/SelectDialog'
import { mapGetters } from 'vuex'

export default {
  name: 'HeaderNav',
  components: {
    SySelect,
    SetSelect,
    SettingDialog,
    SelectDialog
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

    .nav-set-icon:hover{
      color: #fff;
    }

    .setRotate{
      transform: rotate(180deg);
      transition: all 0.3s;
    }
  }
}
</style>
