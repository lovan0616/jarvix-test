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
      maxDataLengthPerPage: 200
    }
  },
  mounted () {
    this.fetchData()
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    fetchData () {
      if (this.pagination.currentPage > 0) {
        this.isGetPagination = true
      }
      window.clearTimeout(this.timeoutFunction)
      this.$store.dispatch('chatBot/getComponentData', {
        id: this.componentId,
        page: this.pagination.currentPage
      }).then(response => {
        switch (response.status) {
          case 'Process':
          case 'Ready':
            this.timeoutFunction = window.setTimeout(() => {
              this.fetchData()
            }, 1000)
            break
          case 'Complete':
            window.clearTimeout(this.timeoutFunction)
            this.diagram = response.diagram
            this.resultId = response.resultId
            this.componentName = this.getChartTemplate(this.diagram)

            let responseData = response.data
            if (responseData.dataset) {
              // 如果拿到的資料為空 表示這一頁已經是最後一頁了
              if (responseData.dataset.data.length === 0) {
                this.hasNextPage = false
              } else {
                this.hasNextPage = true
              }
            } else {
              this.hasNextPage = false
            }

            // 分頁的資料 push 進去
            if (this.pagination.currentPage !== 0) {
              if (response.diagram === 'line_chart') {
                let indexLength = this.componentData.dataset.index.length
                if (responseData.dataset.index.length === 1) {
                  let restDataLength = responseData.dataset.data[0].length
                  this.componentData.dataset.data[indexLength - 1].splice(this.componentData.dataset.columns.length - restDataLength, restDataLength)
                  this.componentData.dataset.data[indexLength - 1] = this.componentData.dataset.data[indexLength - 1].concat(responseData.dataset.data[0])
                } else if (responseData.dataset.index.length > 1) {
                  let firstNotNullIndex = responseData.dataset.data[0].findIndex(element => element !== null)
                  // 檢查有沒有空值
                  if (firstNotNullIndex > 0) {
                    // 補最後一行的資料
                    responseData.dataset.data[0].splice(0, firstNotNullIndex)
                    this.componentData.dataset.data[indexLength - 1].splice(firstNotNullIndex, this.componentData.dataset.columns.length - firstNotNullIndex)
                    this.componentData.dataset.data[indexLength - 1] = this.componentData.dataset.data[indexLength - 1].concat(responseData.dataset.data[0])
                    responseData.dataset.data.shift()
                    this.componentData.dataset.data = this.componentData.dataset.data.concat(responseData.dataset.data)
                    responseData.dataset.index.shift()
                    this.componentData.dataset.index = this.componentData.dataset.index.concat(responseData.dataset.index)
                  } else {
                    this.componentData.dataset.data = this.componentData.dataset.data.concat(responseData.dataset.data)
                    this.componentData.dataset.index = this.componentData.dataset.index.concat(responseData.dataset.index)
                  }
                }
              } else {
                this.componentData.dataset.data = this.componentData.dataset.data.concat(responseData.dataset.data)
                this.componentData.dataset.index = this.componentData.dataset.index.concat(responseData.dataset.index)
              }

              this.$nextTick(() => {
                this.isGetPagination = false
              })
            } else {
              this.componentData = responseData
            }
            this.loading = false

            // 空資料的處理
            if (this.componentData.dataset && this.componentData.dataset.data.length === 0) {
              this.isError = true
              this.errorMessage = this.$t('message.emptyResult')
            }
            // 取樣
            if (responseData.sampling) {
              this.appendNote(this.genSamplingNote(responseData.sampling))
            }
            // 取前 n 筆
            if (responseData.group_limit) {
              this.appendNote(this.genGroupLimitNote(responseData.group_limit))
            }
            break
          case 'Disable':
          case 'Delete':
          case 'Warn':
          case 'Fail':
            window.clearTimeout(this.timeoutFunction)
            this.loading = false
            // 如果取分頁資料 fail，當作無資料來處理
            if (this.pagination.currentPage > 0) {
              this.hasNextPage = false
              this.isGetPagination = false
              break
            }
            if (this.intend === 'key_result') this.isError = true
            break
        }
      }).catch(() => {
        this.loading = false
        if (this.intend === 'key_result') this.isError = true
      })
    },
    getNewPageInfo () {
      this.pagination.currentPage += 1
      this.fetchData()
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
