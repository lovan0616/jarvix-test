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
      <div 
        v-else 
        class="component-setting-box"
        @click="$emit('redirect', componentData.relatedDashboard.id)"
      >
        <div v-if="componentData.relatedDashboard.id">
          <svg-icon icon-class="relation"/>
        </div>
      </div>
    </span>
    <task
      :key="keyResultId"
      :component-id="keyResultId"
      intend="key_result"
    />
    <div 
      v-if="componentData.relatedDashboard.id && isEditMode" 
      class="item-action">
      <!-- TODO 套用樣式 -->
      <div class="tag">
        <div>{{ $t('miniApp.relatedDashboard') }}：{{ componentData.relatedDashboard.name }}</div>
        <div 
          class="close-box" 
          @click="isShowConfirmDelete = true">
          <svg-icon icon-class="close"/>
        </div>
      </div>
    </div>
    <decide-dialog
      v-if="isShowConfirmDelete"
      :title="$t('miniApp.confirmDeletingComponentRelation', { name: componentData.relatedDashboard.name })"
      :type="'delete'"
      @closeDialog="isShowConfirmDelete = false"
      @confirmBtn="confirmDelete"
    />
  </div>
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'

export default {
  name: 'DashboardTask',
  components: {
    DecideDialog
  },
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
      periodSec: 0,
      isShowConfirmDelete: false
    }
  },
  computed: {
    // 到時候傳進來的會直接 format 好這邊就不用再做
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
    },
    shouldComponentBeFiltered () {
      // 判斷元件是否需要因應 filter 異動而重做
      let filterColumnIds = this.filters.reduce((acc, cur) => acc.concat(cur.columnId), [])
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
      deep: false,
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
    confirmDelete () {
      this.isShowConfirmDelete = false
      this.$emit('deleteComponentRelation', this.componentData.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin dropdown-select-controller {
  &:hover {
    .dropdown-select { visibility: visible; }
  }
}
.component-item {
  width: calc(50% - 8px);
  float: left;
  padding: 16px;
  background-color: #192323;
  border-radius: 5px;
  margin-bottom: 16px;
  &:nth-child(odd) {
    margin-right: 16px;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-title {
      color: #DDD;
      @include text-hidden;
    }
    .component-setting-box {
      position: relative;
      color: $theme-color-primary;
      flex: 0 0 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: .2s all ease;
      cursor: pointer;
      @include dropdown-select-controller;
      &:hover {
        background-color: $theme-color-primary;
        color: #FFF;
        border-radius: 4px;
      }
      .dropdown-select {
        z-index: 1;
        /deep/ .dropdown-select-box {
          box-shadow: 0px 2px 5px rgba(34, 117, 125, 0.5);
          top: 31px;
          right: -28px;
          .svg-icon {
            color: $theme-color-primary;
          }
          .dropdown-flex {
            min-width: unset;
          }
        }
      }
    }
  }
  // TODO 套用樣式
  .item-action {
    .tag {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .close-box {
        cursor: pointer;
      }
    }
  }
  .task {
    width: 100%;
  }
}

</style>