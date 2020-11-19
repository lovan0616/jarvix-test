<template>
  <div class="component-item">
    <span class="item-header">
      <span class="item-title">{{ componentData.config.diaplayedName }}</span>
      <div 
        v-if="isEditMode" 
        class="component-setting-box">
        <svg-icon 
          icon-class="more"
          class="more-icon" />
        <slot name="drowdown"/>
      </div>
    </span>
    <task
      :component-id="componentData.keyResultId"
      intend="key_result"
    />
  </div>
</template>

<script>
export default {
  name: 'DashboardTask',
  props: {
    componentData: {
      type: Object,
      default: null,
      required: true
    },
    isEditMode: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data () {
    return {
      timeoutFunction: null,
      totalSec: 0,
      periodSec: 0
    }
  },
  watch: {
    // 當Dashboard的fitler變動時，由元件內部去重做result,再把新的result,key_result,questionId傳出去更新外部components資訊
    'componentData.restrictions': {
      immediate: false,
      handler (value) {
        console.log(value)

        this.$store.dispatch('chatBot/askResult', {
          questionId: this.componentData.questionId,
          segmentation: this.componentData.segmentation,
          restrictions: this.componentData.restrictions,
          selectedColumnList: null
        }).then(res => {
          this.getComponentV2(res.resultId)
        }).catch(() => {})
      }
    }
  },
  methods: {
    getComponentV2 (resultId) {
      window.clearTimeout(this.timeoutFunction)
      this.$store.dispatch('chatBot/getComponentList', resultId)
        .then(componentResponse => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.getComponentV2(resultId)
              }, this.totalSec)

              this.totalSec += this.periodSec
              this.periodSec = this.totalSec
              break
            case 'Complete':
              this.totalSec = 50
              this.periodSec = 200
              console.log('最後一哩路')
              console.log(componentResponse)
              // this.$emit('updateResult', )
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              break
          }
        }).catch((error) => {})
    },
  }
}
</script>
