<template>
  <div class="group-management">
    <div class="page-title-row">
      <div class="bread-crumb">
        {{ $t('sideNav.accountManagement') }}
      </div>
      <h1 class="title">{{ $t('sideNav.accountGroupManagement') }}</h1>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <!--TODO: 補路徑-->
          <router-link
            :to="{name: ''}"
            class="btn-m btn-default btn-has-icon"
          >
            <svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.createGroup') }}
          </router-link>
        </div>
      </div>
      <empty-info-block
        v-if="!isLoading && groupList.length === 0"
        :msg="$t('editing.notYetCreateGroup')"
      ></empty-info-block>
      <crud-table
        v-else
        :headers="tableHeaders"
        :data-list.sync="groupList"
        :loading="isLoading"
        @delete="confirmDelete"
      >
      </crud-table>
    </div>
    <decide-dialog
      v-if="showConfirmDeleteDialog"
      :title="this.$t('editing.confirmDeleteBelowGroupOrNot')"
      :content="selectedGroup.name"
      :type="'delete'"
      @closeDialog="cancelDelete"
      @confirmBtn="deleteGroup"
    >
    </decide-dialog>
  </div>
</template>
<script>
import CrudTable from '@/components/table/CrudTable'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import DecideDialog from '@/components/dialog/DecideDialog'

const dummyList = [
  {
    'id': 1,
    'name': '一銀',
    'owner': 'Mike',
    'memberAmount': 3
  },
  {
    'id': 2,
    'name': '台新',
    'owner': 'Christan',
    'memberAmount': 4
  },
  {
    'id': 3,
    'name': '中信',
    'owner': 'proxy0001',
    'memberAmount': 5
  }
]

export default {
  name: 'GroupManagement',
  components: {
    CrudTable,
    EmptyInfoBlock,
    DecideDialog
  },
  data () {
    return {
      showConfirmDeleteDialog: false,
      selectedGroup: {},
      isLoading: false,
      groupList: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      this.groupList = dummyList
      this.isLoading = false
    },
    confirmDelete (dataObj) {
      this.selectedGroup = dataObj
      this.showConfirmDeleteDialog = true
    },
    cancelDelete () {
      this.selectedGroup = {}
      this.showConfirmDeleteDialog = false
    },
    deleteGroup () {
      // TODO: delete group
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('editing.groupName'),
          value: 'name',
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
          value: 'memberAmount',
          sort: true,
          width: '10%'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '35%',
          action: [
            {
              type: 'popup',
              name: this.$t('button.delete'),
              value: 'delete'
            },
            {
              type: 'link',
              name: this.$t('editing.editingName'),
              link: {name: ''} // 待補
            },
            {
              type: 'link',
              name: this.$t('editing.memberManagement'),
              link: {name: ''} // 待補
            }
          ]
        }
      ]
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
  }

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

  .table-board {
    background: $theme-bg-color;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 24px;
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
}
</style>
