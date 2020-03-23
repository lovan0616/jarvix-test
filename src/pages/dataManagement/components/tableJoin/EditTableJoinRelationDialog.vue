<template>
  <div class="edit-table-join-relation-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">{{ $t('editing.foreignTable') }}
        <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
         ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="button-block">
        <button type="button" class="btn btn-secondary btn-has-icon"
          @click="addJoinTable"
        ><svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.newForeign') }}</button>
      </div>
      <spinner class="spinner-container"
        v-if="isLoading"
        :title="$t('editing.loading')"
        size="50"
      ></spinner>
      <template v-else>
        <empty-info-block
          class="empty-info-block"
          v-if="joinTableList.length === 0"
          :msg="$t('editing.emptyForeign')"
        ></empty-info-block>
        <table-join-relatoin-block
          v-else
          v-for="(relation, index) in joinTableList"
          :key="joinTableList.length - index"
          :index="index"
          :relation-info="relation"
          :join-type-options="joinTypeOptions"
          :table-list="tableList"
          @deleteJoinTable="deleteJoinTable"
          @cancelAddingJoinTable="cancelAddingJoinTable"
        ></table-join-relatoin-block>
      </template>
    </div>
  </div>
</template>
<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import TableJoinRelatoinBlock from './TableJoinRelatoinBlock'
// import { buildStorage, setCSVJoin } from '@/API/Storage'
import { getDataFrameById } from '@/API/DataSource'
import { getJoinTableList } from '@/API/JoinTable'
import { Message } from 'element-ui'

export default {
  name: 'EditTableJoinRelationDialog',
  components: {
    TableJoinRelatoinBlock,
    EmptyInfoBlock
  },
  data () {
    return {
      currentDataSourceId: parseInt(this.$route.params.id),
      joinTableList: [],
      tableList: [],
      joinTypeOptions: [
        {
          name: 'Inner Join',
          value: 'Inner'
        }
      ],
      singleJoinTable: {
        dataFrameRelationList: [
          {
            joinType: 'Inner',
            leftDataFrame: { id: null },
            leftDataColumn: { id: null },
            rightDataFrame: { id: null },
            rightDataColumn: { id: null }
          }
        ],
        id: null,
        name: null
      },
      singleForeignKey: {
        left_column: null,
        right_column: null
      },
      isLoading: true
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Promise.all([this.getJoinTableList(), this.getDataFrameList()])
        .then(([joinTableList, dataFrameList]) => {
          // handle join table list
          if (joinTableList.length === 0) {
            this.joinTableList.push(JSON.parse(JSON.stringify(this.singleJoinTable)))
          } else {
            this.joinTableList = joinTableList
          }
          // handle dataframe list
          this.tableList = dataFrameList
          // update loading status
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    getJoinTableList () {
      return getJoinTableList(this.currentDataSourceId)
    },
    getDataFrameList () {
      return getDataFrameById(this.currentDataSourceId)
    },
    closeDialog () {
      this.$emit('cancel')
    },
    addJoinTable () {
      let newRelations = JSON.parse(JSON.stringify(this.singleJoinTable))
      this.joinTableList.unshift(newRelations)
    },
    cancelAddingJoinTable (index) {
      this.joinTableList.splice(index, 1)
    },
    deleteJoinTable (index) {
      this.joinTableList.splice(index, 1)
      Message({
        message: this.$t('message.correlationDeleteSuccess'),
        type: 'success',
        duration: 3 * 1000
      })
    }
  },
  computed: {
    currentBookmarkInfo () {
      return this.$store.state.dataManagement.currentBookmarkInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-table-join-relation-dialog {
  .dialog-title {
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #fff;
    font-size: 14px;
  }
  .button-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .empty-info-block {
    margin-bottom: 16px;
  }
}
</style>
