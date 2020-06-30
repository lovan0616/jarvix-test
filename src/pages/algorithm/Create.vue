<template>
  <div class="page-algorithm">
    <spinner
      v-if="isExecuting"
      :title="$t('algorithm.processing')"
      class="layout-spinner"
      size="50"
    />
    <template v-else>
      <div class="page-title-row">
        <h1 class="title">{{ $t('algorithm.management') }}</h1>
        <div class="bread-crumb">
          <router-link
            :to="{name: 'PageAlgorithmList'}"
            class="title-link">{{ $t('algorithm.name') }}</router-link>
          <span class="divider">/</span>{{ $t('button.create') }}
        </div>
      </div>
      <div class="table-board">
        <div class="board-title-row">
          {{ $t('algorithm.name') }}
        </div>
        <div class="content">
          <div class="item-wrap">
            <div class="content-item">
              <div class="item-title must">{{ $t('algorithm.type') }}: </div>
              <default-select
                v-model="selectedAlgorithm"
                :option-list="algorithmOptions"
                class="tag-select input"
                @change="onAlgorithmChange"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="table-board">
        <div class="board-title-row">
          {{ $t('algorithm.trainDataSetting') }}
        </div>
        <div class="content">
          <div class="item-wrap">
            <div class="content-item">
              <div class="item-title must">{{ $t('algorithm.targetDataSource') }}: </div>
              <default-select
                v-model="targetDatasource"
                :option-list="datasourceOptions"
                class="tag-select input"
                @change="onTargetDatasourceChange"
              />
            </div>
            <div class="content-item">
              <div class="item-title must">{{ $t('algorithm.targetDataSource') }}: </div>
              <default-select 
                :style="{width: '240px'}" 
                v-model="targetDataframe"
                :option-list="dataframeOptions"
                class="tag-select input"
                @change="onTargetDataframeChange"
              />
            </div>
          </div>

          <div class="item-wrap">
            <div class="content-item">
              <div class="item-title must">{{ $t('algorithm.targetParamColumn') }}: </div>
              <default-select
                v-model="targetDatacolumn"
                :option-list="datacolumnOptions"
                class="tag-select input"
              />
            </div>
            <div class="content-item">
              <div class="item-title must">{{ $t('algorithm.timeColumn') }}: </div>
              <default-select
                v-model="timeDatacolumn"
                :option-list="datacolumnOptions"
                class="tag-select input"
              />
            </div>
          </div>
          <div class="content-item">
            <div class="item-title must">{{ $t('algorithm.measurementColumn') }}: </div>
            <default-multi-select 
              :style="{width: '360px'}" 
              v-model="valueDatacolumns"
              :option-list="datacolumnOptions"
              class="tag-select input"
              @change="onValueDatacolumnsChange"
            />
          </div>
        </div>
      </div>

      <div class="footer">
        <button
          type="button"
          class="btn btn-outline"
          @click="back"
        >{{ $t('button.cancel') }}</button>
        <!-- <button type="button" class="btn btn-default"
          @click="create"
        >
          <span>{{ $t('button.create') }}</span>
        </button> -->
        <button 
          type="button" 
          class="btn btn-default"
          @click="execute"
        >
          <span>{{ $t('algorithm.execute') }}</span>
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
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
    algorithmOptions () {
      return [
        // {
        //   name: this.$t('algorithm.predictiveMaintenance'),
        //   value: 1,
        // },
        {
          name: this.$t('algorithm.contourPrediction'),
          value: 2
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
  mounted () {
    this.fetchDatasources()
  },
  methods: {
    fetchDatasources () {
      this.isLoading = true
      return this.$store.dispatch('dataSource/getDataSourceList', {})
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
    createData (outputDatasourceName = null) {
      let now = new Date()
      return {
        id: this.selectedAlgorithm,
        inputDatasource: this.datasourceOptions.reduce((res, curr) => curr.value === this.targetDatasource ? curr.name : res, null),
        outputDatasource: outputDatasourceName,
        dataframe: this.dataframeOptions.reduce((res, curr) => curr.value === this.targetDataframe ? curr.name : res, null),
        name: this.algorithmOptions.reduce((res, curr) => curr.value === this.selectedAlgorithm ? curr.name : res, null),
        creator: 'sygps',
        createDate: now,
        updateDate: now,
        status: this.$t('algorithm.executable')
      }
    },
    create () {
      this.$store.dispatch('algorithm/addAlgorithm', this.createData())
      this.back()
    },
    execute () {
      let demoDatasource = localStorage.getItem('demoDatasource') || this.$t('algorithm.foxconnContourPredictionMolding')
      this.$store.dispatch('algorithm/addAlgorithm', this.createData(demoDatasource))
      this.executeAlgorithm().then(() => {
        Message({
          message: this.$t('algorithm.algoProcessFinished', { demoDatasource }),
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
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/pages/_algorithm.scss';

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
