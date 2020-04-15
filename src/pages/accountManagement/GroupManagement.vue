<template>
  <div class="group-management">
    <div class="page-title-row">
      <div class="bread-crumb">
        <span v-if="currentRouteName === currentStageName">{{currentRouteName}}</span>
        <template v-else>
          <a
            href="javascript:void(0);"
            class="title-link"
            @click="cancelEditGroup"
          >
            {{currentRouteName}}
          </a>
          <span class="divider">></span>{{currentStageName}}
        </template>
      </div>
      <h1 class="title">{{currentStageName}}</h1>
    </div>
    <component
      :is="currentManagementType"
      :group-list.sync="groupList"
      :is-loading="isLoading"
      @editGroup="editGroup"
      :edit-data="editData"
      @cancelEdit="cancelEditGroup"
      @finishEdit="finishEditGroup"
    ></component>
  </div>
</template>
<script>
import AccountGroupList from './components/AccountGroupList'
import EditAccountGroup from './components/EditAccountGroup'
import { getAccountGroupList } from '@/API/User'

export default {
  name: 'GroupManagement',
  components: {
    AccountGroupList,
    EditAccountGroup
  },
  data () {
    return {
      isLoading: false,
      groupList: [],
      editData: {},
      currentManagementType: 'AccountGroupList'
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    currentRouteName () {
      const routeName = this.$route.name
      return this.$t('sideNav.' + routeName.charAt(0).toLowerCase() + routeName.slice(1))
    },
    currentStageName () {
      if (this.currentManagementType === 'AccountGroupList') {
        return this.$t('sideNav.accountGroupManagement')
      } else if (this.editData.type === 'create') {
        return this.$t('button.createGroup')
      } else if (this.editData.type === 'edit') {
        return this.$t('button.editGroupName')
      }
    }
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getAccountGroupList()
        .then(groupList => {
          this.groupList = groupList
          this.isLoading = false
        })
        .catch(() => { this.isLoading = false })
    },
    editGroup (editData) {
      this.editData = editData
      this.currentManagementType = 'EditAccountGroup'
    },
    cancelEditGroup () {
      this.editData = {}
      this.currentManagementType = 'AccountGroupList'
    },
    finishEditGroup () {
      this.editData = {}
      this.currentManagementType = 'AccountGroupList'
    }
  }
}
</script>

<style lang="scss" scoped>
.group-management {
  .page-title-row {
    margin-bottom: 16px;

    .title {
      margin-top: .4rem;
      font-size: 24px;
      line-height: 32px;
    }

    .bread-crumb {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 1px;
    }

    .title-link {
      color: $theme-color-primary;
      text-decoration: underline;
    }

    .divider {
      margin: 0 .5rem;
    }
  }

}
</style>
