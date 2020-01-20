<template>
  <div class="task"
    :data-component-id="componentId"
    :data-result-id="resultId"
    :data-diagram-type="diagram"
    :data-intend="intend"
  >
    <spinner class="task-spinner"
      v-if="loading"
    ></spinner>
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
    </template>
    <no-result v-else-if="isError" :message="errorMessage"></no-result>
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
      timeoutFunction: null
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
      window.clearTimeout(this.timeoutFunction)
      this.$store.dispatch('chatBot/getComponentData', this.componentId).then(response => {
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
            // this.createTaskByTemplateAndData({template: this.getChartTemplate(this.diagram), data: response.data})
            this.componentName = this.getChartTemplate(this.diagram)
            this.componentData = response.data
            this.loading = false

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
      })
    },
    appendNote (note) {
      this.notes.push(note)
    },
    genSamplingNote (randomLimit) {
      return this.$t('resultNote.samplingNote', {randomLimit})
    }
  }
}
</script>
<style lang="scss" scoped>
.task {
  width: 100%;

  .task-note {
    &::before {
      content: '#';
    }
    color: #A7A7A7;
    font-size: 12px;
  }
}
</style>
