<template>
  <div class="task-root"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="transparent"
  >
    <component
      :is="childContent"
    ></component>
  </div>
</template>

<script>
import { getTask } from '@/API/Ask'
import Vue from 'vue'

export default {
  name: 'Task',
  props: {
    dataUrl: { type: String, default: '' },
    templateUrl: { type: String, default: '' },
    params: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      loading: true,
      entities: this.params,
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
      Promise.all([
        getTask(this.templatePath, this.params).then(res => res),
        getTask(this.dataPath, this.params).then(res => res)
      ]).then(res => {
        const template = res[0]
        const data = res[1]

        this.createTaskByTemplateAndData({ template, data })
      }).catch(() => {
        this.loading = false
      })
    },
    createTaskByTemplateAndData ({ template = '', data = {} }) {
      this.childContent = Vue.extend({
        template,
        data () {
          return data
        }
      })
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
