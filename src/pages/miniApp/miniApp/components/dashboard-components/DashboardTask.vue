<template>
  <div class="component__item">
    <span class="component__item-header">
      <el-tooltip 
        :content="componentData.config.diaplayedName" 
        placement="bottom">
        <span 
          class="item-title" 
          v-html="dashboardTaskTitle" />
      </el-tooltip>
      <div
        v-if="isEditMode"
        class="component-setting-box">
        <svg-icon 
          icon-class="more"
          class="more-icon" />
        <slot name="drowdown"/>
      </div>
      <slot 
        v-if="!isEditMode" 
        name="icon"/>
      <div 
        v-else-if="componentData.relatedDashboard.id" 
        class="component-setting-box"
      >
        <el-tooltip 
          :content="componentData.relatedDashboard.name" 
          placement="bottom">
          <div @click="$emit('redirect', componentData.relatedDashboard.id)">
            <svg-icon icon-class="relation"/>
          </div>
        </el-tooltip>
      </div>
    </span>
    <div
      v-if="componentData.type === 'index'" 
      class="item-content index">
      <div class="index-data">
        <spinner v-if="isProcessing"/>
        <template v-else>
          <task
            :class="{ 'not-empty': !isEmptyData }"
            :custom-chart-style="indexComponentStyle"
            :key="'index-' + keyResultId"
            :component-id="keyResultId"
            :converted-type="'index_info'"
            intend="key_result"
            @isEmpty="isEmptyData = true"
          />
          <span 
            v-if="!isEmptyData" 
            class="index-unit">{{ componentData.indexInfo.unit }}</span>
        </template>
      </div>
    </div>
    <monitor-warning-list v-else-if="componentData.type === 'monitor-warning-list'" />
    <div
      v-else-if="componentData.type === 'text'" 
      class="item-content text">
      <spinner v-if="isProcessing"/>
      <template v-else>
        <task
          :class="{ 'not-empty': !isEmptyData }"
          :custom-chart-style="textComponentStyle"
          :key="'text-' + keyResultId"
          :component-id="keyResultId"
          :converted-type="'text_info'"
          intend="key_result"
          @isEmpty="isEmptyData = true"
        />
        <span 
          v-if="!isEmptyData" 
          class="index-unit">{{ componentData.indexInfo.unit }}</span>
      </template>
    </div>
    <div 
      v-else
      class="item-content chart">
      <spinner v-if="isProcessing"/>
      <task
        v-else
        :custom-chart-style="chartComponentStyle"
        :key="'chart' + keyResultId"
        :component-id="keyResultId"
        :is-show-description="false"
        :is-show-coefficients="false"
        :show-toolbox="false"
        intend="key_result"
      />
    </div>
    <div 
      v-if="componentData.relatedDashboard.id && isEditMode" 
      class="component__item-content">
      <div class="related-item">
        <div class="related-item__title">
          {{ $t('miniApp.relatedDashboard') }}：
        </div>
        <div class="related-item__name">
          {{ componentData.relatedDashboard.name }}
        </div>
        <div 
          class="related-item__close" 
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
import MonitorWarningList from './MonitorWarningList'
import moment from 'moment'

export default {
  name: 'DashboardTask',
  components: {
    DecideDialog,
    MonitorWarningList
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
    yAxisControls: {
      type: Array,
      default: () => {}
    },
    controls: {
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
      isShowConfirmDelete: false,
      autoRefreshFunction: null,
      isEmptyData: false,
      indexComponentStyle: {
        'font-size': '64px', 
        'height': '69px', 
        'line-height': '64px', 
        'color': '#2AD2E2'
      },
      textComponentStyle: {
        'font-size': '20px',
        'color': '#DDDDDD',
        'text-align': 'center'
      },
      chartComponentStyle: {
        'width': '100%',
        'height': '260px'
      },
      isProcessing: false
    }
  },
  computed: {
    restrictions () {
      return this.allFilterList
        .filter(filter => {
          if (filter.statsType === 'NUMERIC') return filter.start && filter.end
          // 相對時間有全選的情境，不需帶入限制中
          if (filter.statsType === 'RELATIVEDATETIME') return filter.dataValues[0] !== 'unset'
          if (
            filter.statsType === 'NUMERIC'
            || filter.statsType === 'FLOAT'
            || filter.statsType === 'DATETIME'
          ) return filter.start && filter.end
          return filter.dataValues.length > 0
        })
        .map(filter => {

          let type = ''
          let data_type = ''
          switch (filter.statsType) {
            case ('STRING'):
            case ('BOOLEAN'):
            case ('CATEGORY'):
              data_type = 'string'
              type = 'enum'
              break
            case ('FLOAT'):
            case ('NUMERIC'):
              data_type = 'int'
              type = 'range'
              break
            case ('DATETIME'):
            case ('RELATIVEDATETIME'):
              data_type = 'datetime'
              type = 'range'
              break  
          }

          // 相對時間 filter 需取當前元件所屬 dataframe 的預設時間欄位和當前時間來套用
          if (filter.statsType === 'RELATIVEDATETIME') return [{
            type,
            properties: {
              data_type,
              dc_id: this.componentData.dateTimeColumn.dataColumnId,
              display_name: this.componentData.dateTimeColumn.dataColumnPrimaryAlias,
              ...this.formatRelativeDatetime(filter.dataValues[0])
            }
          }]

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
              }),
            }
          }]
        })
    },
    shouldComponentBeFiltered () {
      // 有任一filter 與 任一column 來自同 dataFrame，或者 任一filter 與 任一column 的 columnPrimaryAlias 相同
      return this.includeSameColumnPrimaryAliasFilter || this.includeSameDataFrameFilter || this.includeRelativeDatetimeFilter
    },
    shouldComponentYAxisBeControlled () {
      const yAxisControlsDataFrames = this.selectedYAxisControls.reduce((acc, cur) => acc.concat(cur.dataFrameId), [])
      return yAxisControlsDataFrames.includes(this.componentData.dataFrameId)
    },
    keyResultId () {
      return this.componentData.tempResultInfo.keyResultId || this.componentData.keyResultId
    },
    dataColumnAlias () {
      return this.componentData.segmentation.transcript.subjectList[0].dataColumn.dataColumnAlias
    },
    newYAxisColumnNames () {
      return this.selectedYAxisControls.reduce((acc, cur) => acc.concat(` ${cur.columnName}`), '')
    },
    controllerMutatedQuestion () {
      return this.componentData.question.replace(this.dataColumnAlias, this.newYAxisColumnNames)
    },
    controllerMutatedQuestionWithStyleTag () {
      return this.componentData.question.replace(this.dataColumnAlias, `
        <div style="text-decoration: underline; margin-left: 4px; white-space: nowrap; display: flex;">${this.newYAxisColumnNames}<div>
      `)
    },
    dashboardTaskTitle () {
      return this.shouldComponentYAxisBeControlled
        ? this.controllerMutatedQuestionWithStyleTag
        : this.componentData.config.diaplayedName
    },
    allFilterList () {
      return [...this.filters, ...this.controls]
    },
    selectedYAxisControls () {
      return this.yAxisControls.reduce((acc, cur) => {
        // 只有相同 dataFrame 才有作用
        if (cur[0].dataFrameId === this.componentData.dataFrameId) {
          // 找出被選到的 controller
          const option = cur.find(item => item.isSelected)
          return option ? acc.concat(option) : acc
        }
        return acc
      }, [])
    },
    includeSameDataFrameFilter () {
      let filterDataFrameIds = this.allFilterList.reduce((acc, cur) => acc.concat(cur.dataFrameId), [])
      return filterDataFrameIds.includes(this.componentData.dataFrameId)
    },
    includeSameColumnPrimaryAliasFilter () {
      let filterDataColumnNames = this.allFilterList.reduce((acc, cur) => acc.concat(cur.columnName), [])
      const componentColumns = this.componentData.dataColumns
      for (let i = 0; i < componentColumns.length; i++) {
        if (filterDataColumnNames.includes(componentColumns[i].columnName)) return true
        return false
      }
    },
    includeRelativeDatetimeFilter () {
      return this.allFilterList.some(filter => filter.statsType === 'RELATIVEDATETIME')
    }
  },
  watch: {
    // 當 Dashboard的 fitler 變動時，由元件內部去重新問問題
    allFilterList: {
      immediate: false,
      deep: true,
      handler () {
        if (!this.shouldComponentBeFiltered) return
        this.askQuestion()
      }
    },
    selectedYAxisControls: {
      immediate: true,
      deep: true,
      handler () {
        if (!this.shouldComponentYAxisBeControlled) return
        this.askQuestion(this.controllerMutatedQuestion)
      }
    }
  },
  mounted () {
    if(this.componentData.config.isAutoRefresh && !this.isEditMode) this.setComponentRefresh()
  },
  destroyed () {
    if (this.autoRefreshFunction) window.clearTimeout(this.autoRefreshFunction)
  },
  methods: {
    askQuestion (question = this.componentData.question) {
      window.clearTimeout(this.timeoutFunction)
      this.isProcessing = true
      this.$store.commit('dataSource/setDataFrameId', this.componentData.dataFrameId)
      this.$store.commit('dataSource/setDataSourceId', this.componentData.dataSourceId)
      this.isEmptyData = false
      this.$store.dispatch('chatBot/askQuestion', {
        question,
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
      }).catch(error => { this.isProcessing = false })
    },
    getComponentV2 (resultId) {
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
              this.componentData.tempResultInfo = {
                questionId: componentResponse.questionId,
                resultId: componentResponse.id,
                keyResultId: componentResponse.componentIds.key_result[0]
              }
              this.isProcessing = false
              // 定期更新 component 資料
              if(this.componentData.config.isAutoRefresh && !this.isEditMode) this.setComponentRefresh()
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              this.isProcessing = false
              break
          }
        }).catch((error) => {
          this.isProcessing = false
          window.clearTimeout(this.autoRefreshFunction)
        })
    },
    confirmDelete () {
      this.isShowConfirmDelete = false
      this.$emit('deleteComponentRelation', this.componentData.id)
    },
    setComponentRefresh () {
      this.autoRefreshFunction = window.setTimeout(() => {
        this.askQuestion()
      }, this.convertRefreshFrequency(this.componentData.config.refreshFrequency))
    },
    convertRefreshFrequency (cronTab) {
      switch (cronTab) {
        case '* * * * *':
          return 60 * 1000
        case '*/5 * * * *':
          return 5 * 60 * 1000
        case '*/15 * * * *':
          return 15 * 60 * 1000
        case '*/30 * * * *':
          return 30 * 60 * 1000
        case '*/45 * * * *':
          return 45 * 60 * 1000
        case '0 * * * *':
          return 60 * 60 * 1000
        case '0 0 * * *':
          return 24 * 60 * 60 * 1000
        case '0 0 * * 0':
          return 7 * 24 * 60 * 1000
        case '0 0 1 * *':
          return 30 * 7 * 24 * 60 * 1000
      }
    },
    formatRelativeDatetime (dataValue) {
      const properties = {
        start: null,
        end: null
      }
      
      // update datetime range
      if (dataValue === 'today') {
        properties.start = moment().startOf('day').format('YYYY-MM-DD HH:mm')
        properties.end = moment().endOf('day').format('YYYY-MM-DD HH:mm')
      } else if (RegExp('^.*hour.*$').test(dataValue)) {
        const hour = Number(dataValue.split('hour')[0])
        properties.start = moment().subtract(hour, 'hours').format('YYYY-MM-DD HH:mm')
        properties.end = moment().format('YYYY-MM-DD HH:mm')
      } else {
        properties.start = null
        properties.end = null
      }

      return properties
    },
  }
}
</script>

<style lang="scss" scoped>
@mixin dropdown-select-controller {
  &:hover {
    .dropdown-select { visibility: visible; }
  }
}

.component__item {
  width: calc(50% - 8px);
  float: left;
  padding: 16px;
  background-color: #192323;
  border-radius: 5px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  height: 338px;
  &:nth-child(odd) {
    margin-right: 16px;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .item-title {
      color: #DDD;
      @include text-hidden;
      display: flex;
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
  &-content {
    .spinner-block {
      height: 420px;
    }
  }
  &-action {
    .related-item {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.2);
      &__title {
        font-weight: bold;
      }
      &__close {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #A7A7A7;
        margin-left: 6px;
        cursor: pointer;
        .svg-icon {
          width: 4px;
        }
      }
    }
  }

  .item-content {
    height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    &.index {
      /deep/ .not-empty {
        width: auto;
        max-width: 100%;
      }
      .index-unit {
        font-weight: 600;
        font-size: 36px;
        color: #2AD2E2;
      }
      .index-data {
        display: flex;
        align-items: flex-end;
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }

  .task {
    width: 100%;
  }
}

</style>