<template>
  <admin-layout>
    <div class="page-admin container">
      <div class="page-title">
        {{ $t('admin.userList') }}
        <div class="account-select-block">
          {{ $t('admin.accountName') }}
          <default-select
            v-model="currentAccountId"
            :option-list="accountList"
            class="account-select"
            @change="changeAccount"
          />
        </div>
      </div>
      <!-- <data-table
        :headers="tableHeaders"
        :data-list.sync="userList"
        :is-search-result-empty="searchUserName.length > 0 && userList.length === 0"
        :loading="isLoading"
        :empty-message="$t('editing.clickToUploadTable')"
      /> -->
      <div class="data-table user-table">
        <div class="data-table-head">
          <div class="data-table-row table-head">
            <div class="data-table-cell">{{ $t('admin.userName') }}</div>
            <div class="data-table-cell">{{ $t('admin.action') }}</div>
          </div>
        </div>
        <div class="data-table-body">
          <div
            v-for="user in userList"
            :key="user.id"
            class="data-table-row"
          >
            <div class="data-table-cell">{{ user.name }}</div>
            <div class="data-table-cell">
              <a
                href="javascript:void(0)"
                class="link"
                @click="changePassword(user.id)">{{ $t('admin.changePassword') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <decide-dialog/> -->
  </admin-layout>
</template>
<script>
import AdminLayout from '@/components/layout/AdminLayout'
import ChangeLanguageDialog from '@/components/dialog/ChangeLanguageDialog';
import DecideDialog from '@/components/dialog/DecideDialog'
import { getAccountList } from '@/API/Admin'
import { getAccountUsers } from '@/API/User'
import { mapState } from 'vuex'
import DefaultSelect from '@/components/select/DefaultSelect.vue';
import DataTable from '@/components/table/DataTable'

export default {
  inject: ['$validator'],
  name: 'PageAdmin',
  components: {
    AdminLayout,
    ChangeLanguageDialog,
    DefaultSelect,
    DecideDialog,
    DataTable
  },
  data () {
    return {
      currentAccountId: null,
      currentEditUserId: null,
      accountList: [],
      userList: [],
      isLoading: false,
      searchUserName: null
    }
  },
  computed: {
    ...mapState('userManagement', ['isAdmin']),
    tableHeaders () {
      return [
        {
          text: this.$t('admin.userName'),
          value: 'name',
          width: '50%'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '50%',
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
      this.getUserList()
    },
    changePassword (id) {
      
    },
    async fetchData () {
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
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
  }

  .account-select-block {
    font-size: 14px;
  }

  .account-select {
    background-color: #1d2424;
    border-radius: 5px;
  }

  .user-table.data-table {
    .data-table-body {
      height: 50vh;
    }
  }
}
</style>
