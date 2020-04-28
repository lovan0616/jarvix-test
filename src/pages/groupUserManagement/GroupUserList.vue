<template>
  <div class="group-management">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.groupUserList') }}</h1>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <router-link
            class="btn-m btn-default btn-has-icon"
            v-if="showCreateButton()"
            :to="{name: 'GroupCreateUser', params: {group_id: currentGroupId}}"
          >
            <svg-icon icon-class="user" class="icon"></svg-icon>{{ $t('button.addNewMember') }}
          </router-link>
        </div>
      </div>
      <crud-table
        :headers="tableHeaders"
        :data-list.sync="userList"
        :empty-message="this.$t('message.noMember')"
        @update:dataList="$emit('update:userList', $event)"
        :loading="isLoading"
        @delete="confirmDelete"
        @cancel="closeDelete"
      >
      </crud-table>
      <decide-dialog
        v-if="showConfirmDeleteDialog"
        :title="this.$t('editing.confirmDeleteProjectUserText')"
        :type="'delete'"
        @closeDialog="closeDelete"
        @confirmBtn="deleteGroupUser"
      >
      </decide-dialog>
    </div>
  </div>
</template>
<script>
import CrudTable from '@/components/table/CrudTable'
import DecideDialog from '@/components/dialog/DecideDialog'
import {getGroupUserList, deleteGroupUser} from '@/API/Group'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'GroupUserList',
  data () {
    return {
      isLoading: false,
      userList: [],
      editData: {},
      selectedUser: {},
      showConfirmDeleteDialog: false,
      currentGroupId: '',
      canEditList: false
    }
  },
  components: {
    CrudTable,
    DecideDialog
  },
  mounted () {
    this.currentGroupId = this.$route.params.group_id
    this.fetchData(this.currentGroupId)
  },
  beforeRouteUpdate (to, from, next) {
    this.currentGroupId = to.params.group_id
    this.fetchData(this.currentGroupId)
    next()
  },
  computed: {
    ...mapGetters('userManagement', ['hasAccountPermission', 'hasGroupPermission']),
    tableHeaders () {
      return [
        {
          text: this.$t('editing.userAccount'),
          value: 'email',
          sort: true,
          width: '70%'
        },
        // {
        //   text: this.$t('editing.groupRolePermission'),
        //   value: 'role',
        //   sort: true,
        //   width: '25%'
        // },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '30%',
          action: [
            {
              type: 'event',
              name: this.$t('button.remove'),
              value: 'delete',
              permission: 'account_delete_group_user'
            }
          ]
        }
      ]
    }
  },
  methods: {
    fetchData (currentGroupId) {
      this.isLoading = true
      getGroupUserList(currentGroupId)
        .then(userList => {
          this.userList = userList
          this.canEditList = true
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
          this.canEditList = false
        })
    },
    confirmDelete (dataObj) {
      this.selectedUser = dataObj
      this.showConfirmDeleteDialog = true
    },
    closeDelete () {
      this.selectedUser = {}
      this.showConfirmDeleteDialog = false
    },
    deleteGroupUser (data) {
      this.isLoading = true
      deleteGroupUser(this.selectedUser.id, this.currentGroupId)
        .then(() => this.$store.dispatch('userManagement/updateUserGroupList'))
        .then(() => {
          this.fetchData(this.currentGroupId)
          this.closeDelete()
          Message({
            message: this.$t('message.memberDeleteSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
        .catch(() => { this.isLoading = false })
    },
    showCreateButton () {
      return this.canEditList ? this.hasAccountPermission('account_create_group_user') : false
    }
  }
}
</script>

<style lang="scss" scoped>
.group-management {
  .page-title-row {
    margin-bottom: 16px;

    .title {
      margin-top: 0;
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

.table-board {
  background: $theme-bg-color;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 24px;

  .button-block {
    display: flex;
    align-items: center;

    .btn-m:not(:last-child) {
      margin-right: 16px;
    }

    .icon {
      font-size: 18px;
    }
  }

  .board-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  & >>> .empty-info-block {
    background: rgba(35, 61, 64, 0.6);
  }

  & >>> .dialog-box {
    z-index: 999;
  }
}
</style>
