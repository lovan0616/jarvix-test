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
          @click="addNewRelations"
        ><svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.newForeign') }}</button>
      </div>
      <empty-info-block
        class="empty-info-block"
        v-if="joinRelations.length === 0"
        :msg="$t('editing.emptyForeign')"
      ></empty-info-block>
      <table-join-relatoin-block
        v-else
        v-for="(relation, index) in joinRelations"
        :key="relation.id"
        :index="index"
        :relation-info="relation"
        :table-list="tableList"
        @deleteRelations="deleteRelations"
      ></table-join-relatoin-block>
    </div>
  </div>
</template>
<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import TableJoinRelatoinBlock from './TableJoinRelatoinBlock'
// import { buildStorage, setCSVJoin } from '@/API/Storage'
import { getDataFrameRelationById, getDataFrameById, deleteDataFrameRelationById } from '@/API/DataSource'
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
      joinRelations: [],
      tableList: [],
      singleJoinRelations: {
        isNew: true,
        id: null,
        leftDataFrameId: null,
        leftDataColumnId: null,
        rightDataFrameId: null,
        rightDataColumnId: null
      },
      singleForeignKey: {
        left_column: null,
        right_column: null
      }
    }
  },
  mounted () {
    this.getRelation()
    this.getDataFrameList()
  },
  methods: {
    getRelation () {
      getDataFrameRelationById(this.currentDataSourceId).then(response => {
        this.joinRelations = response
      })
    },
    getDataFrameList () {
      getDataFrameById(this.currentDataSourceId).then(response => {
        this.tableList = response
      })
    },
    closeDialog () {
      this.$emit('cancel')
    },
    // 新增關聯性
    addNewRelations () {
      let newRelations = JSON.parse(JSON.stringify(this.singleJoinRelations))
      // newRelations.id = new Date().getTime()
      this.joinRelations.push(newRelations)
    },
    deleteRelations (index) {
      if (this.joinRelations[index].isNew) {
        this.joinRelations.splice(index, 1)
      } else {
        deleteDataFrameRelationById(this.joinRelations[index].id).then(() => {
          this.getRelation()

          Message({
            message: this.$t('message.correlationDeleteSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
      }
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
