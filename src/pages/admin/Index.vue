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
          />
        </div>
      </div>
      <div class="data-table">
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
                class="link">{{ $t('admin.changePassword') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>
<script>
import AdminLayout from '@/components/layout/AdminLayout'
import ChangeLanguageDialog from '@/components/dialog/ChangeLanguageDialog';
import { getAccountList } from '@/API/Admin'
import { mapState } from 'vuex'
import DefaultSelect from '@/components/select/DefaultSelect.vue';

export default {
  inject: ['$validator'],
  name: 'PageAdmin',
  components: {
    AdminLayout,
    ChangeLanguageDialog,
    DefaultSelect
  },
  data () {
    return {
      currentAccountId: null,
      currentEditUserId: null,
      accountList: [
        {
          id: '1',
          name: 'test',
        },
        {
          id: 2,
          name: 'test1'
        }
      ],
      userList: [
        {
          id: 0,
          name: 'test'
        },
        {
          id: '1',
          name: 'test'
        }
      ]
    }
  },
  computed: {
    ...mapState('userManagement', ['isAdmin']),
  },
  mounted () {

  },
  methods: {
    getSystemAccountList () {
      return getAccountList().then(response => {
        this.accountList = response
      })
    },
    submitForm () {
      this.$validator.validateAll().then(result => {
        this.updateTokenTimestamp(new Date().getTime())
        if (result) {
          this.isSubmit = true
          login({
            email: this.userInfo.account,
            password: this.userInfo.password
          })
            .then(({ accessToken }) => {
              this.updateTokenTimestamp(new Date().getTime())
              this.updateToken(accessToken) 
              localStorage.setItem('token', accessToken)
              return this.getUserInfo()
            })
            .catch(() => this.isSubmit = false)
        }
      })
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
}
</style>
