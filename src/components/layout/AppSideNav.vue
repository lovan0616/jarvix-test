<template>
  <section
    :class="{ 'sidenav--opened': isShowFullSideNav }"
    class="sidenav"
  >
    <ul class="nav-list list">
      <li class="list__item dropdown">
        <div 
          :class="{ 'dropdown__badge--full': isShowFullSideNav }"
          class="dropdown__badge"
          @click="isShowChangeAccount = !isShowChangeAccount"
        >
          {{ currentAccountName }}
        </div>
        <ul 
          v-if="isShowChangeAccount"
          class="dropdown__list"
        >
          <li
            v-for="account in accountList"
            :key="account.id"
            class="dropdown__item"
          >
            <a 
              :class="{ 'dropdown__link--selected': isCurrentAccount(account.id) }" 
              href="javascript:void(0);"
              class="dropdown__link"
            >
              {{ account.name }}
            </a>
          </li>
        </ul>
      </li>
      <li class="list__item">
        <router-link
          :to="{ name: 'PageIndex' }"
          :class="{'active': $route.name === 'PageIndex'}"
          class="list__link"
          exact
        >
          <svg-icon 
            icon-class="home" 
            class="list__icon" />
          <span 
            :class="{ 'list__text--show': isShowFullSideNav }"
            class="list__text"
          >
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
          <span 
            :class="{ 'list__text--show': isShowFullSideNav }"
            class="list__text"
          >
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
          <span 
            :class="{ 'list__text--show': isShowFullSideNav }"
            class="list__text"
          >
            {{ $t('sideNav.accountManagement') }}
          </span>
        </router-link>
      </li>
    </ul>
    <ul class="setting-list list">
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
          <span 
            :class="{ 'list__text--show': isShowFullSideNav }"
            class="list__text"
          >
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
  </section>
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import SySelect from '@/components/select/SySelect'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AppSideNav',
  components: {
    DecideDialog,
    WritingDialog,
    SySelect
  },
  data () {
    return {
      isShowChangeAccount: false,
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
    isCurrentAccount(id) {
      return id === this.getCurrentAccountId
    },
    switchDialogName (dialog) {
      this[dialog] = true
    },
    changeLang () {
      this.$store.commit('setting/setLocale', this.selectedLanguage)
      this.isShowLanguage = false
    },
    langOnSelected (item) {
      this.selectedLanguage = item
    },
    onBtnExitClick () {
      this.$store.dispatch('userManagement/logout').then(() => {
        this.$router.push('/login')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.sidenav {
  position: fixed;
  top: $header-height;
  display: flex;
  flex-direction: column;
  width: 64px;
  height: calc(100vh - #{$header-height});
  background: #182D30;
  z-index: 2;
  transition: width .1s linear;
  border-right: 1px solid #2B3638;

  &--opened {
    width: 240px;
  }

  .list {
    padding: 12px 16px;
    margin: 0;

    &__item {
      list-style-type: none;
      height: 32px;
      
      &:not(:last-of-type) {
        margin-bottom: 22px;
      }
    }

    &__link {
      padding: 0;
      display: flex;
      width: 100%;
      align-items: center;
      height: 32px;
      color: #CCCCCC;

      &.active {
        color: #2AD2E2;

        .list__icon {
          color: #2AD2E2;
        }
      }
    }

    &__icon {
      color: #7496A0;
      font-size: 22px;
      transform: translateX(5px);
    }

    &__text {
      opacity: 0;
      width: 0;
      font-weight: bold;
      padding-left: 0;

      &--show {
        width: initial;
        transition: all .1s linear .1s;
        opacity: 1;
        padding-left: 15px;
      }
    }
  }

  .nav-list {

  }

  .setting-list {
    border-top: 1px solid #2B3638;
    margin: auto 0 0 0;
  }

  .dropdown {
    position: relative;

    &__list {
      position: absolute;
      top: 0;
      left: calc(100% + 16px);
      width: 207px;
      z-index: 2;
      background: #232D2D;
      padding: 0;
      border-radius: 5px;
      box-shadow: 0px 4px 10px rgba(58, 178, 189, 0.5);
    }

    &__item {
      list-style-type: none;
      &:not(:last-of-type) {
        border-bottom: 1px solid #394045;
      }
    }

    &__link {
      display: block;
      line-height: 44px;
      cursor: pointer;
      padding: 0 14px;
      color: #CCCCCC;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &::before {
        content: "\2022";
        color: #687072;
        font-weight: bold;
        display: inline-block;
        padding: 0 6px;
      }

      &:hover,
      &--selected {
        color: #FFFFFF;

        &::before {
          color: #2AD2E2;
        }
      }
    }

    &__badge {
      width: 100%;
      height: 100%;
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
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;

      &--full {
        text-align: left;
        padding: 0 12px;
      }
    }
  }
}
</style>
