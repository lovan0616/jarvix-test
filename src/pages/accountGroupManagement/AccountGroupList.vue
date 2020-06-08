<template>
  <div class="group-management">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.accountGroupManagement') }}</h1>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <router-link
            :to="{name: 'CreateAccountGroup'}"
            class="btn-m btn-default btn-has-icon"
            :class="{disabled: isLoading}"
            v-if="showCreateButton()"
          >
            <svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.createGroup') }}
          </router-link>
        </div>
      </div>
      <crud-table
        :headers="tableHeaders"
        :data-list="groupList"
        @update:dataList="$emit('update:groupList', $event)"
        :loading="isLoading"
        @delete="confirmDelete"
        @cancel="cancelDelete"
        @edit="editGroup($event)"
        @manage="confirmEnterGroup"
        :empty-message="$t('editing.notYetCreateGroup')"
      >
      </crud-table>
      <decide-dialog
        v-if="showConfirmDeleteDialog"
        :title="$t('editing.confirmDeleteBelowGroupOrNot')"
        :content="selectedGroup.groupName"
        :type="'delete'"
        @closeDialog="cancelDelete"
        @confirmBtn="deleteGroup"
      >
      </decide-dialog>
      <decide-dialog
        v-if="showConfirmEnterGroupDialog"
        :title="$t('editing.confirmEnterGroupUserManagement')"
        :content="selectedGroup.groupName"
        :type="'confirm'"
        :btnText="$t('button.moveForward')"
        @closeDialog="cancelEnterGroup"
        @confirmBtn="enterGroup"
      >
      </decide-dialog>
    </div>
  </div>
</template>

<script>
import { getAccountGroupList, deleteGroup } from '@/API/User'
import CrudTable from '@/components/table/CrudTable'
import DecideDialog from '@/components/dialog/DecideDialog'
import { Message } from 'element-ui'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'AccountGroupList',
  components: {
    CrudTable,
    DecideDialog
  },
  data () {
    return {
      isLoading: false,
      groupList: [],
      selectedGroup: {},
      showConfirmDeleteDialog: false,
      showConfirmEnterGroupDialog: false
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission']),
    ...mapState('userManagement', ['license']),
    tableHeaders () {
      console.log(this.license.maxUser, 'test')
      return [
        {
          text: this.$t('editing.groupName'),
          value: 'groupName',
          sort: true,
          width: '30%'
        },
        {
          text: this.$t('editing.groupOwner'),
          value: 'owner',
          sort: true,
          width: '25%'
        },
        {
          text: this.$t('editing.groupMemberAmount'),
          value: 'memberCount',
          sort: true,
          width: '10%'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '35%',
          action: [
            {
              type: 'event',
              name: this.$t('button.delete'),
              value: 'delete',
              permission: 'account_delete_group'
            },
            {
              type: 'event',
              name: this.$t('editing.editingName'),
              value: 'edit',
              permission: 'account_update_group'
            },
            ...(this.license.maxUser > 1) ? [{
              type: 'event',
              name: this.$t('editing.memberManagement'),
              value: 'manage',
              permission: 'account_read_group'
            }] : {}
          ]
        }
      ]
    }
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getAccountGroupList()
        .then(groupList => { this.groupList = groupList })
        .finally(() => { this.isLoading = false })
    },
    confirmDelete (dataObj) {
      this.selectedGroup = dataObj
      this.showConfirmDeleteDialog = true
    },
    cancelDelete () {
      this.selectedGroup = {}
      this.showConfirmDeleteDialog = false
    },
    deleteGroup (data) {
      deleteGroup(this.selectedGroup.groupId)
        .then(() => this.$store.dispatch('userManagement/updateUserGroupList'))
        .then(() => {
          this.fetchData()
          this.showConfirmDeleteDialog = false
          Message({
            message: this.$t('message.groupDeleteSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
    },
    showCreateButton () {
      return this.hasPermission('account_create_group')
    },
    confirmEnterGroup (dataObj) {
      this.selectedGroup = dataObj
      this.showConfirmEnterGroupDialog = true
    },
    cancelEnterGroup () {
      this.selectedGroup = {}
      this.showConfirmEnterGroupDialog = false
    },
    enterGroup () {
      this.$router.push({name: 'GroupUserList', params: {group_id: this.selectedGroup.groupId}})
    },
    editGroup (data) {
      this.$router.push({name: 'EditAccountGroup', params: {id: data.groupId}})
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
