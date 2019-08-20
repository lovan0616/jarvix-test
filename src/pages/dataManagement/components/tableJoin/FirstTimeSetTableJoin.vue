<template>
  <div class="set-table-join">
    <div class="dialog-title">编辑资料表</div>
    <div class="button-block">
      <button type="button" class="btn btn-default"
        @click="addNewRelations"
      >新增关联</button>
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
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button type="button" class="btn btn-outline"
          @click="buildBookmarkStorage"
        >略过</button>
        <button type="button" class="btn btn-default"
          @click="saveRelations"
        >储存</button>
      </div>
    </div>
  </div>
</template>
<script>
import TableJoinRelatoinBlock from './TableJoinRelatoinBlock'
import { getBookmarkStorage, buildStorage, setCSVJoin } from '@/API/Storage'

export default {
  name: 'FirstTimeSetTableJoin',
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
      let storageType = this.getStorageType(this.currentUploadInfo.type)
      getBookmarkStorage(this.currentUploadInfo.bookmarkId, storageType).then(response => {
        this.storageId = response.storage.id
        let storageTablesConfig = response.storage.config.tables
        // 目前的 table 清單，將 object 轉為 Array，同時補足 select 需要的 key
        this.tableList = Object.keys(storageTablesConfig).map(element => {
          storageTablesConfig[element].id = element
          storageTablesConfig[element].name = storageTablesConfig[element].tablename
          return storageTablesConfig[element]
        })
      })
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
        this.buildBookmarkStorage()
      })
    },
    buildBookmarkStorage () {
      buildStorage(this.storageId, this.currentUploadInfo.bookmarkId, false).then(() => {
        this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
        if (this.$route.name === 'PageDataSourceList') {
          this.$store.dispatch('bookmark/getBookmarkList')
        } else {
          this.$store.commit('dataManagement/updateFileUploadSuccess', true)
        }
      })
    }
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.set-table-join {
  .button-block {
    margin-bottom: 32px;
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
