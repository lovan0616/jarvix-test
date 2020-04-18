<template>
  <div class="table-board">
    <div class="board-title-row">
      <div class="button-block">
        <a
          href="javascript:void(0);"
          class="btn-m btn-default btn-has-icon"
          v-if="showCreateButton()"
          @click="editGroup('create')"
        >
          <svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.createGroup') }}
        </a>
      </div>
    </div>
    <crud-table
      :headers="tableHeaders"
      :data-list="groupList"
      @update:dataList="$emit('update:groupList', $event)"
      :loading="isLoading"
      @delete="confirmDelete"
      @cancel="cancelDelete"
      @edit="editGroup('edit', $event)"
      :empty-message="$t('editing.notYetCreateGroup')"
    >
    </crud-table>
    <decide-dialog
      v-if="showConfirmDeleteDialog"
      :title="this.$t('editing.confirmDeleteBelowGroupOrNot')"
      :content="selectedGroup.groupName"
      :type="'delete'"
      @closeDialog="cancelDelete"
      @confirmBtn="deleteGroup"
    >
    </decide-dialog>
  </div>
</template>

<script>
import CrudTable from '@/components/table/CrudTable'
import DecideDialog from '@/components/dialog/DecideDialog'
import { deleteGroup } from '@/API/User'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'AccountGroupList',
  components: {
    CrudTable,
    DecideDialog
  },
  props: {
    groupList: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedGroup: {},
      showConfirmDeleteDialog: false
    }
  },
  created () {
    this.showActionButtons()
  },
  computed: {
    ...mapGetters('userManagement', ['hasAccountPermission', 'hasGroupPermission']),
    tableHeaders () {
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
          action: []
        }
      ]
    }
  },
  methods: {
    editGroup (type, data) {
      this.$emit('editGroup', {type, data})
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
        // TODO: 權限管理實作後需開啟此更新功能
        // .then(() => this.$store.dispatch('userManagement/getUserGroupList'))
        .then(() => {
          const updatedGroupList = this.groupList.filter(group => group.groupId !== this.selectedGroup.groupId)
          this.$emit('update:groupList', updatedGroupList)
          this.showConfirmDeleteDialog = false
          Message({
            message: this.$t('message.groupDeleteSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
    },
    showCreateButton () {
      return this.hasAccountPermission('account_create_user')
    },
    showActionButtons () {
      const actionHeader = this.tableHeaders.find(header => header.value === 'action')

      if (this.hasAccountPermission('account_delete_user')) {
        actionHeader.action.push({
          type: 'event',
          name: this.$t('button.delete'),
          value: 'delete'
        })
      }
      if (this.hasAccountPermission('account_update_user')) {
        actionHeader.action.push({
          type: 'event',
          name: this.$t('editing.editingName'),
          value: 'edit'
        })
      }
      if (this.hasGroupPermission('group_read_user')) {
        actionHeader.action.push({
          type: 'event',
          name: this.$t('editing.memberManagement'),
          link: {name: ''} // 待補
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
