<template>
  <nav class="nav-header">
    <section class="nav-left">
      <router-link 
        :class="{'active': $route.name === 'PageIndex'}"
        class="nav-item"
        to="/" 
        exact>{{ $t('nav.index') }}</router-link>
      <!-- FIXME for poc/foxconn_molding -->
      <router-link 
        v-if="isShowAlgorithmBtn" 
        :to="{name: 'PageAlgorithmList'}" 
        class="nav-item">演算法</router-link>
      <div
        v-if="groupId"
        class="nav-item nav-item-dropdown nav-set"
      >
        <div class="nav-set-flex">
          <div>{{ $t('nav.projectManagement') }}</div>
          <svg-icon 
            icon-class="dropdown" 
            class="icon nav-dropdown-icon is-rotate"/>
        </div>
        <dropdown-select
          :bar-data="settingData"
          class="nav-set-dropdown"
          @switchDialogName="switchDialogName"
        />
      </div>
    </section>
    <section class="nav-right">
      <div
        v-if="groupName"
        class="nav-item nav-item-dropdown nav-set group-list"
      >
        <div
          class="nav-set-flex"
          @click="isShowGroup = true"
        >
          <div>{{ groupName }}</div>
          <svg-icon 
            icon-class="switch" 
            class="icon nav-dropdown-icon is-rotate"/>
        </div>
      </div>
      <div v-else>
        <button
          v-if="hasPermission('account_create_group')"
          class="btn-m btn-default btn-create-group"
          @click="$router.push({name: 'AccountGroupManagement'})"
        >
          <svg-icon icon-class="plus" />
          {{ $t('editing.createGroup') }}
        </button>
      </div>
      <router-link
        :to="{name: 'FunctionDescription'}"
        class="nav-item nav-function tooltip-container"
      >
        <svg-icon 
          icon-class="description-white" 
          class="icon"/>
        <div class="tooltip">
          {{ $t('sideNav.functionDescription') }}
        </div>
      </router-link>
    </section>
    <writing-dialog
      v-if="isShowGroup"
      :title="$t('editing.switchGroup')"
      :button="$t('button.change')"
      :is-loading="isLoading"
      :show-both="true"
      @closeDialog="isShowGroup = false"
      @confirmBtn="changeGroup"
    >
      <sy-select 
        :placeholder="$t('nav.groupPlaceholder')"
        :selected="selectedGroupId"
        :items="groupListData()"
        class="dialog-select"
        @update:selected="groupOnSelected"
      />
    </writing-dialog>
  </nav>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import DropdownSelect from '@/components/select/DropdownSelect'
import WritingDialog from '@/components/dialog/WritingDialog'
import { mapGetters, mapState } from 'vuex'
import { switchGroup } from '@/API/User'

export default {
  name: 'HeaderNav',
  components: {
    SySelect,
    DropdownSelect,
    WritingDialog
  },
  data () {
    return {
      isShowGroup: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission', 'getCurrentGroupName', 'getCurrentAccountId']),
    ...mapState('userManagement', ['userName', 'license']),
    isShowAlgorithmBtn () {
      return localStorage.getItem('isShowAlgorithmBtn') === 'true'
    },
    groupName () {
      return this.$store.getters['userManagement/getCurrentGroupName']
    },
    groupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    settingData () {
      const settingList = []
      if (this.hasPermission(['group_read_user', 'group_read_data'])) {
        settingList.push({icon: 'database', title: 'sideNav.dataSourceManagement', name: 'DataSourceList'})
      }
  
      // 個人版 隱藏成員管理選項
      if (this.license.maxUser !== 1) {
        settingList.push({icon: 'userManage', title: 'sideNav.groupUserManagement', path: `/group/user-management/${this.groupId}`})
      }
      return settingList
    }
  },
  watch: {
    groupId (value) {
      this.selectedGroupId = value
    }
  },
  mounted () {
    this.selectedGroupId = this.groupId
    // 讓demo人員可以從localStorage打開nav演算法按法
    this.setIsShowAlgorithmBtn()
  },
  methods: {
    setIsShowAlgorithmBtn () {
      let preSetting = localStorage.getItem('isShowAlgorithmBtn')
      if (preSetting !== 'true') {
        localStorage.setItem('isShowAlgorithmBtn', 'false')
      }
    },
    groupOnSelected (item) {
      this.selectedGroupId = item
    },
    changeGroup () {
      this.isLoading = true
      switchGroup({
        accountId: this.getCurrentAccountId,
        groupId: this.selectedGroupId
      })
        .then(() => this.$store.dispatch('userManagement/getUserInfo'))
        .then(() => {
            // 先清空，因為新群組有可能沒有 dataSource
            this.$store.commit('dataSource/setDataSourceId', null)
            // update data source list
            return this.$store.dispatch('dataSource/getDataSourceList', {})
        })
        .then(() => {
          if (this.$route.name !== 'PageIndex') this.$router.push({name: 'PageIndex'})
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
  },
}
</script>
<style lang="scss" scoped>
.nav-header {
  margin-left: 24px;
  display: flex;
  flex: 1;
  justify-content: space-between;

  .nav-left,
  .nav-right {
    display: flex;
    align-items: center;
  }

  .nav-item {
    position: relative;
    line-height: $header-height;
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

      &::before {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #2AD2E2;
      }
    }
  }

  .group-list {
    color: #2AD2E2;
    &:hover {
      color: #2AD2E2
    }
  }

  .btn-create-group {
    margin-right: 16px;
    border-radius: 16px;
    background: rgba(50, 75, 78, 0.6);
    color: $theme-color-primary;
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

  .nav-function {
    position: relative;
  }
}
</style>
