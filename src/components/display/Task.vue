<template>
  <div class="task"
    :class="{'task-mask': isGetPagination}"
    :data-component-id="componentId"
    :data-result-id="resultId"
    :data-diagram-type="diagram"
    :data-intend="intend"
  >
    <spinner class="task-spinner"
      v-if="loading"
    ></spinner>
    <no-result v-else-if="isError" :message="errorMessage"></no-result>
    <template v-else-if="diagram">
      <!-- TODO: 調整寫法 -->
      <component
        :is="componentName"
        :has-pagination="hasNextPage"
        :dataset="componentData.dataset"
        :title="componentData.title"
        :message="componentData.message"
        :segmentation="componentData.segmentation"
        :info="componentData.info || componentData.data"
        :features="componentData.features"
        :confidence="componentData.confidence"
        :formula="componentData.ax_b"
        :text="componentData.text"
        :chart-data="componentData.chart_data"
        :notes="componentData.notes"
        :causes="componentData.causes"
        :description="componentData.description"
        :total="componentData.total"
        :key="componentId"
        @next="getNewPageInfo"
      ></component>
      <div class="task-note"
        v-for="(note, index) in notes" v-bind:key="index"
      >
        {{note}}
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'Task',
  props: {
    componentId: {
      type: Number
    },
    intend: {
      type: String
    }
  },
  data () {
    return {
      resultId: null,
      diagram: null,
      loading: true,
      componentName: null,
      componentData: null,
      isError: false,
      errorMessage: '',
      notes: [],
      timeoutFunction: null,
      pagination: {
        currentPage: 0,
        totalPages: 1
      },
      isGetPagination: false,
      // 是否有下一頁資料
      hasNextPage: false,
      maxDataLengthPerPage: 200,
      // 下個分頁資料
      nextPageData: null
    }
  },
  mounted () {
    this.handleTaskInitData()
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    fetchData (page = 0) {
      window.clearTimeout(this.timeoutFunction)
      return this.$store.dispatch('chatBot/getComponentData', {
        id: this.componentId,
        page
      }).then(response => {
        switch (response.status) {
          case 'Process':
          case 'Ready':
            this.timeoutFunction = window.setTimeout(() => {
              this.fetchData(page)
            }, 1000)
            break
          case 'Complete':
            window.clearTimeout(this.timeoutFunction)
            this.diagram = response.diagram
            this.resultId = response.resultId
            this.componentName = this.getChartTemplate(this.diagram)
            let responseData = response.data

            // 取樣
            if (responseData.sampling) {
              this.appendNote(this.genSamplingNote(responseData.sampling))
            }
            // 取前 n 筆
            if (responseData.group_limit) {
              this.appendNote(this.genGroupLimitNote(responseData.group_limit))
            }

            console.log(responseData, 'responseData')

            if (responseData.dataset) {
              // 如果拿到的資料為空 表示這一頁已經是最後一頁了
              if (responseData.dataset.data.length === 0) {
                this.hasNextPage = false
                this.nextPageData = null
                // 空資料的處理
                if (page === 0) {
                  this.isError = true
                  this.errorMessage = this.$t('message.emptyResult')
                }
              } else {
                return responseData
              }
            } else {
              // 圖表以外的 task
              this.componentData = responseData
              this.hasNextPage = false
              this.nextPageData = null
            }
            break
          case 'Disable':
          case 'Delete':
          case 'Warn':
          case 'Fail':
            window.clearTimeout(this.timeoutFunction)
            this.loading = false
            // 如果取分頁資料 fail，當作無資料來處理
            if (page > 0) {
              this.hasNextPage = false
              this.isGetPagination = false
              this.nextPageData = null
              break
            }
            if (this.intend === 'key_result') this.isError = true
            break
        }
      }).catch(() => {
        if (this.intend === 'key_result') this.isError = true
      }).finally(() => {
        this.loading = false
      })
    },
    handleTaskInitData () {
      this.fetchData(this.pagination.currentPage).then(taskData => {
        if (taskData) {
          this.componentData = taskData
          this.fetchData(this.pagination.currentPage + 1).then(nextPagedata => {
            if (nextPagedata) {
              this.nextPageData = nextPagedata
              this.hasNextPage = true
            }
          })
        }
      })
    },
    getNewPageInfo () {
      this.isGetPagination = true
      this.pagination.currentPage += 1
      // 將下一頁的資料塞進去
      this.updateChartData(this.nextPageData)
      // 確認下一頁有沒有資料
      this.fetchData(this.pagination.currentPage).then(taskData => {
        if (taskData) {
          this.nextPageData = taskData
          this.hasNextPage = true
        }
      })
    },
    updateChartData (taskData) {
      // 分頁的資料 push 進去
      if (this.diagram === 'line_chart') {
        let indexLength = this.componentData.dataset.index.length
        if (taskData.dataset.index.length === 1) {
          let restDataLength = taskData.dataset.data[0].length
          this.componentData.dataset.data[indexLength - 1].splice(this.componentData.dataset.columns.length - restDataLength, restDataLength)
          this.componentData.dataset.data[indexLength - 1] = this.componentData.dataset.data[indexLength - 1].concat(taskData.dataset.data[0])
        } else if (taskData.dataset.index.length > 1) {
          let firstNotNullIndex = taskData.dataset.data[0].findIndex(element => element !== null)
          // 檢查有沒有空值
          if (firstNotNullIndex > 0) {
            // 補最後一行的資料
            taskData.dataset.data[0].splice(0, firstNotNullIndex)
            this.componentData.dataset.data[indexLength - 1].splice(firstNotNullIndex, this.componentData.dataset.columns.length - firstNotNullIndex)
            this.componentData.dataset.data[indexLength - 1] = this.componentData.dataset.data[indexLength - 1].concat(taskData.dataset.data[0])
            taskData.dataset.data.shift()
            this.componentData.dataset.data = this.componentData.dataset.data.concat(taskData.dataset.data)
            taskData.dataset.index.shift()
            this.componentData.dataset.index = this.componentData.dataset.index.concat(taskData.dataset.index)
            if (taskData.dataset.display_index) {
              taskData.dataset.display_index.shift()
              this.componentData.dataset.display_index = this.componentData.dataset.display_index.concat(taskData.dataset.display_index)
            }
          } else {
            this.componentData.dataset.data = this.componentData.dataset.data.concat(taskData.dataset.data)
            this.componentData.dataset.index = this.componentData.dataset.index.concat(taskData.dataset.index)
            if (this.componentData.dataset.display_index) {
              this.componentData.dataset.display_index = this.componentData.dataset.display_index.concat(taskData.dataset.display_index)
            }
          }
        }
      } else {
        this.componentData.dataset.data = this.componentData.dataset.data.concat(taskData.dataset.data)
        this.componentData.dataset.index = this.componentData.dataset.index.concat(taskData.dataset.index)
        if (this.componentData.dataset.display_index) {
          this.componentData.dataset.display_index = this.componentData.dataset.display_index.concat(taskData.dataset.display_index)
        }
      }

      this.$nextTick(() => {
        this.isGetPagination = false
      })
    },
    appendNote (note) {
      this.notes.push(note)
    },
    genSamplingNote (randomLimit) {
      return this.$t('resultNote.samplingNote', {randomLimit})
    },
    genGroupLimitNote (randomLimit) {
      return this.$t('resultNote.groupLimitNote', {randomLimit})
    }
  }
}
</script>
<style lang="scss" scoped>
.task {
  position: relative;
  width: 100%;

  .task-note {
    &::before {
      content: '#';
    }
    color: #A7A7A7;
    font-size: 12px;
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
  }
}
</style>
