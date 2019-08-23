<template>
  <div class="task-root">
    <spinner class="task-spinner"
      v-if="loading"
    ></spinner>
    <component ref="taskComponent"
      v-else
      :is="childContent"
    ></component>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import { getTask } from '@/API/Ask'

export default {
  name: 'Task',
  props: {
    dataUrl: { type: String, default: '' },
    templateUrl: { type: String, default: '' },
    // entities
    params: { type: Object, default: () => ({}) }
  },
  components: {
    Spinner
  },
  data () {
    return {
      loading: true,
      urlRoot: window.env.API_ROOT_URL,
      childContent: undefined
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
    genTaskByTemplateAndData () {
      // 同時取得 template && data
      Promise.all([
        getTask(this.templatePath, this.params).then(res => res),
        getTask(this.dataPath, this.params).then(res => res)
      ]).then(res => {
        const template = res[0]
        const data = res[1]

        this.createTaskByTemplateAndData({ template, data })
      }).catch(() => {
        this.createTaskByTemplateAndData({ template: '<NoResult />', data: {} })
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
  min-height: 20px;
  overflow: hidden;
}
</style>
