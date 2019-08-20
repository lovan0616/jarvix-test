<template>
  <div class="edit-table-join-relation-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">资料表关联</div>
      <div class="button-block">
        <button type="button" class="btn btn-default"
          @click="addNewRelations"
        >新增关联</button>
        <div class="control-button-block">
          <button type="button" class="btn btn-outline"
            @click="closeDialog"
          >取消</button>
          <button type="button" class="btn btn-default"
            @click="saveRelations"
          >储存</button>
        </div>
      </div>
      <div class="empty-info-block"
        v-if="joinRelations.length === 0"
      >此资料表未建立任何关联</div>
      <table-join-relatoin-block
        v-else
        v-for="relation in joinRelations"
        :key="relation.id"
        :relation-info="relation"
        :table-list="tableList"
        @deleteRelations="deleteRelations"
      ></table-join-relatoin-block>
    </div>
  </div>
</template>
<script>
import TableJoinRelatoinBlock from './TableJoinRelatoinBlock'
import { getBookmarkStorage, buildStorage, setCSVJoin } from '@/API/Storage'

export default {
  name: 'EditTableJoinRelationDialog',
  components: {
    TableJoinRelatoinBlock
  },
  data () {
    return {
      currentBookmarkId: parseInt(this.$route.params.id),
      joinRelations: [],
      tableList: [],
      singleJoinRelations: {
        id: null,
        left_tbl: null,
        right_tbl: null,
        foreign_keys: [
          {
            left_column: null,
            right_column: null
          }
        ]
      },
      singleForeignKey: {
        left_column: null,
        right_column: null
      },
      storageId: null
    }
  },
  mounted () {
    this.getStorageId()
  },
  methods: {
    getStorageId () {
      let storageType = this.getStorageType(this.currentBookmarkInfo.type)
      getBookmarkStorage(this.currentBookmarkInfo.id, storageType).then(response => {
        this.storageId = response.storage.id

        let storageConfig = response.storage.config
        // 目前的 join 關係，將 object 轉為 Array
        this.joinRelations = this.objectToArray(storageConfig.joins)
        // 目前的 table 清單，將 object 轉為 Array，同時補足 select 需要的 key
        this.tableList = Object.keys(storageConfig.tables).map(element => {
          storageConfig.tables[element].id = element
          storageConfig.tables[element].name = storageConfig.tables[element].tablename
          return storageConfig.tables[element]
        })
      })
    },
    closeDialog () {
      this.$emit('cancel')
    },
    // 新增關聯性
    addNewRelations () {
      let newRelations = JSON.parse(JSON.stringify(this.singleJoinRelations))
      newRelations.id = new Date().getTime()
      this.joinRelations.push(newRelations)
    },
    deleteRelations (id) {
      this.joinRelations = this.joinRelations.filter(element => element.id !== id)
    },
    saveRelations () {
      let joinInfo = this.joinRelations.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id] = currentValue
        return accumulator
      }, {})

      setCSVJoin(this.storageId, joinInfo).then(() => {
        buildStorage(this.storageId, this.currentBookmarkInfo.id, false).then(() => {
          this.$router.push('/data-management')
        })
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
  .button-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;

    .control-button-block {
      .btn:not(:last-child) {
        margin-right: 16px;
      }
    }
  }

  .empty-info-block {
    padding: 24px 0;
    border-radius: 4px;
    background-color: $theme-bg-lighter-color;
    text-align: center;
    margin-bottom: 16px;
  }
}
</style>
