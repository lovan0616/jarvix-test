<template>
  <div class="task"
    :class="{'task-mask': isGetPagination, 'has-pagination': pagination.totalPages > 1}"
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
        :dataset="componentData.dataset"
        :title="componentData.title"
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
      ></component>
      <div class="task-note"
        v-for="(note, index) in notes" v-bind:key="index"
      >
        {{note}}
      </div>
      <div class="pagination-block"
        v-if="componentData.dataset && componentData.dataset.data.length === 200"
        :class="{'key-result-pagination': intend === 'key_result'}"
      >
        <button class="btn-m btn-default"
          @click="getNewPageInfo"
        >{{ $t('resultDescription.getMoreBtn') }}</button>
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
      isGetPagination: false
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
            // 分頁的資料 push 進去
            // if (this.pagination.totalPages > 1 && this.pagination.currentPage !== 0) {
            //   this.componentData.dataset.data = this.componentData.dataset.data.concat(response.data.dataset.data)
            //   this.componentData.dataset.index = this.componentData.dataset.index.concat(response.data.dataset.index)

            //   this.$nextTick(() => {
            //     this.isGetPagination = false
            //   })
            // } else {
            //   this.componentData = response.data
            // }
            console.log(response)
            this.componentData = response.data
            // this.pagination = response.pagination
            this.loading = false
            // 如果有分頁資料還沒取
            // if (this.pagination.totalPages > 1 && this.pagination.totalPages > this.pagination.currentPage + 1) {
            //   this.isGetPagination = true
            //   this.pagination.currentPage += 1
            //   this.fetchData()
            // } else if (this.pagination.totalPages > 1 && this.pagination.totalPages === this.pagination.currentPage + 1) {
            //   this.isGetPagination = false
            // }

            // 空資料的處理
            if (this.componentData.dataset && this.componentData.dataset.data.length === 0) {
              this.isError = true
              this.errorMessage = this.$t('message.emptyResult')
            }
            // 取樣
            if (response.data.sampling) {
              this.appendNote(this.genSamplingNote(response.data.sampling))
            }
            // 取前 n 筆
            if (response.data.group_limit) {
              this.appendNote(this.genGroupLimitNote(response.data.group_limit))
            }
            break
          case 'Disable':
          case 'Delete':
          case 'Warn':
          case 'Fail':
            window.clearTimeout(this.timeoutFunction)
            this.loading = false
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

  .pagination-block {
    display: flex;
    align-items: center;

    &.key-result-pagination {
      position: absolute;
      top: -30px;
      left: 0;
    }

    .btn-m {
      margin-right: 12px;
    }

    .loading-percentage {
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>
