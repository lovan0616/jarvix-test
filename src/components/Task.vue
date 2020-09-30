<template>
  <div 
    :data-diagram-type="params.diagram_type"
    :data-task="dataUrl.split('/')[2]"
    class="task-root"
  >
    <spinner 
      v-if="loading"
      class="task-spinner"
    />
    <template v-else-if="!isError">
      <component 
        ref="taskComponent"
        :is="childContent"
        @task-event="onTaskEmitEvent"
      />
      <div 
        v-for="(note, index) in notes"
        :key="index" 
        class="task-note"
      >
        {{ note }}
      </div>
    </template>
    <no-result 
      v-else-if="isError" 
      :message="errorMessage"/>
  </div>
</template>

<script>
import { getTask } from '@/API/Ask'

export default {
  name: 'Task',
  props: {
    dataUrl: { type: String, default: '' },
    templateUrl: { type: String, default: '' },
    // entities
    params: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      loading: true,
      urlRoot: window.env.API_ROOT_URL,
      childContent: undefined,
      isError: false,
      errorMessage: '',
      notes: []
    }
  },
  computed: {
    templatePath () {
      return this.urlRoot + this.templateUrl
    },
    dataPath () {
      return this.urlRoot + this.dataUrl
    }
  },
  mounted () {
    this.genTaskByTemplateAndData()
  },
  methods: {
    onTaskEmitEvent (eventName, ...args) {
      this.$emit(eventName, ...args)
    },
    genTaskByTemplateAndData () {
      // 同時取得 template && data
      Promise.all([
        getTask(this.templatePath, this.params).then(res => res),
        getTask(this.dataPath, this.params).then(res => res)
      ]).then(res => {
        const template = res[0]
        const data = res[1]
        this.createTaskByTemplateAndData({ template, data })
        if (data['random_limit']) {
          this.appendNote(this.genSamplingNote(data['random_limit']))
        }
      }).catch(err => {
        this.loading = false
        if (err.error && this.params.diagram_type === 'key_result') {
          this.isError = true
          if (err.error.code === 'TASKWARN0002') this.errorMessage = this.$t('errorMessage.TASKWARN0002')
          else if (err.error.code === 'TASKWARN0003') this.errorMessage = this.$t('errorMessage.TASKWARN0003')
          else this.errorMessage = this.$t('message.noResult')
        }
      })
    },
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
.task-root {
  width: 100%;
  // min-height: 20px;
  // overflow: hidden;

  .task-note {
    &::before {
      content: '#';
    }
    color: #A7A7A7;
    font-size: 12px;
  }
}
</style>
