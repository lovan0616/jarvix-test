<template>
  <admin-layout>
    <div class="page-admin container">
      <div class="page-title">
        {{ $t('admin.userList') }}
      </div>
      <div class="condition-block">
        <div class="account-select-block">
          {{ $t('admin.accountName') }}
          <default-select
            v-model="currentAccountId"
            :option-list="accountList"
            class="account-select"
            filterable
            @change="changeAccount"
          />
        </div>
        <input-block
          v-model="searchUserName"
          :placeholder="$t('admin.searchUserName')"
        />
      </div>
      <data-table
        ref="userList"
        :headers="tableHeaders"
        :is-search-result-empty="searchUserName.length > 0 && filterDataList.length === 0"
        :loading="isLoading"
        :empty-message="$t('message.noMember')"
        :data-list.sync="filterDataList"
        class="user-table"
        @delete="showChangePasswordDialog"
      />
    </div>
    <reset-password-info-dialog
      v-if="editUserId !== null"
      :user-id="editUserId"
      @close="closeChangePasswordDialog"
    />
  </admin-layout>
</template>
<script>
import AdminLayout from '@/components/layout/AdminLayout'
import ResetPasswordInfoDialog from './components/ResetPasswordInfoDialog'
import { getAccountList } from '@/API/Admin'
import { getAccountUsers } from '@/API/User'
import { mapState } from 'vuex'
import DefaultSelect from '@/components/select/DefaultSelect.vue';
import DataTable from '@/components/table/DataTable'
import InputBlock from '@/components/InputBlock'

export default {
  inject: ['$validator'],
  name: 'PageAdmin',
  components: {
    AdminLayout,
    DefaultSelect,
    ResetPasswordInfoDialog,
    DataTable,
    InputBlock
  },
  data () {
    return {
      currentAccountId: null,
      editUserId: null,
      accountList: [],
      userList: [],
      isLoading: false,
      searchUserName: ''
    }
  },
  computed: {
    ...mapState('userManagement', ['isAdmin']),
    filterDataList () {
      return this.userList.filter(data => data.name.toLowerCase().includes(this.searchUserName.toLowerCase()))
    },
    tableHeaders () {
      return [
        {
          text: this.$t('admin.userName'),
          value: 'name',
          width: '35%'
        },
        {
          text: 'e-mail',
          value: 'email',
          width: '35%'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          action: [
            {
              name: this.$t('admin.changePassword'),
              value: 'delete'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    changeAccount () {
      this.isLoading = true
      this.searchUserName = ''
      this.getUserList()
    },
    showChangePasswordDialog (user) {
      this.editUserId = user.id
    },
    closeChangePasswordDialog () {
      this.editUserId = null
    },
    async fetchData () {
      this.isLoading = true
      const accountList = await getAccountList()
      this.accountList = accountList.map(option => {
        return {
          name: option.name,
          value: option.id
        }
      })
      this.currentAccountId = accountList[0].id
      this.getUserList()
    },
    async getUserList () {
      this.userList = await getAccountUsers(this.currentAccountId)
      this.isLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.page-admin {
  width: 60%;
  padding-top: 16px;

  .page-title {
    font-size: 24px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
  }

  .condition-block {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 16px;
  }

  .account-select-block {
    font-size: 14px;
  }

  .account-select {
    background-color: #1d2424;
    border-radius: 5px;
  }

  .user-table.data-table.data-source-list-table {
    >>> .data-table-body {
      overflow: auto;
      height: 50vh;
    }

    >>> .data-table-cell.action {
      justify-content: center;
    }
  }
}
</style>
