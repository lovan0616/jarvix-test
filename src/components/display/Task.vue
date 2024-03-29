<template>
  <div
    :class="{'task-mask': isGetPagination}"
    :data-component-id="componentId"
    :data-result-id="resultId"
    :data-diagram-type="diagram"
    :data-intend="intend"
    class="task"
  >
    <spinner
      v-if="loading"
      :class="{'key-result-spinner': intend === 'key_result'}"
      class="task-spinner"
    />
    <no-result
      v-else-if="isError"
      :message="errorMessage"
    />
    <template v-else-if="diagram">
      <button
        v-if="isPinboardPage && componentData.dataset && componentData.dataset.allowMonitorConfig"
        type="button"
        class="btn-m btn-secondary btn-monitor"
        @click="openMonitorSettingDialog"
      >
        {{ $t('button.monitorSetting') }}
      </button>
      <!-- TODO: 調整寫法 -->
      <component
        :is="componentName"
        :component-id="componentId"
        :can-download-csv="canDownloadCsv"
        :diagram="diagram"
        :has-pagination="hasNextPage"
        :dataset="componentData.dataset"
        :title="componentData.title"
        :message="componentData.message"
        :segmentation="componentData.segmentation"
        :info="componentData.info || componentData.data"
        :features="componentData.features"
        :confidence="componentData.confidence"
        :formula="componentData.displayCoefficients"
        :coefficients="componentData.coeffs"
        :coefficient-line-type="componentData.coefficientLineType"
        :text="componentData.text"
        :chart-data="componentData.chart_data"
        :notes="componentData.notes"
        :causes="componentData.causes"
        :description="componentData.description"
        :total="componentData.total"
        :item-count="componentData.item_count"
        :coeffs="componentData.coeffs"
        :cluster-infos="componentData.clusterInfos"
        :sub-components="componentData.subComponents"
        :key="componentId"
        :is-show-toolbox="isShowToolbox"
        :custom-chart-style="customChartStyle"
        :arrow-btn-right="arrowBtnRight"
        :is-show-label-data="isShowLabelData"
        :is-show-description="isShowDescription"
        :is-show-coefficients="isShowCoefficients"
        :is-show-donwnload-btn="isShowDonwnloadBtn"
        :custom-cell-class-name="customCellClassName"
        :is-hoverable="isHoverable"
        :is-show-legend="isShowLegend"
        class="task-component"
        @next="getNewPageInfo"
        @toggleLabel="toggleLabel"
        @clickCell="$emit('clickCell', $event)"
        @clickRow="$emit('clickRow', $event)"
        @clickChart="$emit('clickChart', $event)"
      />
      <div
        v-for="(note, index) in notes"
        :key="index"
        class="task-note"
      >
        {{ note }}
      </div>
    </template>
    <monitor-setting-dialog
      v-if="isShowMonitorSettingDialog"
      :component-id="componentId"
      :data-frame-id="dataFrameId"
      @confirm="updateMonitorSetting"
      @close="closeMonitorSettingDialog"
    />
  </div>
</template>
<script>
import MonitorSettingDialog from '@/pages/pinboard/components/MonitorSettingDialog'
import { formatComponentTitle } from '@/components/display/common/addons'
import { mapMutations } from 'vuex'

export default {
  name: 'Task',
  components: {
    MonitorSettingDialog
  },
  props: {
    dataFrameId: {
      type: Number,
      default: null
    },
    componentId: {
      type: Number,
      default: null
    },
    intend: {
      type: String,
      default: null
    },
    isShowToolbox: {
      type: Boolean,
      default: true
    },
    isShowLegend: {
      type: Boolean,
      default: true
    },
    isShowDescription: {
      type: Boolean,
      default: true
    },
    isShowCoefficients: {
      type: Boolean,
      default: true
    },
    isShowDonwnloadBtn: {
      type: Boolean,
      default: true
    },
    customChartStyle: {
      type: Object,
      default: () => {}
    },
    arrowBtnRight: {
      type: Number,
      default: 80
    },
    convertedType: {
      type: String,
      default: null
    },
    customCellClassName: {
      type: Array,
      default: () => []
    },
    isHoverable: {
      type: Boolean,
      default: false
    },
    anomalySetting: {
      type: Object,
      default: () => ({
        xAxis: {
          upperLimit: null,
          lowerLimit: null
        },
        yAxis: {
          upperLimit: null,
          lowerLimit: null
        }
      })
    }
  },
  data () {
    return {
      resultId: null,
      diagram: null,
      loading: true,
      canDownloadCsv: false,
      componentName: null,
      componentData: null,
      isError: false,
      errorMessage: '',
      notes: [],
      timeoutFunction: null,
      autoRefreshFunction: null,
      pagination: {
        currentPage: 0,
        totalPages: 1
      },
      isGetPagination: false,
      // 是否有下一頁資料
      hasNextPage: false,
      maxDataLengthPerPage: 200,
      isShowMonitorSettingDialog: false,
      isShowLabelData: false
    }
  },
  computed: {
    isPinboardPage () {
      return this.$route.name === 'PersonalPagePinboard' || this.$route.name === 'ProjectPagePinboard'
    }
  },
  mounted () {
    this.handleTaskInitData()
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
    if (this.autoRefreshFunction) window.clearTimeout(this.autoRefreshFunction)
  },
  methods: {
    ...mapMutations('dataSource', ['setClusteringInfo', 'resetClusteringInfo']),
    fetchData (page = 0) {
      return new Promise((resolve, reject) => {
        window.clearTimeout(this.timeoutFunction)
        this.$store.dispatch('chatBot/getComponentData', {
          id: this.componentId,
          page
        }).then(response => {
          // 是否有下一頁，singlePage 為 false 代表還有下一頁
          this.hasNextPage = !response.singlePage
          if (response.isAutoRefresh) {
            this.hasNextPage = false
          }
          switch (response.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.fetchData(page).then(task => {
                  resolve(task)
                })
              }, 1000)
              break
            case 'Complete': {
              window.clearTimeout(this.timeoutFunction)
              this.diagram = response.diagram
              this.resultId = response.resultId
              this.canDownloadCsv = response.supportedFunction ? response.supportedFunction.canDownloadCsv : response.canDownloadCsv
              this.componentName = this.getChartTemplate(this.convertedType || this.diagram)
              let responseData = response.data

              // 推薦洞察 需要將 question 傳給外層組件顯示用
              if (responseData.question) {
                this.$emit('setQuestion', responseData.question)
              }
              // miniApp 需要將 diagram 傳給外層以顯示不同新增元件設定項
              this.$emit('setDiagram', response.diagram)

              // component 設定資訊
              // 舊資料內可能不含 supportedFunction，這邊做上下兼容處理
              let enableAlert = response.supportedFunction ? response.supportedFunction.analysisInfo.enableAlert : (response.enableAlert || false)
              this.$emit('setConfig', {
                enableAlert,
                // 2N 異常設定示警需要 x 軸欄位資訊
                ...((enableAlert && responseData.title) && {
                  xAxis: responseData.title.xAxis && responseData.title.xAxis.filter(xAxis => xAxis.dc_id),
                  yAxis: responseData.title.yAxis
                }),
                // 元件設定資訊集
                supportedFunction: response.supportedFunction
              })

              // 圖表異常標記設定和轉換
              if (responseData.title) {
                responseData.title.xAxis = formatComponentTitle(responseData.title.xAxis, this.anomalySetting.xAxis)
                responseData.title.yAxis = formatComponentTitle(responseData.title.yAxis, this.anomalySetting.yAxis)
              }

              let isAutoRefresh = response.isAutoRefresh
              if (isAutoRefresh && this.isPinboardPage) {
                this.autoRefreshFunction = window.setTimeout(() => {
                  this.autoRefreshData()
                }, 60 * 1000)
              }
              // 取樣
              if (responseData.sampling) {
                this.appendNote(this.genSamplingNote(responseData.sampling))
              }
              // 取前 n 筆
              if (responseData.group_limit) {
                this.appendNote(this.genGroupLimitNote(responseData.group_limit))
              }
              // 判斷是否為 圖表
              if (responseData.dataset) {
                // 分群分析
                if (responseData.dataset.columns && responseData.dataset.outliersBuckets) {
                  this.setClusteringInfo({
                    clusterList: responseData.dataset.columns,
                    hasOutlier: responseData.dataset.outliersBuckets.length > 0
                  })
                }

                // 如果拿到的資料為空陣列 表示這一頁已經是最後一頁了。或是 total 為 0 代表 pie chart 沒有資料
                if (responseData.dataset.data === null || responseData.dataset.data && (responseData.dataset.data.length === 0 || responseData.total === 0)) {
                  this.loading = false
                  this.hasNextPage = false
                  this.isGetPagination = false
                  // 空資料的處理
                  if (page === 0) {
                    this.isError = true
                    this.errorMessage = this.$t('message.emptyResult')
                    this.$emit('isEmpty')
                  }
                } else {
                  resolve(responseData)
                }
              } else {
                // 圖表以外的 task
                this.componentData = responseData
                this.hasNextPage = false
                this.loading = false
              }
              break
            }
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              window.clearTimeout(this.timeoutFunction)
              this.loading = false
              this.isGetPagination = false
              // 推薦洞察 若 component Fail 要從外層將組件隱藏起來
              this.$emit('failed')
              // 如果取分頁資料 fail，當作無資料來處理
              if (page > 0) {
                this.hasNextPage = false
                this.isGetPagination = false
              } else {
                if (this.intend === 'key_result') {
                  this.isError = true
                  this.errorMessage = response.errorMessage
                }
              }
              break
          }
        }).catch(() => {
          this.loading = false
          this.$emit('failed')
          if (this.intend === 'key_result') {
            if (page === 0) {
              this.isError = true
            }
            this.isGetPagination = false
            this.hasNextPage = false
          }
        })
          .finally(() => this.$emit('finished'))
      })
    },
    handleTaskInitData () {
      this.fetchData(this.pagination.currentPage).then(taskData => {
        this.componentData = taskData
      }).finally(() => {
        this.isGetPagination = false
        this.loading = false
      })
    },
    getNextPage (page) {
      this.fetchData(page).then(taskData => {
        // 將下一頁的資料塞進去
        this.updateChartData(taskData)
      }).finally(() => {
        this.isGetPagination = false
        this.loading = false
      })
    },
    getNewPageInfo () {
      this.isGetPagination = true
      this.pagination.currentPage += 1
      this.getNextPage(this.pagination.currentPage)
    },
    updateChartData (taskData) {
      // 分頁的資料 push 進去
      if (this.diagram === 'line_chart') {
        let indexLength = this.componentData.dataset.index.length

        // 合併 columns
        let concatColumns = [...new Set([...this.componentData.dataset.columns, ...taskData.dataset.columns])]

        // 檢查舊有資料需不需要補值
        if (concatColumns.length > this.componentData.dataset.columns.length) {
          let lengthDiff = concatColumns.length - this.componentData.dataset.columns.length
          this.componentData.dataset.data.forEach(element => {
            for (let i = 0; i < lengthDiff; i++) {
              element.push(null)
            }
          })
        }
        // 更新 columns
        this.componentData.dataset.columns = concatColumns

        // 處理 display_columns
        if (taskData.dataset.display_columns) {
          // 合併 columns
          let concatDisplayColumns = [...new Set([...this.componentData.dataset.display_columns, ...taskData.dataset.display_columns])]
          // 更新 columns
          this.componentData.dataset.display_columns = concatDisplayColumns
        }

        /**
         * 判斷需不需要銜接資料，舊的最後一筆跟新的第一筆一樣時間的話
         **/
        if (this.componentData.dataset.index[this.componentData.dataset.index.length - 1] === taskData.dataset.index[0]) {
          /**
           * 需要銜接資料
           * 可能前一頁的最後一列資料沒有拿完，因此要補最後一行的資料
           **/
          // 針對前一頁最後一個陣列的資料補上新資料第一個陣列的值
          let firstColumnData = taskData.dataset.data[0]
          // 舊資料最後一列
          let lastColumnData = this.componentData.dataset.data[indexLength - 1]
          // 新資料的 column 對應 index
          let columnIndexArray = []
          for (let i = 0; i < firstColumnData.length; i++) {
            let columnIndex = this.componentData.dataset.columns.findIndex(element => element === taskData.dataset.columns[i])
            columnIndexArray.push(columnIndex)
            if (firstColumnData[i] !== null) {
              this.$set(lastColumnData, columnIndex, firstColumnData[i])
            }
          }
          /**
           * TODO: 這邊待整理，這邊怕整理了之後失去了原本的邏輯
           */
          if (taskData.dataset.data.length > 1) {
            // 新資料移除第一列
            taskData.dataset.data.shift()
            // 接上新資料
            let newDatasetData = [...Array(this.componentData.dataset.columns.length)].map(element => null)
            taskData.dataset.data = taskData.dataset.data.map(element => {
              let arrayData = JSON.parse(JSON.stringify(newDatasetData))
              for (let i = 0; i < element.length; i++) {
                this.$set(arrayData, columnIndexArray[i], element[i])
              }
              return arrayData
            })

            this.componentData.dataset.data = this.componentData.dataset.data.concat(taskData.dataset.data)
          }

          if (taskData.dataset.index.length !== 1) {
            // index 更新
            taskData.dataset.index.shift()
            this.componentData.dataset.index = this.componentData.dataset.index.concat(taskData.dataset.index)
            if (taskData.dataset.display_index) {
              taskData.dataset.display_index.shift()
              this.componentData.dataset.display_index = this.componentData.dataset.display_index.concat(taskData.dataset.display_index)
            }

            if (taskData.dataset.timeStampList) {
              taskData.dataset.timeStampList.shift()
              this.componentData.dataset.timeStampList = this.componentData.dataset.timeStampList.concat(taskData.dataset.timeStampList)
            }
          }
        } else {
          /**
           * 不用銜接
           **/
          // 找出新 column 對應到舊 column 的 index
          let columnIndexArray = []
          for (let i = 0; i < taskData.dataset.columns.length; i++) {
            let columnIndex = this.componentData.dataset.columns.findIndex(element => element === taskData.dataset.columns[i])
            columnIndexArray.push(columnIndex)
          }
          // 新資料的空值矩陣，處理新 column 可能長度不一致的問題
          let newDatasetData = [...Array(this.componentData.dataset.columns.length)].map(element => null)
          // 接上新資料
          taskData.dataset.data = taskData.dataset.data.map(element => {
            let arrayData = JSON.parse(JSON.stringify(newDatasetData))
            for (let i = 0; i < element.length; i++) {
              this.$set(arrayData, columnIndexArray[i], element[i])
            }
            return arrayData
          })
          this.componentData.dataset.data = this.componentData.dataset.data.concat(taskData.dataset.data)

          // index 更新
          this.componentData.dataset.index = this.componentData.dataset.index.concat(taskData.dataset.index)
          if (this.componentData.dataset.timeStampList) {
            this.componentData.dataset.timeStampList = this.componentData.dataset.timeStampList.concat(taskData.dataset.timeStampList)
          }
          if (taskData.dataset.display_index) {
            this.componentData.dataset.display_index = this.componentData.dataset.display_index.concat(taskData.dataset.display_index)
          }
        }
      } else {
        this.componentData.dataset.data = this.componentData.dataset.data.concat(taskData.dataset.data)
        this.componentData.dataset.index = this.componentData.dataset.index.concat(taskData.dataset.index)
        if (this.componentData.dataset.timeStampList) {
          this.componentData.dataset.timeStampList = this.componentData.dataset.timeStampList.concat(taskData.dataset.timeStampList)
        }
        if (this.componentData.dataset.display_index) {
          this.componentData.dataset.display_index = this.componentData.dataset.display_index.concat(taskData.dataset.display_index)
        }
        if (this.componentData.dataset.predictDataList) {
          this.componentData.dataset.predictDataList = this.componentData.dataset.predictDataList.concat(taskData.dataset.predictDataList)
        }
      }
    },
    appendNote (note) {
      this.notes.push(note)
    },
    genSamplingNote (randomLimit) {
      return this.$t('resultNote.samplingNote', { randomLimit })
    },
    genGroupLimitNote (randomLimit) {
      return this.$t('resultNote.groupLimitNote', { randomLimit })
    },
    openMonitorSettingDialog () {
      this.isShowMonitorSettingDialog = true
    },
    updateMonitorSetting () {
      this.closeMonitorSettingDialog()
      this.autoRefreshData()
    },
    autoRefreshData () {
      this.loading = true
      this.fetchData().then(taskData => {
        this.componentData = taskData
        this.loading = false
      })
    },
    closeMonitorSettingDialog () {
      this.isShowMonitorSettingDialog = false
    },
    toggleLabel () {
      this.isShowLabelData = !this.isShowLabelData
    }
  }
}
</script>
<style lang="scss" scoped>
.task {
  position: relative;
  width: 100%;

  .task-spinner.key-result-spinner {
    height: 420px;
  }

  .task-note {
    &::before {
      content: '#';
    }
    color: #A7A7A7;
    font-size: 12px;
  }

  .btn-monitor {
    position: absolute;
    top: 0;
    right: 0;
  }

  // pagination 遮罩
  &.task-mask {
    position: relative;
    background: repeating-linear-gradient(to right, rgba(34, 64, 68, 0) 0%, rgba(34, 64, 68, 1) 50%, rgba(34, 64, 68, 0) 100%);
    width: 100%;
    background-size: 200% auto;
    background-position: 0 100%;
    animation: gradient 1s infinite;
    animation-fill-mode: forwards;
    animation-timing-function: linear;

    @keyframes gradient {
      0%   { background-position: 0 0; }
      100% { background-position: -200% 0; }
    }

    // 遮罩避免使用者點擊到看更多
    &:before {
      display: block;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
  }
}
</style>
