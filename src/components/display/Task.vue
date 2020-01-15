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
        :data="componentData"
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
      intervalFunction: null,
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
    this.$store.dispatch('chatBot/getComponentData', this.componentId).then(response => {
      switch (response.status) {
        case 'Ready':
          if (this.intervalFunction !== null) break
          this.intervalFunction = window.setInterval(() => {
            this.$store.dispatch('chatBot/getComponentData', this.componentId)
          }, 1000)
          break
        case 'Complete':
          window.clearInterval(this.intervalFunction)
          this.diagram = response.diagram
          this.resultId = response.resultId
          // this.createTaskByTemplateAndData({template: this.getChartTemplate(this.diagram), data: response.data})
          this.componentName = this.getChartTemplate(this.diagram)
          this.componentData = response.data
          this.loading = false

          break
        case 'Fail':
          window.clearInterval(this.intervalFunction)
          this.loading = false
          break
      }
    })
  },
  methods: {
    createTaskByTemplateAndData ({ template = '', data = {} }) {
      this.childContent = {
        template,
        data () {
          return data
        }
      }
      this.loading = false
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
