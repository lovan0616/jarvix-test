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
      :key="keyResultId"
      :component-id="keyResultId"
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
    // 到時候傳進來的會直接 format 好這邊就不用再做
    restrictions () {
      return this.filters
        .filter(filter => filter.dataValues.length > 0)
        .map(filter => {
          let type = ''
          switch (filter.statsType) {
            case ('STRING'):
            case ('BOOLEAN'):
            case ('CATEGORY'):
              type = 'enum'
              break
            case ('NUMERIC'):
              type = 'range'
              break
          }
          let data_type = ''
          switch (filter.statsType) {
            case ('STRING'):
            case ('BOOLEAN'):
            case ('CATEGORY'):
              data_type = 'string'
              break
            case ('FLOAT'):
            case ('NUMERIC'):
              data_type = 'int'
              break
          }
          return [{
            type,
            properties: {
              data_type,
              dc_id: filter.columnId,
              display_name: filter.columnName,
              ...((filter.statsType === 'STRING' || filter.statsType === 'BOOLEAN' || filter.statsType === 'CATEGORY')  && {
                datavalues: filter.dataValues,
                display_datavalues: filter.dataValues
              }),
              ...(filter.statsType === 'NUMERIC' && {
                start: filter.start,
                end: filter.end
              })
            }
          }]
        })
    },
    shouldComponentBeFiltered () {
      // 判斷元件是否需要因應 filter 異動而重做
      let filterColumnIds = this.filters
        .filter(filter => filter.dataValues.length > 0)
        .reduce((acc, cur) => acc.concat(cur.columnId), [])
      let componentColumnIds = this.componentData.dataColumns.reduce((acc, cur) => acc.concat(cur.columnId), [])
      return filterColumnIds.some(filter => componentColumnIds.includes(filter))
    },
    keyResultId () {
      return this.componentData.restrictedResultInfo.keyResultId || this.componentData.keyResultId
    }
  },
  watch: {
    // 當 Dashboard的 fitler 變動時，由元件內部去重新問問題
    filters: {
      immediate: false,
      deep: true,
      handler (filters) {

        // 判斷 component 是否有相關欄位而需要重做 result
        if (!this.shouldComponentBeFiltered) return

        this.$store.commit('dataSource/setDataFrameId', this.componentData.dataFrameId)
        this.$store.commit('dataSource/setDataSourceId', this.componentData.dataSourceId)

        this.$store.dispatch('chatBot/askQuestion', {
          question: this.componentData.config.question,
          dataSourceId: this.componentData.dataSourceId,
          dataFrameId: this.componentData.dataFrameId,
          previewQuestionId: this.componentData.questionId,
          shouldCancelToken: false
        }).then(response => {
          let questionId = response.questionId
          let segmentationList = response.segmentationList

          // TODO 處理 NO_ANSWER
          if (segmentationList.length === 1) {
            this.$store.dispatch('chatBot/askResult', {
              questionId,
              segmentation: segmentationList[0],
              restrictions: this.restrictions,
              selectedColumnList: null
            }).then(res => {
              this.getComponentV2(res.resultId)
            }).catch(error => {})
          }
          // TODO 無結果和多個結果
        }).catch(error => {})
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
  }
}
</script>
