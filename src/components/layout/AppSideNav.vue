<template>
  <nav
    :class="{ 'sidenav--opened': isShowFullSideNav }"
    class="sidenav"
    @click.self="closeSideNav"
  >
    <div class="sidenav__container">
      <div 
        v-if="accountList && accountList.length > 0" 
        class="sidenav__account">
        <!-- TODO: 串接 change account API 時須改：:data-list="accountList"  -->
        <custom-dropdown-select
          :data-list="[]"
          :selected-id="getCurrentAccountId"
          trigger="click"
          @select="changeAccount"
        >
          <template #display>
            <div class="dropdown__badge">
              {{ currentAccountName }}
            </div>
          </template>
        </custom-dropdown-select>
      </div>
      <ul 
        class="sidenav__list--top list"
        @click="closeSideNav"
      >
        <li class="list__item">
          <router-link
            :to="{ name: 'PageIndex' }"
            :class="{ 'active': $route.name === 'PageIndex' }"
            class="list__link"
            exact
          >
            <svg-icon 
              icon-class="home" 
              class="list__icon" />
            <span class="list__text">
              {{ $t('sideNav.home') }}
            </span>
          </router-link>
        </li>
        <li class="list__item">
          <router-link
            :to="{ name: 'PagePinboardList' }"
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
        <li
          v-if="hasPermission('account_update_user')"
          class="list__item"
        >
          <router-link
            :to="{ name: 'AccountManagement' }"
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
      </ul>
      <ul class="sidenav__list--bottom list">
        <li
          v-for="item in settingList"
          :key="item.title"
          class="list__item"
        >
          <a 
            href="javascript:void(0);" 
            class="list__link"
            @click="switchDialogName(item.dialogName)"
          >
            <svg-icon 
              :icon-class="item.icon" 
              class="list__icon" />
            <span class="list__text">
              {{ $t(item.title) }}
            </span>
          </a>
        </li>
      </ul>
      <writing-dialog
        v-if="isShowLanguage"
        :title="$t('editing.languageSetting')"
        :button="$t('button.change')"
        :show-both="true"
        @closeDialog="isShowLanguage = false"
        @confirmBtn="changeLang"
      >
        <sy-select 
          :placeholder="$t('nav.languagePlaceholder')"
          :selected="locale"
          :items="selectItems"
          class="dialog-select"
          @update:selected="langOnSelected"
        />
      </writing-dialog>
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
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import SySelect from '@/components/select/SySelect'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AppSideNav',
  components: {
    DecideDialog,
    WritingDialog,
    SySelect,
    CustomDropdownSelect
  },
  data () {
    return {
      isShowLanguage: false,
      isShowLogout: false,
      selectedLanguage: null,
    }
  },
  computed: {
    ...mapState(['isShowFullSideNav']),
    ...mapState('userManagement', ['accountList']),
    ...mapGetters('userManagement', ['getCurrentAccountName', 'getCurrentAccountId', 'hasPermission']),
    currentAccountName() {
      const fullName = this.getCurrentAccountName
      if (!fullName) return '-'
      return this.isShowFullSideNav ? fullName : fullName[0]
    },
    settingList () {
      return [
        {icon: 'language', title: 'editing.languageSetting', dialogName: 'isShowLanguage'},
        {icon: 'logout', title: 'button.logout', dialogName: 'isShowLogout'}
      ]
    },
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
    },
  },
  methods: {
    ...mapMutations(['updateSideNavStatus']),
    switchDialogName (dialog) {
      this[dialog] = true
    },
    changeLang () {
      this.$store.commit('setting/setLocale', this.selectedLanguage)
      this.isShowLanguage = false
      this.closeSideNav()
    },
    langOnSelected (item) {
      this.selectedLanguage = item
    },
    onBtnExitClick () {
      this.$store.dispatch('userManagement/logout')
        .then(() => {
          this.$router.push('/login')
          // 避免重新登入時仍開著
          this.closeSideNav()
        })
    },
    closeSideNav() {
      if(this.isShowFullSideNav) this.updateSideNavStatus(false)
    },
    changeAccount(accountId) {
      // TODO: change account feature
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
    background: #182D30;
    border-right: 1px solid #2B3638;
  }
  
  &__account {
    padding: 12px 16px;
  }

  &__list {
    &--top {
      margin: 0;
    }

    &--bottom {
      border-top: 1px solid #2B3638;
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
      padding: 22px 21px;
      display: flex;
      align-items: center;
      color: #CCCCCC;

      &.active {
        color: #2AD2E2;

        .list__icon {
          color: #2AD2E2;
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
      flex: 1;
      overflow: hidden;
      width: 0;
      white-space: nowrap;
      opacity: 0;
    }
  }

  /deep/ .dropdown {
    &__list {
      left: calc(100% + 16px);
    }

    &__badge {
      text-align: center;
      background: #1F3B3F;
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
    }

    /deep/ .dropdown {
      &__badge {
        text-align: left;
        padding: 0 12px;
      }
    }
  }
}
</style>