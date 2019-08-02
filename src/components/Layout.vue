<template>
  <div class="layout-root"
    v-loading="loading"
    element-loading-background="transparent"
  >
    <component ref="content" :is="content"></component>
  </div>
</template>

<script>
import Vue from 'vue'
import { queryResultData } from '@/API/Result'

export default {
  name: 'Layout',
  props: {
    template: { type: String, default: undefined },
    data: { type: Object, default: undefined }
  },
  data () {
    return {
      loading: true,
      content: undefined,
      relationship: [],
      extensions: []
    }
  },
  watch: {
    template: {
      handler (e) {
        console.log(this.$props, 'this.$props')
        if (e === undefined) this.destoryLayout()
        else this.createLayout(this.$props)
      },
      immediate: true
    },
    data (e) {
      this.createLayout(this.$props)
    }
  },
  mounted () {
    this.$events.$on('layoutMounted', this.layoutMounted)
    this.$events.$on('cleanRelations', this.cleanRelations)
    this.$events.$on('queryAnswer', this.queryAnswer)
  },
  beforeDestroy () {
    this.$events.$off('layoutMounted', this.layoutMounted)
    this.$events.$off('cleanRelations', this.cleanRelations)
    this.$events.$off('queryAnswer', this.queryAnswer)
  },
  methods: {
    layoutMounted () {
      console.log('layoutmount')
      this.$nextTick(() => {
        // init task relationship
        this.relationship = this.findTasks(this).map(task => this.createRelationshipNode(task))
      })
    },
    cleanRelations ({ taskNode }) {
      console.log('cleanRelations')
      const relationRoot = this.findRelationshipNodeByUid(this.relationship, taskNode._uid)
      if (relationRoot) this.cleanAllExtends(relationRoot)
    },
    cleanAllExtends (relationshipNode) {
      console.log('cleanAllExtends')
      relationshipNode.extends.forEach(rnode => {
        if (rnode.extends.length > 0) this.cleanAllExtends(rnode)
        this.subtractComponent(rnode.extension)
        this.removeExtension(rnode.extension)
      })
      relationshipNode.extends = []
    },
    findTasks (vm) {
      let result = []
      if (vm.$options._componentTag === 'task') result.push(vm)
      if (vm.$children.length > 0) {
        vm.$children.forEach(item => {
          result = result.concat(this.findTasks(item))
        })
      }
      return result
    },
    destoryLayout () {
      console.log('destoryLayout')
      this.loading = true
      this.content = undefined
      this.relationship = []
      this.extensions = []
    },
    createLayout ({ template, data = {} }) {
      console.log('createLayout')
      if (!template) return
      this.content = Vue.extend({
        template,
        data () {
          return data
        },
        mounted () {
          this.$nextTick(() => this.$events.$emit('layoutMounted'))
        }
      })
      this.loading = false
    },
    queryAnswer ({ eventArgs, taskNode }) {
      console.log('queryAnswer')
      this.createExtendLayout(eventArgs).then(Comp => {
        const parent = this.$refs.content.$children[0]
        const extension = new Comp({ parent })
        this.appendComponent(parent, extension)
        this.addExtension(extension)
        this.extendRelationshipNode(taskNode._uid, this.findTasks(extension), extension)
      })
    },
    createRelationshipNode (vm, extension) {
      console.log('createRelationshipNode')
      return { uid: vm._uid, extends: [], vm, extension }
    },
    extendRelationshipNode (uid, vms, extension) {
      console.log('extendRelationshipNode')
      const relationshipNode = this.findRelationshipNodeByUid(this.relationship, uid)
      if (relationshipNode) {
        const extendRelationshipNodes = vms.map(vm => this.createRelationshipNode(vm, extension))
        relationshipNode.extends = relationshipNode.extends.concat(extendRelationshipNodes)
      }
    },
    findRelationshipNodeByUid (ary, uid) {
      console.log('findRelationshipNodeByUid')
      let result
      ary.forEach(node => {
        if (node.uid === uid) result = node
        else result = this.findRelationshipNodeByUid(node.extends, uid)
      })
      return result
    },
    createExtendLayout (data) {
      console.log('createExtendLayout')
      return queryResultData(data)
        .then(d => this.createExtendLayoutComp(d))
    },
    createExtendLayoutComp ({ template, data = {} }) {
      console.log('createExtendLayoutComp')
      if (!template) return
      return Vue.extend({
        template,
        data () {
          return data
        }
      })
    },
    appendComponent (parent, vm) {
      console.log('appendComponent')
      const root = parent.$el.querySelector('.block-row')
      root.appendChild(vm.$mount().$el)
    },
    subtractComponent (vm) {
      console.log('subtractComponent')
      vm.$el.parentNode.removeChild(vm.$el)
      vm.$destroy()
    },
    addExtension (vm) {
      console.log('addExtension')
      this.extensions.push(vm)
    },
    removeExtension (vm) {
      console.log('removeExtension')
      const index = this.extensions.findIndex(extension => extension === vm)
      this.extensions.splice(index, 1)
    }
  }
}
</script>
