<template>
  <div class="column-setting"
    v-if="!isProcessing"
  >
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <div class="info-block">
      <div>{{ $t('editing.dataColumn') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ 'test' }}</div>
    </div>
    <div class="dialog-body">
      <div class="data-frame-select-block">
        <label class="select-label">{{ $t('editing.currentDisplayDataFrame') }}</label>
        <default-select
          v-model="currentTable"
          :option-list="tableIdList"
        ></default-select>
      </div>
      <div class="data-table">
        <div class="data-table-row table-head">
          <div class="data-table-cell">{{ $t('editing.columnName') }}</div>
          <div class="data-table-cell">{{ $t('editing.alias') }}</div>
          <div class="data-table-cell">{{ $t('editing.dataType') }}</div>
        </div>
        <div class="data-table-body">
          <spinner class="spinner-container"
            v-if="isLoading"
            :title="$t('editing.loading')"
            size="50"
          ></spinner>
          <template
            v-else
          >
            <div class="data-table-row"
              v-for="(column, index) in currentColumnList"
              :key="index"
            >
              <div class="data-table-cell">{{ column.name }}</div>
              <div class="data-table-cell">
                <input-block class="column-alias-input"
                  :name="column.name"
                  v-model="column.primaryAlias"
                  v-validate="'required'"
                ></input-block>
              </div>
              <div class="data-table-cell">
                <default-select class="data-type-select"
                  :key="column.name + '-' + index + '-select'"
                  v-model="column.dataType"
                  :option-list="dataTypeOptionList(column.originalDataType)"
                  @change="changeDataType(column, column.dataType)"
                ></default-select>
              </div>
            </div>
          </template>
          <div class="empty-info"
            v-if="currentColumnList.length === 0"
          >
            {{ $t('editing.emptyResult') }}
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-default"
          :disabled="isLoading"
          @click="nextStep"
        >{{isLoading ? $t('button.processing') : $t('button.copyAndBuild')}}</button>
      </div>
    </div>
  </div>
  <spinner class="processing-spinner-container"
    v-else
    :title="$t('editing.dataBuilding')"
    size="50"
  ></spinner>
</template>
<script>
import { dataSourcePreprocessor } from '@/API/DataSource'
import InputBlock from '@/components/InputBlock'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'PublicColumnSetting',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock
  },
  props: {
    tableIdList: {
      type: Array,
      default: () => []
    },
    connectionId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      dataTypeList: [
        {
          name: 'FLOAT',
          value: 'FLOAT'
        },
        {
          name: 'STRING',
          value: 'STRING'
        },
        {
          name: 'INT',
          value: 'INT'
        },
        {
          name: 'DATETIME',
          value: 'DATETIME'
        },
        {
          name: 'BOOLEAN',
          value: 'BOOLEAN'
        }
      ],
      currentTable: null,
      copyTableList: []
    }
  },
  methods: {
    fetchData () {
      this.isLoading = true
      this.currentTable = this.tableIdList[0].name

      let promiseList = this.tableIdList.map((element, index) => {
        return analyzeTable(this.connectionId, element.name).then(response => {
          let columnList = response.columns
          if (columnList.length > 0) {
            columnList.forEach(element => {
              let newElement = JSON.parse(JSON.stringify(element))
              this.$set(element, 'originalDataType', newElement.dataType)
              this.$set(element, 'originalStatsType', newElement.statsType)
            })
          }
          this.$set(this.copyTableList, index, response)
        })
      })

      Promise.all(promiseList).then(() => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    nextStep () {
      this.isProcessing = true
      this.copyTableList.forEach((element, index) => {
        dataSourcePreprocessor(element).then(response => {
          this.tableIdList[index].connectionStatus = 'success'
          this.checkUpdateFinish()
        }).catch(() => {
          this.tableIdList[index].connectionStatus = 'fail'
          this.checkUpdateFinish()
        })
      })
    },
    checkUpdateFinish () {
      if (!this.tableIdList.some(element => element.status === null)) {
        this.$emit('next')
        this.isProcessing = false
      }
    },
    dataTypeOptionList (type) {
      if (type === 'STRING') {
        return [
          {
            name: 'STRING',
            value: 'STRING'
          }
        ]
      } else {
        return [
          {
            name: type,
            value: type
          },
          {
            name: 'STRING',
            value: 'STRING'
          }
        ]
      }
    },
    changeDataType (column, dataType) {
      column.dataType = dataType
      column.statsType = (dataType === 'STRING') ? 'CATEGORY' : column.originalStatsType
    }
  },
  computed: {
    currentColumnList () {
      if (this.copyTableList.length === 0) return []
      return this.copyTableList.filter(element => element.name === this.currentTable)[0].columns
    },
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    }
  }
}
</script>
<style lang="scss" scoped>
.column-setting {
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;
    margin-bottom: 16px;
  }

  & >>> .sy-select {
    border-bottom: 1px solid #aaa;
  }

  .data-frame-select-block {
    width: 256px;
    margin-bottom: 16px;

    .select-label {
      display: block;
      font-size: 13px;
      line-height: 18px;
    }

    .sy-select {
      width: 100%;
    }
  }

  .spinner-container {
    height: 100%;
  }

  .data-table {
    border-radius: 0;

    .data-table-body {
      height: 260px;

      .empty-info {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .data-table-cell {
      padding: 9px 0 9px 18px;
    }
  }
}
.processing-spinner-container {
  height: 80vh;
}
</style>
<style lang="scss">
.data-type-select {
  &.sy-select.theme-dark .el-input--suffix .el-input__inner {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    padding-left: 0;
  }

  .el-input__icon {
    line-height: 20px;
  }
}
.column-alias-input.input-block {
  .input {
    height: 20px;
    padding-bottom: 2px;
  }
}
</style>
