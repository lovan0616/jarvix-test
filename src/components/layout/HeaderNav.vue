<template>
  <nav class="nav-header">
    <router-link class="nav-item" to="/" exact>{{ $t('nav.index') }}</router-link>
    <router-link class="nav-item" to="/pinboard">{{ $t('nav.pinboard') }}</router-link>
    <div class="nav-item nav-item-dropdown nav-set">
      <div class="nav-set-flex">
        <div>{{ $t('nav.setting') }}</div>
        <svg-icon icon-class="dropdown" class="icon nav-dropdown-icon is-rotate"></svg-icon>
      </div>
      <dropdown-select
        class="nav-set-dropdown"
        @switchDialogName="switchDialogName"
        :barData="settingData"
      >
      </dropdown-select>
    </div>
    <div class="nav-item nav-item-dropdown nav-account">
      <div class="nav-set-flex">
        <div>{{ $t('editing.username') }}</div>
        <svg-icon icon-class="dropdown" class="icon nav-dropdown-icon is-rotate"></svg-icon>
      </div>
      <dropdown-select
        class="nav-account-dropdown"
        @switchDialogName="switchDialogName"
        :barData="accountData"
      >
      </dropdown-select>
    </div>
    <writing-dialog
      v-if="isShowLanguage"
      :title="$t('editing.languageSetting')"
      :button="$t('button.change')"
      @closeDialog="isShowLanguage = false"
      @confirmBtn="changeLang"
      :showBoth="true"
    >
      <sy-select class="dialog-select"
        :placeholder="$t('nav.languagePlaceholder')"
        :selected="locale"
        :items="selectItems"
        v-on:update:selected="onSelected"
      ></sy-select>
    </writing-dialog>
    <decide-dialog
      v-if="isShowLogout"
      :title="$t('editing.sureLogout')"
      :type="'confirm'"
      :btnText="$t('button.logout')"
      @closeDialog="isShowLogout = false"
      @confirmBtn="onBtnExitClick"
    >
    </decide-dialog>
  </nav>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import DropdownSelect from '@/components/select/DropdownSelect'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'

export default {
  name: 'HeaderNav',
  components: {
    SySelect,
    DropdownSelect,
    DecideDialog,
    WritingDialog
  },
  data () {
    return {
      isShowLanguage: false,
      isShowLogout: false,
      selectedLanguage: this.language,
      settingData: [
        {icon: 'database', title: 'nav.dataManagement', path: '/data-management'},
        {icon: 'language', title: 'editing.languageSetting', dialogName: 'isShowLanguage'},
        // {icon: 'feedback', title: 'editing.questionFeedback'},
        {icon: 'description', title: 'editing.functionDescription', path: '/function-description'}
      ],
      accountData: [
        // {icon: 'changePassword', title: 'editing.changePassword'},
        {icon: 'userManage', title: 'editing.userManage', path: '/user-management'},
        {icon: 'logout', title: 'button.logout', dialogName: 'isShowLogout'}
      ]
    }
  },
  computed: {
    locale () {
      return this.$store.state.setting.locale
    },
    languages () {
      return this.$store.state.setting.languages
    },
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
      this.selectedLanguage = item
    },
    onBtnExitClick () {
      this.$store.dispatch('userManagement/logout').then(() => {
        this.$router.push('/login')
      })
    },
    changeLang () {
      this.$store.commit('setting/setLocale', this.selectedLanguage)
      this.isShowLanguage = false
    },
    switchDialogName (dialog) {
      this[dialog] = true
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

  .nav-item-dropdown {
    position: relative;
    cursor: pointer;

    .nav-set-flex {
      display: flex;
      align-items: center;
    }
    .nav-dropdown-icon {
      margin-left: 6px;
      width: 8px;
      text-align: center;
      transition: all 0.3s;

      &:hover {
        color: #fff;
      }

    }
  }
  .nav-set {
      &:hover {
        .nav-set-dropdown {
          visibility: visible;
        }

        .is-rotate {
          transform: rotate(180deg);
        }
      }

      &-dropdown {
        visibility: hidden;
      }
  }
  .nav-account {
      &:hover {
        .nav-account-dropdown {
          visibility: visible;
        }

        .is-rotate {
          transform: rotate(180deg);
        }
      }

      &-dropdown {
        visibility: hidden;
      }
  }
}
</style>
