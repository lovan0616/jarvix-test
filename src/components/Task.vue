<template>
  <div class="task-root">
    <spinner class="task-spinner"
      v-if="loading"
    ></spinner>
    <component ref="taskComponent"
      v-else-if="!isError"
      :is="childContent"
      @task-event="onTaskEmitEvent"
    ></component>
    <no-result v-else :message="errorMessage"></no-result>
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
      errorMessage: ''
    }
  },
  mounted () {
    this.genTaskByTemplateAndData()
  },
  computed: {
    templatePath () {
      return this.urlRoot + this.templateUrl
    },
    dataPath () {
      return this.urlRoot + this.dataUrl
    }
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
      }).catch(err => {
        this.loading = false
        this.isError = true
        if (err.error) {
          if (err.error.code === 'TASKWARN0002') this.errorMessage = this.$t('errorMessage.TASKWARN0002')
          else if (err.error.code === 'TASKWARN0003') this.errorMessage = this.$t('errorMessage.TASKWARN0003')
          else this.errorMessage = this.$t('message.noResult')
        }
      })

      // 為了顯示上的友善，就算資料拿不回來，template也還是要顯示
      // getTask(this.templatePath, this.params).then(templateInfo => {
      //   getTask(this.dataPath, this.params).then(dataInfo => {
      //     this.createTaskByTemplateAndData({ template: templateInfo, data: dataInfo })
      //   }).catch(() => {
      //     this.createTaskByTemplateAndData({ template: templateInfo, data: {} })
      //   })
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    createTaskByTemplateAndData ({ template = '', data = {} }) {
      this.childContent = {
        template,
        data () {
          return data
        }
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.task-root {
  width: 100%;
  // min-height: 20px;
  // overflow: hidden;
}
</style>
