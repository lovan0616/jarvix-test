<template>
  <nav
    :class="{ 'sidenav--opened': isShowFullSideNav }"
    class="sidenav"
    @click.self="closeSideNav"
  >
    <div class="sidenav__container">
      <div
        v-if="accountList && accountList.length > 0" 
        class="sidenav__account"
      >
        <custom-dropdown-select
          :data-list="accountListData()"
          :selected-id="getCurrentAccountId"
          :is-loading="isLoading"
          trigger="click"
          @select="switchAccount"
        >
          <template #display>
            <el-tooltip
              slot="label"
              :content="$t('editing.switchAccount')"
              :disabled="isShowFullSideNav"
              :enterable="false"
              transition=""
              placement="right">
              <div class="dropdown__badge">
                {{ currentAccountName }}
              </div>
            </el-tooltip>
          </template>
        </custom-dropdown-select>
      </div>
      <ul 
        class="sidenav__list--top list"
        @click="closeSideNav"
      >
        <el-tooltip
          slot="label"
          :content="$t('sideNav.home')"
          :disabled="isShowFullSideNav"
          :enterable="false"
          transition=""
          placement="right">
          <li class="list__item">
            <router-link
              :to="accountHomePageRoute()"
              class="list__link"
            >
              <svg-icon 
                icon-class="home" 
                class="list__icon" />
              <span class="list__text">
                {{ $t('sideNav.home') }}
              </span>
            </router-link>
          </li>
        </el-tooltip>
        <el-tooltip
          slot="label"
          :content="$t('sideNav.pinboard')"
          :disabled="isShowFullSideNav"
          :enterable="false"
          transition=""
          placement="right">
          <li class="list__item">
            <router-link
              :to="{ name: 'PersonalPagePinboardList', params: { 'account_id': getCurrentAccountId }}"
              class="list__link"
            >
              <svg-icon 
                icon-class="pin" 
                class="list__icon" />
              <span class="list__text">
                {{ $t('sideNav.pinboard') }}
              </span>
            </router-link>
          </li>
        </el-tooltip>
        <el-tooltip
          v-if="hasPermission('account_update_user')"
          slot="label"
          :content="$t('sideNav.accountManagement')"
          :disabled="isShowFullSideNav"
          :enterable="false"
          transition=""
          placement="right">
          <li class="list__item">
            <router-link
              :to="{ name: 'AccountManagement', params: { 'account_id': getCurrentAccountId } }"
              class="list__link"
            >
              <svg-icon 
                icon-class="account-management" 
                class="list__icon" />
              <span class="list__text">
                {{ $t('sideNav.accountManagement') }}
              </span>
            </router-link>
          </li>
        </el-tooltip>
      </ul>
      <ul class="sidenav__list--bottom list">
        <el-tooltip
          slot="label"
          :content="$t('sideNav.preferences')"
          :disabled="isShowFullSideNav"
          :enterable="false"
          transition=""
          placement="right">
          <li ref="preferencesIcon">
            <a 
              :class="{'active': isShowUserPreferences}" 
              href="javascript:void(0);"
              class="list__link"
              @click="isShowUserPreferences = !isShowUserPreferences"
            >
              <svg-icon
                icon-class="user-setting"
                class="list__icon" />
              <span class="list__text">
                {{ $t('sideNav.preferences' ) }}
              </span>
              <div class="list__arrow" />
            </a>
          </li>
        </el-tooltip>
      </ul>
      <div 
        v-if="isShowUserPreferences"
        ref="preferences"
        class="user-preferences preferences">
        <h3 class="preferences__name"> {{ userName }} </h3>
        <p class="preferences__email"> {{ userEmail }} </p>
        <p class="preferences__role"> {{ roleOptions[currentUserRole] }} </p>
        <li
          v-for="item in settingList"
          :key="item.title"
          class="preferences__item"
        >
          <a 
            href="javascript:void(0);" 
            class="preferences__link"
            @click="switchDialogName(item.dialogDisplayHandler)"
          >
            <svg-icon 
              :icon-class="item.icon"
              class="preferences__icon" />
            <span class="preferences__text">
              {{ $t(item.title) }}
            </span>
          </a>
        </li>
      </div>
      <change-pwd-dialog
        v-if="isShowChangePwdDialog"
        @closeDialog="controlChangePwdDialog(false)"
      />
      <change-language-dialog
        v-show="isShowLanguage"
        @closeDialog="isShowLanguage = false"
      />
      <decide-dialog
        v-if="isShowLogout"
        :title="$t('editing.sureLogout')"
        :type="'confirm'"
        :btn-text="$t('button.logout')"
        @closeDialog="isShowLogout = false"
        @confirmBtn="onBtnExitClick"
      />
    </div>
  </nav>
</template>

<script>
import { getAccountRoles } from '@/API/User'
import DecideDialog from '@/components/dialog/DecideDialog'
import ChangeLanguageDialog from '@/components/dialog/ChangeLanguageDialog';
import ChangePwdDialog from '@/components/dialog/ChangePwdDialog';
import SySelect from '@/components/select/SySelect'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'AppSideNav',
  components: {
    DecideDialog,
    SySelect,
    CustomDropdownSelect,
    ChangeLanguageDialog,
    ChangePwdDialog
  },
  data () {
    return {
      isShowLanguage: false,
      isShowLogout: false,
      isShowChangePwdDialog: false,
      isShowUserPreferences: false,
      selectedLanguage: null,
      isLoading: false,
      roleOptions: {}
    }
  },
  computed: {
    ...mapState(['isShowFullSideNav']),
    ...mapState('userManagement', ['userName', 'userEmail', 'accountList', 'groupList']),
    ...mapState('setting', ['locale']),
    ...mapState('dataSource', ['dataSourceId', 'dataFrameId']),
    ...mapGetters('userManagement', ['getCurrentAccountName', 'getCurrentAccountId', 'hasPermission', 'getCurrentGroupId']),
    currentAccountName () {
      const fullName = this.getCurrentAccountName
      if (!fullName) return '-'
      return this.isShowFullSideNav ? fullName : fullName[0]
    },
    currentUserRole () {
      return this.accountList.filter(element => element.id === this.getCurrentAccountId)[0]['role']
    },
    settingList () {
      return [
        {icon: 'key', title: 'user.changePwd', dialogDisplayHandler: 'isShowChangePwdDialog'},
        {icon: 'language', title: 'editing.languageSetting', dialogDisplayHandler: 'isShowLanguage'},
        {icon: 'logout', title: 'button.logout', dialogDisplayHandler: 'isShowLogout'}
      ]
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
    this.getAccountRoleList()
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    ...mapMutations(['updateSideNavStatus']),
    ...mapActions('userManagement', ['switchAccountById']),
    autoHide (evt) {
      if (this.isShowUserPreferences && !this.$refs.preferences.contains(evt.target) && !this.$refs.preferencesIcon.contains(evt.target)) {
        this.closeUserPreferences()
      }
    },
    getAccountRoleList () {
      return getAccountRoles(this.getCurrentAccountId)
        .then(response => {
          this.roleOptions = {}
          response.forEach(role => {
            this.roleOptions[role.name] = this.getAccountRoleLocaleName(role.name)
          })
        })
        .catch(() => {})
    },
    switchDialogName (dialog) {
      this[dialog] = true
    },
    controlChangePwdDialog (data) {
      this.isShowChangePwdDialog = data
    },
    onBtnExitClick () {
      this.$store.dispatch('userManagement/logout')
        .then(() => {
          this.$router.push('/login')
          // 避免重新登入時仍開著
          this.closeSideNav()
        })
    },
    closeSideNav () {
      if(this.isShowFullSideNav)
        this.updateSideNavStatus(false)
    },
    closeUserPreferences () {
      this.isShowUserPreferences = false
    },
    accountHomePageRoute () {
      const groupLessPage = { name: 'PageGrouplessGuidance', params: { 'account_id': this.getCurrentAccountId } }
      const accountHomePage = { name: 'PageIndex', params: { 'account_id': this.getCurrentAccountId, 'group_id': this.getCurrentGroupId } }
      return this.groupList.length === 0 ? groupLessPage : accountHomePage
    },
    accountListData () {
      if (!this.accountList) return []
      return this.accountList
        .map(account => ({
          id: account.id,
          name: account.name
        }))
        .sort((accountOne, accountTwo) => (accountOne.name.toLowerCase() > accountTwo.name.toLowerCase()) ? 1 : -1) 
    },
    switchAccount (accountId) {
      this.isLoading = true
      this.switchAccountById({ accountId })
        .then(() => {
          if (this.groupList.length === 0) {
            return this.$router.push({ 
              name: 'PageGrouplessGuidance',
              params: { 'account_id': accountId }
            })
          } 

          this.$router.push({
            name: 'PageIndex', 
            params: { 
              account_id: accountId, 
              group_id: this.getCurrentGroupId 
            },
            query: {
              ...(this.dataSourceId && { 
                dataSourceId: this.dataSourceId,
                dataFrameId: this.dataFrameId
              })
            }
          })
        })
        .finally(() => this.isLoading = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.sidenav {
  position: fixed;
  top: 0;
  left: $app-side-nav-closed-width;
  bottom: 0;
  z-index: 1000;
  transition: all .1s linear;

  &__container {
    position: fixed;
    top: $header-height;
    left: 0;
    display: flex;
    flex-direction: column;
    width: $app-side-nav-closed-width;
    height: calc(100vh - #{$header-height});
    background: var(--color-bg-3);
    border-right: 1px solid var(--color-border);
    padding-bottom: 10px;
  }
  
  &__account {
    padding: 12px ($app-side-nav-closed-width - 32px) / 2;
  }

  &__list {
    &--top {
      margin: 0;
    }

    &--bottom {
      position: relative;
      border-top: 1px solid var(--color-border);
      margin: auto 0 0 0;
    }
  }

  .list {
    padding: 0;

    &__item {
      list-style-type: none;
      white-space: nowrap;
    }

    &__link {
      padding: 10px ($app-side-nav-closed-width - 24px) / 2;
      display: flex;
      align-items: center;
      color: #CCCCCC;

      &.active {
        color: var(--color-theme);

        .list__icon {
          color: var(--color-theme);
        }
      }
    }

    &__icon {
      display: inline-block;
      margin-right: 0;
      color: #7496A0;
      font-size: 22px;
      flex: 0 0 22px;
    }

    &__text {
      font-weight: bold;
      font-size: 14px;
      flex: 1;
      overflow: hidden;
      width: 0;
      white-space: nowrap;
      opacity: 0;
    }

    &__arrow {
      width: 8px;
      height: 8px;
      right: 13px;
      border: solid #CCCCCC;
      border-width: 2px 2px 0 0;
      border-radius: 1px;
      transform: rotate(45deg);
      opacity: 0;
    }
  }

  /deep/ .dropdown {
    &__list-container {
      left: calc(100% + 16px);
    }

    &__badge {
      text-align: center;
      background: var(--color-bg-6);
      border-radius: 5px;
      line-height: 32px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      /* 避免點擊時選取到文字 */
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
  }

  .user-preferences {
    position: absolute;
    left: $app-side-nav-closed-width;
    bottom: 12px;
    width: 207px;
    background: #232D2D;
    border-radius: 5px;
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));
  }
  
  .preferences {
    padding-top: 10px;
    &__name {
      margin: 0 0 8px 14px;
      font-size: 18px;
      line-height: 21px;
    }

    &__email {
      margin: 0 0 8px 14px;
      font-size: 13px;
      line-height: 15px;
      color: #AAAAAA;
    }

    &__role {
      margin: 0 0 8px 14px;
      font-size: 13px;
      line-height: 15px;
      color: #AAAAAA;
    }

    &__item {
      border-top: 1px solid #394045;
      list-style-type: none;
      white-space: nowrap;

      &:hover {
        opacity: .8;
      }
    }

    &__link {
      padding: 14px;
      display: flex;
      align-items: center;
      color: #CCCCCC;
    }

    &__icon {
      display: inline-block;
      margin-right: 10px;
      color: #7496A0;
      font-size: 17px;
    }

    &__text {
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  &--opened {
    left: $app-side-nav-opened-width;;
    right: 0;
    background: rgba(0, 0, 0, 0.7);

    .sidenav {
      &__container {
        width: $app-side-nav-opened-width;
        transition: width .1s linear;
      }
    }

    .list {
      &__icon {
        margin-right: 13px;
      }

      &__text {
        transition: opacity .1s linear .1s;
        opacity: 1;
      }

      &__arrow {
        transition: opacity .1s linear .1s;
        opacity: 1;
      }
    }

    /deep/ .dropdown {
      &__badge {
        text-align: left;
        padding: 0 12px;
      }
    }

    .user-preferences {
      left: $app-side-nav-opened-width;
    }
  }
}
</style>
