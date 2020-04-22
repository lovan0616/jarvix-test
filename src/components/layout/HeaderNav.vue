<template>
  <nav class="nav-header">
    <section class="nav-left">
      <router-link class="nav-item" to="/" exact>{{ $t('nav.index') }}</router-link>
      <router-link class="nav-item" :to="{name: 'PagePinboardList'}">{{ $t('nav.pinboard') }}</router-link>
      <!-- FIXME for poc/foxconn_molding -->
      <router-link class="nav-item" :to="{name: 'PageAlgorithmList'}">演算法</router-link>
      <div
        class="nav-item nav-item-dropdown nav-set"
        v-if="groupId"
      >
        <div class="nav-set-flex">
          <div>{{ $t('nav.projectManagement') }}</div>
          <svg-icon icon-class="dropdown" class="icon nav-dropdown-icon is-rotate"></svg-icon>
        </div>
        <dropdown-select
          class="nav-set-dropdown"
          @switchDialogName="switchDialogName"
          :barData="settingData"
        >
        </dropdown-select>
      </div>
    </section>
    <section class="nav-right">
      <div
        class="nav-item nav-item-dropdown nav-set group-list"
        v-if="groupName"
      >
        <div
          class="nav-set-flex"
          @click="isShowGroup = true"
        >
          <div>{{ groupName }}</div>
          <svg-icon icon-class="switch" class="icon nav-dropdown-icon is-rotate"></svg-icon>
        </div>
      </div>
      <div class="nav-item nav-item-dropdown nav-account">
        <div class="nav-set-flex">
          <div>{{ userName }}</div>
          <svg-icon icon-class="dropdown" class="icon nav-dropdown-icon is-rotate"></svg-icon>
        </div>
        <dropdown-select
          class="nav-account-dropdown"
          @switchDialogName="switchDialogName"
          :barData="accountData"
        >
        </dropdown-select>
      </div>
      <router-link
        :to="{name: 'FunctionDescription'}"
        class="nav-item nav-function tooltip-container"
      >
        <svg-icon icon-class="description-white" class="icon"></svg-icon>
        <div class="tooltip">
          {{$t('sideNav.functionDescription')}}
        </div>
      </router-link>
    </section>
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
        v-on:update:selected="langOnSelected"
      ></sy-select>
    </writing-dialog>
    <writing-dialog
      v-if="isShowGroup"
      :title="$t('editing.switchGroup')"
      :button="$t('button.change')"
      :is-loading="isLoading"
      @closeDialog="isShowGroup = false"
      @confirmBtn="changeGroup"
      :showBoth="true"
    >
      <sy-select class="dialog-select"
        :placeholder="$t('nav.groupPlaceholder')"
        :selected="selectedGroupId"
        :items="groupListData()"
        v-on:update:selected="groupOnSelected"
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
import { mapGetters } from 'vuex'
import { switchGroup } from '@/API/User'

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
      isShowGroup: false,
      selectedLanguage: null,
      selectedGroupId: null,
      userName: this.$store.state.userManagement.userName,
      isLoading: false
    }
  },
  mounted () {
    this.selectedLanguage = this.locale
    this.selectedGroupId = this.groupId
  },
  computed: {
    ...mapGetters('userManagement', ['hasAccountPermission', 'hasGroupPermission', 'getCurrentGroupName']),
    locale () {
      return this.$store.state.setting.locale
    },
    groupName () {
      return this.$store.getters['userManagement/getCurrentGroupName']
    },
    groupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    permission () {
      return this.$store.state.setting.permission
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
    },
    settingData () {
      const settingList = []
      settingList.push({icon: 'database', title: 'nav.dataSourceManagement', name: 'PageDataSourceList'})
      settingList.push({icon: 'userManage', title: 'sideNav.groupUserManagement', path: `/group/user-management/${this.groupId}`})
      return settingList
    },
    accountData () {
      const accountList = []
      if (this.hasAccountPermission('account_update_user')) {
        accountList.push({icon: 'account-management', title: 'sideNav.accountManagement', name: 'AccountUserManagement'})
      }
      accountList.push({icon: 'language', title: 'editing.languageSetting', dialogName: 'isShowLanguage'})
      accountList.push({icon: 'logout', title: 'button.logout', dialogName: 'isShowLogout'})
      return accountList
    }
  },
  methods: {
    langOnSelected (item) {
      this.selectedLanguage = item
    },
    groupOnSelected (item) {
      this.selectedGroupId = item
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
    changeGroup () {
      this.isLoading = true
      switchGroup(this.selectedGroupId)
        .then(res => {
          // update user info
          this.$store.commit('userManagement/setUserInfo', {
            userName: res.name,
            accountList: res.accountList,
            accountPermission: res.accountPermission,
            groupList: res.groupList,
            groupPermission: res.groupPermission
          })
          // update data source list
          return this.$store.dispatch('dataSource/getDataSourceList')
        })
        .then(() => {
          this.isShowGroup = false
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
    },
    switchDialogName (dialog) {
      this[dialog] = true
    },
    groupListData () {
      const groupList = this.$store.state.userManagement.groupList
      return groupList.map(group => ({
        id: group.groupId,
        name: group.groupName
      }))
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-header {
  margin-left: 80px;
  display: flex;
  flex: 1;
  justify-content: space-between;

  .nav-left,
  .nav-right {
    display: flex;
  }

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

  .group-list {
    color: #2AD2E2;
    &:hover {
      color: #2AD2E2
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

    & >>> .dropdown-select {
      .icon {
        fill: #2AD2E2;
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

  .nav-function {
    position: relative;
  }
}
</style>
