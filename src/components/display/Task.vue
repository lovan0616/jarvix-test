<template>
  <div class="task"
    :data-id="componentId"
    :data-result-id="resultId"
    :data-diagram-type="diagram"
  >
    <spinner class="task-spinner"
      v-if="loading"
    ></spinner>
    <template v-else-if="!isError">
      <component ref="taskComponent"
        :is="componentName"
        :dataset="componentData.dataset"
        :title="componentData.title"
        :segmentation="componentData.segmentation"
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
    }
  },
  data () {
    return {
      resultId: null,
      diagram: null,
      loading: true,
      childContent: undefined,
      componentName: null,
      componentData: null,
      isError: false,
      errorMessage: '',
      notes: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.dispatch('chatBot/getComponentData', this.componentId).then(response => {
        switch (response.status) {
          case 'Process':
          case 'Ready':
            window.setTimeout(() => {
              this.fetchData()
            }, 1000)
            break
          case 'Complete':
            this.diagram = response.diagram
            this.resultId = response.resultId
            // this.createTaskByTemplateAndData({template: this.getChartTemplate(this.diagram), data: response.data})
            this.componentName = this.getChartTemplate(this.diagram)
            this.componentData = response.data
            this.loading = false

            break
          case 'Fail':
            this.loading = false
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
