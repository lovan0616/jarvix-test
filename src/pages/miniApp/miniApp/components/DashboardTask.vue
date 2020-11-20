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
      :key="componentData.keyResultId"
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
    filters: {
      type: Array,
      default: () => []
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
  computed: {
    restrictions () {
      return this.filters.map(filter => {
        let type = ''
        switch (filter.dataType) {
          case ('string'):
          case ('boolean'):
            type = 'enum'
            break
          case ('int'):
            type = 'range'
            break
        }
        return [{
          type,
          properties: {
            data_type: filter.dataType,
            dc_id: filter.columnId,
            display_name: filter.columnName,
            ...((filter.dataType === 'string' || filter.dataType === 'boolean')  && {
              datavalues: filter.dataValues,
              display_datavalues: filter.dataValues
            }),
            ...(filter.dataType === 'int' && {
              start: filter.start,
              end: filter.end
            })
          }
        }]
      })
    }
  },
  watch: {
    // 當Dashboard的fitler變動時，由元件內部去重新問問題
    // 再把新的question, questionId, result,key_result,questionId傳出去更新外部components資訊
    filters: {
      immediate: false,
      deep: false,
      handler (filters) {
        
        // 判斷是否需要重做 result
        if (!this.shouldComponentBeFiltered()) return

        this.$store.dispatch('chatBot/askQuestion', {
          question: this.componentData.config.question,
          dataSourceId: this.componentData.dataSourceId,
          dataFrameId: this.componentData.dataFrameId,
          previewQuestionId: this.componentData.questionId,
          shouldCancelToken: false
        }).then(response => {
          let questionId = response.questionId
          let segmentationList = response.segmentationList

          if (segmentationList.length === 1) {
            this.$store.dispatch('chatBot/askResult', {
              questionId,
              segmentation: segmentationList[0],
              restrictions: this.restrictions,
              selectedColumnList: null
            }).then(res => {
              this.getComponentV2(res.resultId)
            }).catch(error => {
              console.log(error)
            })
          }
          // TODO 無結果和多個結果
        }).catch(error => {
          console.log(this.componentData.config.question)
          console.log(error)
        })
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
              // console.log('最後一哩路')
              this.$emit('restricted', {
                componentId: this.componentData.id,
                questionId: componentResponse.questionId,
                resultId: componentResponse.id,
                keyResultId: componentResponse.componentIds.key_result[0]
              })
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              break
          }
        }).catch((error) => {})
    },
    shouldComponentBeFiltered () {
      // console.log('shouldComponentBeFiltered')
      // 判斷元件是否需要因應 filter 異動而重做
      let filterColumnIds = this.filters.reduce((acc, cur) => acc.concat(cur.columnId), [])
      // console.log(filterColumnIds)
      let componentColumnIds = this.componentData.dataColumns.reduce((acc, cur) => acc.concat(cur.columnId), [])
      // console.log(componentColumnIds)
      let shouldComponentBeFiltered = false
      shouldComponentBeFiltered = filterColumnIds.some(filter => componentColumnIds.includes(filter))
      // console.log('shouldComponentBeFiltered', shouldComponentBeFiltered)
      return shouldComponentBeFiltered
    }
  }
}
</script>
