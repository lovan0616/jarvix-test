<template>
  <div class="edit-table-join-relation-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">{{ $t('editing.foreignTable') }}</div>
      <div class="button-block">
        <button type="button" class="btn btn-secondary btn-has-icon"
          @click="addNewRelations"
        ><svg-icon icon-class="correlation" class="icon"></svg-icon>{{ $t('button.newForeign') }}</button>
      </div>
      <empty-info-block
        class="empty-info-block"
        v-if="joinRelations.length === 0"
        :msg="$t('editing.emptyForeign')"
      ></empty-info-block>
      <table-join-relatoin-block
        v-else
        v-for="relation in joinRelations"
        :key="relation.id"
        :relation-info="relation"
        :table-list="tableList"
        @deleteRelations="deleteRelations"
      ></table-join-relatoin-block>
      <div class="button-block footer-button-block">
        <div class="control-button-block">
          <button type="button" class="btn btn-outline"
            @click="closeDialog"
          >{{ $t('button.cancel') }}</button>
          <button type="button" class="btn btn-default"
            @click="saveRelations"
          >{{ $t('button.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import TableJoinRelatoinBlock from './TableJoinRelatoinBlock'
import { getBookmarkStorage, buildStorage, setCSVJoin } from '@/API/Storage'

export default {
  name: 'EditTableJoinRelationDialog',
  components: {
    TableJoinRelatoinBlock,
    EmptyInfoBlock
  },
  data () {
    return {
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
    margin-bottom: 16px;

    &.footer-button-block {
      justify-content: flex-end;
    }

    .control-button-block {
      .btn:not(:last-child) {
        margin-right: 16px;
      }
    }
  }

  .empty-info-block {
    margin-bottom: 16px;
  }
}
</style>
