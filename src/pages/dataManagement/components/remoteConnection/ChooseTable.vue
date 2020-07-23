<template>
  <div class="choose-table">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="2"
    />
    <div class="info-block">
      <div>{{ $t('editing.currentLoadedDataFrame') }} ({{ currentUploadInfo.db }})</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <spinner 
        v-if="isLoading"
        :title="$t('editing.loading')"
        class="processing-spinner-container"
        size="50"
      />
      <empty-info-block
        v-else-if="!isLoading && tableList.length === 0"
      />
      <div
        v-else
      >
        <div class="control-block">
          <button
            type="button"
            class="btn-m btn-default btn-open-edit-dialog"
            @click="openSqlEditDialog"
          >{{ $t('button.addSqlScript') }}</button>
          <input-block
            v-model="queryWord"
            :label="$t('etl.tableSearch')"
            class="choose-table__search"
          />
        </div>
        <div class="table-list-container">
          <div
            v-if="sqlTableList.length > 0"
            class="sql-table-list table-list">
            <label 
              v-for="(table, index) in sqlTableList"
              :key="index"
              class="single-data-frame"
            >
              <div class="checkbox">
                <div class="checkbox-label">
                  <input 
                    :id="'table' + index"
                    :value="table"
                    v-model="sqlTableChosenList"
                    type="checkbox"
                  >
                  <div class="checkbox-square"/>
                </div>
              </div>
              <div class="data-frame-info">
                <div class="data-frame-name">{{ table.creatingSqlName }}<span class="remark-info">({{ $t('remoteConnection.sqlCreateTable') }})</span></div>
                <a 
                  href="javascript:void(0)" 
                  class="action-link"
                  @click.stop="editSqlTable(index)"
                >
                  <svg-icon icon-class="edit"/>
                </a>
              </div>
            </label>
          </div>
          <div
            v-if="filterTableList.length > 0"
            class="data-frame-list table-list">
            <label 
              v-for="(table, index) in filterTableList"
              :key="index"
              class="single-data-frame"
            >
              <div class="checkbox">
                <div class="checkbox-label">
                  <input 
                    :id="'table' + index"
                    :value="table"
                    v-model="tableIdList"
                    type="checkbox"
                  >
                  <div class="checkbox-square"/>
                </div>
              </div>
              <div class="data-frame-info">
                <div class="data-frame-name">{{ table }}</div>
              </div>
            </label>
          </div>
        </div>
        <empty-info-block
          v-if="filterTableList.length === 0"
          :msg="$t('message.emptyResult')"
        />
        <div class="remark-info">{{ $t('etl.tableChosenLimit', {number: tableConnectionLimt}) }}</div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancelConnection"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isLoading"
          class="btn btn-outline"
          @click="prevStep"
        >{{ $t('button.prevStep') }}</button>
        <button
          :disabled="isLoading || (tableIdList.length === 0 && sqlTableChosenList.length === 0)"
          class="btn btn-default"
          @click="nextStep"
        >{{ isLoading ? $t('button.processing') : $t('button.nextStep') }}</button>
      </div>
    </div>
    <EditSqlDialog
      v-if="isShowEditSqlDialog"
      :connection-id="connectionId"
      :sql-table-list="sqlTableList"
      :table-list="tableList"
      :edit-index="editSqlIndex"
      @cancel="closeSqlEditDialog"
      @confirm="updateSqlInfo"
    />
  </div>
</template>
<script>
import { getTableList, analyzeTable, analysisCreateTableSql } from '@/API/RemoteConnection'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import UploadProcessBlock from './UploadProcessBlock'
import InputBlock from '@/components/InputBlock'
import EditSqlDialog from './EditSqlDialog'
import { Message } from 'element-ui'

export default {
  name: 'ChooseTable',
  components: {
    UploadProcessBlock,
    EmptyInfoBlock,
    InputBlock,
    EditSqlDialog
  },
  props: {
    connectionId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      tableList: [],
      tableIdList: [],
      sqlTableList: [],
      sqlTableChosenList: [],
      dataSourceId: parseInt(this.$route.params.id),
      tableConnectionLimt: 10,
      queryWord: '',
      isShowEditSqlDialog: false,
      editSqlIndex: null
    }
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    },
    filterTableList () {
      return this.queryWord === '' 
        ? this.tableList 
        : this.tableList.filter((element) => element.toLowerCase().split(this.queryWord.toLowerCase()).length > 1)
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getTableList(this.connectionId).then(response => {
        this.tableList = response
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    cancelConnection () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prevStep () {
      this.$emit('prev')
    },
    nextStep () {
      if (this.tableIdList.length > this.tableConnectionLimt) {
        Message({
          message: this.$t('etl.tableChosenLimit', {number: this.tableConnectionLimt}),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
        return false
      }
      this.isLoading = true
      // 先清除，避免有部分成功的情形發生
      this.$store.commit('dataManagement/clearEtlTableList')
      let tablePromiseList = this.tableIdList.map((element, index) => {
        return analyzeTable(this.connectionId, this.currentUploadInfo.dataSourceId, element).then(response => {
          response.dataSourceId = this.dataSourceId
          this.$store.commit('dataManagement/updateEtlTableList', response)
        })
      })

      let sqlPromiseList = this.sqlTableChosenList.map((element, index) => {
        return analysisCreateTableSql(this.connectionId, {dataSourceId: this.currentUploadInfo.dataSourceId, ...element}).then(response => {
          response.dataSourceId = this.dataSourceId
          this.$store.commit('dataManagement/updateEtlTableList', response)
        })
      })

      let promiseList = [...tablePromiseList, ...sqlPromiseList]

      Promise.all(promiseList).then(() => {
        this.isLoading = false
        let connectionTableList = this.tableIdList.map(element => {
          return {
            name: element,
            value: element,
            connectionStatus: null
          }
        })
        let sqlTableList = this.sqlTableChosenList.map(element => {
          return {
            name: element.creatingSqlName,
            value: element.creatingSqlName,
            connectionStatus: null
          }
        })

        this.$emit('next', [...connectionTableList, ...sqlTableList])
      }).catch(() => {
        this.isLoading = false
      })
    },
    openSqlEditDialog () {
      this.isShowEditSqlDialog = true
    },
    closeSqlEditDialog () {
      this.isShowEditSqlDialog = false
      this.editSqlIndex = null
    },
    updateSqlInfo (editInfo) {
      if (this.editSqlIndex !== null) {
        // edit
        this.sqlTableChosenList.find((element, index) => {
          if (element.creatingSqlName === this.sqlTableList[this.editSqlIndex].creatingSqlName) {
            this.$set(this.sqlTableChosenList, index, editInfo)
            return true
          }
        })

        this.sqlTableList[this.editSqlIndex] = editInfo
      } else {
        // create
        this.sqlTableList.unshift(editInfo)
        this.sqlTableChosenList.unshift(editInfo)
      }
      this.closeSqlEditDialog()
    },
    editSqlTable (index) {
      this.editSqlIndex = index
      this.openSqlEditDialog()
    }
  },
}
</script>
<style lang="scss" scoped>

.choose-table {
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 30px 24px;
    margin-bottom: 16px;
  }

  .table-list-container, .processing-spinner-container {
    height: 48vh;
    overflow: auto;
  }

  .table-list:not(:last-child) {
    margin-bottom: 12px;
  }

  .control-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .remark-info {
    font-size: 14px;
    color: #FFDF6F;
    display: inline-block;
  }

  &__search {
    float: right;
    width: unset;
  }

  .single-data-frame {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 14px 24px;
    background: rgba(67, 76, 76, 0.95);
    border-radius: 5px;
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    .checkbox {
      margin-right: 20px;

      .checkbox-label {
        width: 16px;
        height: 16px;
      }

      .checkbox-square:after {
        left: 5px;
      }
    }

    .data-frame-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;

      .action-link {
        width: 24px;
        color: $theme-color-primary;
        text-align: center;
      }
    }

    .data-frame-name {
      font-size: 14px;
      font-weight: 600;

      .remark-info {
        margin-left: 4px;
      }
    }
    .data-frame-content {
      font-size: 13px;
      line-height: 18px;
      color: #ddd;
    }
  }
}
</style>
