<template>
  <div class="page-algorithm">
    <spinner class="layout-spinner"
      v-if="isExecuting"
      title="演算法處理中，請耐心等待..."
      size="50"
    ></spinner>
    <template v-else>
      <div class="page-title-row">
        <h1 class="title">演算法管理</h1>
        <div class="bread-crumb">
          <router-link to="/algorithm" class="title-link">演算法</router-link>
          <span class="divider">/</span>新建
        </div>
      </div>
      <div class="table-board">
        <div class="board-title-row">
          演算法
        </div>
        <div class="content">
          <div class="item-wrap">
            <div class="content-item">
              <div class="item-title must">演算法類型: </div>
              <default-select class="tag-select input"
                v-model="selectedAlgorithm"
                :option-list="algorithmOptions"
                @change="onAlgorithmChange"
              ></default-select>
            </div>
          </div>
        </div>
      </div>
      <div class="table-board">
        <div class="board-title-row">
          訓練資料設定
        </div>
        <div class="content">
          <div class="item-wrap">
            <div class="content-item">
              <div class="item-title must">目標資料源: </div>
              <default-select class="tag-select input"
                v-model="targetDatasource"
                :option-list="datasourceOptions"
                @change="onTargetDatasourceChange"
              ></default-select>
            </div>
            <div class="content-item">
              <div class="item-title must">目標資料表: </div>
              <default-select class="tag-select input" :style="{width: '240px'}"
                v-model="targetDataframe"
                :option-list="dataframeOptions"
                @change="onTargetDataframeChange"
              ></default-select>
            </div>
          </div>

          <div class="item-wrap">
            <div class="content-item">
              <div class="item-title must">目標參數欄位: </div>
              <default-select class="tag-select input"
                v-model="targetDatacolumn"
                :option-list="datacolumnOptions"
              ></default-select>
            </div>
            <div class="content-item">
              <div class="item-title must">時間欄位: </div>
              <default-select class="tag-select input"
                v-model="timeDatacolumn"
                :option-list="datacolumnOptions"
              ></default-select>
            </div>
          </div>
          <div class="content-item">
            <div class="item-title must">測量值欄位: </div>
            <default-multi-select class="tag-select input" :style="{width: '360px'}"
              v-model="valueDatacolumns"
              :option-list="datacolumnOptions"
              @change="onValueDatacolumnsChange"
            ></default-multi-select>
          </div>
        </div>
      </div>

      <div class="footer">
        <button type="button" class="btn btn-outline"
          @click="back"
        >{{ $t('button.cancel') }}</button>
        <button type="button" class="btn btn-default"
          @click="create"
        >
          <span>新建</span>
        </button>
        <button type="button" class="btn btn-default"
          @click="execute"
        >
          <span>執行</span>
        </button>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import DataTable from '@/components/table/DataTable'
import DefaultSelect from '@/components/select/DefaultSelect'
import DefaultMultiSelect from '@/components/select/DefaultMultiSelect'

import { getDataFrameById, getDataFrameColumnInfoById } from '@/API/DataSource'
import { Message } from 'element-ui'

export default {
  name: 'PageAlgorithmCreate',
  components: {
    DataTable,
    DefaultSelect,
    DefaultMultiSelect
  },
  data () {
    return {
      isExecuting: false,
      isLoading: false,
      selectedAlgorithm: null,
      targetDatasource: null,
      targetDataframe: null,
      targetDatacolumn: null,
      timeDatacolumn: null,
      valueDatacolumns: [],
      dataframeList: [],
      datacolumnList: [],
      selectedDatacolumns: []
    }
  },
  mounted () {
    this.fetchDatasources()
  },
  watch: {
    targetDatacolumn (a, b) {
      if (b !== null) this.selectedDatacolumns.splice(this.selectedDatacolumns.indexOf(b), 1)
      if (this.selectedDatacolumns.indexOf(a) === -1) {
        this.selectedDatacolumns.push(a)
      }
    },
    timeDatacolumn (a, b) {
      if (b !== null) this.selectedDatacolumns.splice(this.selectedDatacolumns.indexOf(b), 1)
      if (this.selectedDatacolumns.indexOf(a) === -1) {
        this.selectedDatacolumns.push(a)
      }
    },
    valueDatacolumns: {
      deep: true,
      handler (a, b) {
        b.forEach(item => {
          if (item !== null) this.selectedDatacolumns.splice(this.selectedDatacolumns.indexOf(item), 1)
        })
        a.forEach(item => {
          if (this.selectedDatacolumns.indexOf(item) === -1) {
            this.selectedDatacolumns.push(item)
          }
        })
      }
    }
  },
  methods: {
    fetchDatasources () {
      this.isLoading = true
      return this.$store.dispatch('dataSource/getDataSourceList')
        .then(() => {
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
    },
    fetchDataframes (datasourceId) {
      return getDataFrameById(datasourceId)
        .then((e) => {
          this.dataframeList = e
        })
    },
    fetchDatacolumns (dataframeId) {
      return getDataFrameColumnInfoById(dataframeId)
        .then((e) => {
          this.datacolumnList = e
        })
    },
    back () {
      this.$router.push('/algorithm')
    },
    createData () {
      let now = new Date()
      return {
        id: this.selectedAlgorithm,
        dataframe: this.dataframeOptions.reduce((res, curr) => curr.value === this.targetDataframe ? curr.name : null, null),
        name: this.algorithmOptions.reduce((res, curr) => curr.value === this.selectedAlgorithm ? curr.name : null, null),
        creator: 'sygps',
        createDate: now,
        updateDate: now,
        status: '可執行'
      }
    },
    create () {
      this.$store.dispatch('algorithm/addAlgorithm', this.createData())
      this.back()
    },
    execute () {
      this.$store.dispatch('algorithm/addAlgorithm', this.createData())
      this.executeAlgorithm().then(() => {
        Message({
          message: '演算法處理完畢，請查看您的資料源列表。',
          type: 'success',
          duration: 3 * 1000
        })
        localStorage.setItem('isDemoEnd', 'true')
        // trigger refresh list
        this.fetchDatasources()
        this.back()
      })
    },
    executeAlgorithm () {
      this.isExecuting = true
      let demoWaitTime = localStorage.getItem('demoWaitTime') || 30000
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
          this.isExecuting = false
        }, demoWaitTime)
      })
    },
    onAlgorithmChange (e) {

    },
    onTargetDatasourceChange (e) {
      this.targetDataframe = null
      this.targetDatacolumn = null
      this.timeDatacolumn = null
      this.valueDatacolumns = []
      this.datacolumnList = []
      this.fetchDataframes(e)
    },
    onTargetDataframeChange (e) {
      this.targetDatacolumn = null
      this.timeDatacolumn = null
      this.valueDatacolumns = []
      this.fetchDatacolumns(e)
    },
    onValueDatacolumnsChange (e) {
      this.valueDatacolumns = e
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
    algorithmOptions () {
      return [
        // {
        //   name: '預測性維修',
        //   value: 1,
        // },
        {
          name: '輪廓型預測',
          value: 2,
        }
      ]
    },
    datasourceOptions () {
      return this.dataSourceList.map(item => {
        return {
          name: item.name,
          value: item.id
        }
      })
    },
    dataframeOptions () {
      return this.dataframeList.map(item => {
        return {
          name: item.primaryAlias,
          value: item.id
        }
      })
    },
    datacolumnOptions () {
      return this.datacolumnList.reduce((result, item) => {
        if (this.selectedDatacolumns.indexOf(item.id) > -1) return result
        result.push({
          name: item.name,
          value: item.id
        })
        return result
      }, [])
    },
    numericDatacolumnOptions () {
      return this.datacolumnList.reduce((result, item) => {
        if (this.selectedDatacolumns.indexOf(item.id) > -1) return result
        if (item.statsType !== 'NUMERIC') return result
        result.push({
          name: item.name,
          value: item.id
        })
        return result
      }, [])
    },
    datetimeDatacolumnOptions () {
      return this.datacolumnList.reduce((result, item) => {
        if (this.selectedDatacolumns.indexOf(item.id) > -1) return result
        if (item.statsType !== 'DATETIME') return result
        result.push({
          name: item.name,
          value: item.id
        })
        return result
      }, [])
    },
    booleanDatacolumnOptions () {
      return this.datacolumnList.reduce((result, item) => {
        if (this.selectedDatacolumns.indexOf(item.id) > -1) return result
        if (item.statsType !== 'BOOLEAN' && item.statsType !== 'CATEGORY') return result
        result.push({
          name: item.name,
          value: item.id
        })
        return result
      }, [])
    }
  }
}
</script>
<style lang="scss" scoped>
.page-algorithm {
  .title-link {
    color: $theme-color-primary;
    text-decoration: underline;
  }
  .divider {
    margin: 0 8px;
    color: #979797;
  }

  .status-block {
    width: 140px;
    position: absolute;
    top: 60px;
    right: 0;
    left: 0;
    margin: auto;
    padding: 6px 0;
    border-radius: 8px;
    background-color: $theme-bg-darker-color;
    box-shadow:  0px 4px 24px rgba(26, 56, 62, 0.5);
    text-align: center;

    .spinner-icon {
      margin-right: 8px;
    }
  }
  
  .table-board {
    margin: 16px 0;

    .board-title-row {
      font-size: 20px;
      // color: #a7a7a7;
    }
    .content {
      // display: flex;
      // flex-wrap: wrap;
      .input {
        font-size: 14px;
        width: 160px;
        min-height: 30px;
        margin-right: 12px;
        color: #a7a7a7;

        &.el-input--suffix .el-input__inner {
          padding-left: 0;
        }
      }
      .item-wrap {
        display: flex;
        flex-wrap: wrap;
        margin: 20px 0;
        .content-item {
          margin: 0;
        }
      }
      .content-item {
        margin: 20px 0;
        padding-right: 36px;
        display: flex;

        &.size-4 {
          width: 33%;
        }
        &.size-6 {
          width: 50%;
        }
        &.size-12 {
          width: 100%;
        }
      }
      .item-title {
        font-size: 14px;
        min-width: 80px;
        max-width: 180px;
        margin-right: 16px;
        align-items: center;
        display: flex;
        color: #a7a7a7;
        padding-left: 12px;

        &.must {
          margin-left: -8px;
          &:before {
            content: '*';
            color: #e46d6d;
          }
        }
      }
    }
  }
  
  .footer {
    float: right;
    margin: 0 -6px;

    .btn {
      margin: 0 6px;
    }
  }
}

</style>
<style lang="scss">
.page-algorithm {
  .table-board {
    .content {
      input.el-input__inner {
        height: 30px;
        font-size: 14px;
        padding-left: 0;
        color: #a7a7a7;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
}

</style>