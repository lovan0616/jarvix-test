<template>
  <div class="create-alert-condition-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('alert.createAlertCondition') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="$emit('close')"
        ><svg-icon icon-class="close"/></a>
      </div>
      <template>
        <!-- Condition Name -->
        <div class="setting-block">
          <div class="setting-block__title">
            {{ $t('alert.alertName') }}
          </div>
          <div class="input-field">
            <div class="input-field__input">
              <input-block
                v-validate="`required|max:${max}`"
                v-model="newConditionSetting.name"
                :placeholder="$t('miniApp.pleaseEnterName')"
                name="conditionName"
              />
            </div>
          </div>
        </div>
        <!-- Condition Target -->
        <div class="setting-block">
          <div class="setting-block__title">{{ $t('alert.originalDataSource') }}</div>
          <div class="data-source">
            <div class="data-source__title">{{ $t('alert.dataSource') }}</div>       
            <div class="data-source__content">{{ currentDataSource.name }}</div>
          </div>
          <div class="data-source">
            <div class="data-source__title">{{ $t('alert.dataFrame') }}</div>
            <spinner
              v-if="isFetchingDataFrame"
              class="setting-block__spinner"
              size="20"
            /> 
            <div 
              v-else 
              class="data-source__content">{{ currentDataFrame.primaryAlias }}</div>
          </div>
          <div
            v-if="componentType === 'formula'"
            class="data-source"
          >
            <div class="data-source__title">{{ $t('alert.expression') }}</div>
            <spinner
              v-if="isFetchingFormulas"
              class="setting-block__spinner"
              size="20"
            /> 
            <div 
              v-else 
              class="data-source__content">{{ currentFormula.name }}</div>
          </div>
        </div>
        <!--示警指標-->
        <div class="setting-block">
          <div class="setting-block__title">{{ $t('alert.alertIndicator') }}</div>
          <spinner
            v-if="isFetchingIndocators"
            class="setting-block__spinner"
            size="20"
          />        
          <div
            v-for="(indicator, index) in indicators"
            v-else
            :key="index"
            class="input-radio-group"
          >
            <input
              :id="indicator.text"
              :value="indicator.text"
              :checked="indicator.type === newConditionSetting.targetConfig.analysisValueType"
              name="indocator"
              class="input-radio"
              type="radio"
              @change="updateSelectedIndicator(indicator.type)"
            >
            <label
              :for="indicator.text"
              class="input-radio-label"
            >
              {{ `${ indicator.text }` }}
            </label>
          </div>
        </div>
        <!--展開條件-->
        <div
          v-if="componentData.controlList.length > 0"
          class="setting-block"
        >
          <div class="setting-block__title">{{ $t('alert.columnValueCombination') }}</div>
          <div class="select-group select-group--row">
            <label
              v-for="(control, index) in columnValueCombinationOptionList"
              :key="control + '-' + index"
              class="single-select"
            >
              <!--暫時隱藏，待後端修正-->
              <!-- <div class="checkbox-group">
                <div class="checkbox-label">
                  <input
                    v-model="control.isSelected"
                    :checked="control.isSelected"
                    type="checkbox"
                  >
                  <div class="checkbox-square"/>
                </div>
              </div> -->
              <div class="label-content">
                <div class="label-title">{{ control.columnName }}</div>
              </div>
            </label>
          </div>
        </div>
        <!--資料過濾條件-->
        <div
          v-if="filterOptionList.length > 0"
          class="setting-block"
        >
          <div class="setting-block__title">{{ $t('alert.dataFilterCondition') }}</div>
          <div class="select-group select-group--column">
            <label
              v-for="(filter, index) in filterOptionList"
              :key="filter + '-' + index"
              class="single-select"
            >
              <!--暫時隱藏，待後端修正-->
              <!-- <div class="checkbox-group">
                <div class="checkbox-label">
                  <input
                    v-model="filter.isSelected"
                    :checked="filter.isSelected"
                    type="checkbox"
                  >
                  <div class="checkbox-square"/>
                </div>
              </div> -->
              <div class="label-content">
                <div class="label-title">{{ filter.columnName }}</div>
                <div class="label-description">{{ filter.targetValues }}</div>
              </div>
            </label>
          </div>
        </div>
        <!-- Condition Comparing Values -->
        <div
          v-if="showConditionComapringSection"
          class="setting-block"
        >
          <div class="setting-block__title">{{ $t('alert.conditionSetting') }}</div>
          <single-comparing-value-card
            v-for="(comparingSet, index) in newConditionSetting.comparingValues"
            :key="index"
            :comparing-set="newConditionSetting.comparingValues[index]"
            :comparison-operator-option-list="comparisonOperatorOptionList"
          />
        </div>
        <!-- Condition Message Settings -->
        <div class="setting-block">
          <div class="setting-block__title">{{ $t('alert.conditionMessageSetting') }}</div>
          <alert-condition-message-editor
            :condition-id="conditionId"
            :prop-param-options="paramsOptionList"
            :is-manual-set-prop-options="true"
            @done="onAlertMessageProcessFinished"
          />
        </div>
        <div class="button__block">
          <button
            :disabled="isProcessing"
            class="btn btn-outline"
            @click="$emit('close')"
          >{{ $t('button.cancel') }}</button>
          <button 
            :disabled="!isSaveable"
            class="btn btn-default"
            @click="createAlertCondition"
          >{{ $t('button.save') }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import InputBlock from '@/components/InputBlock'
import SingleComparingValueCard from '../components/warning-module/SingleComparingValueCard'
import AlertConditionMessageEditor from '../components/warning-module/AlertConditionMessageEditor'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { getDataFrameById } from '@/API/DataSource'
import {
  getComponentIndicators,
  convertComponentToAlertCondition
} from '@/API/Alert'
import { getFormulaList } from '@/API/NewAsk'

export default {
  name: 'ComponentToAlertConditionDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock,
    SingleComparingValueCard,
    AlertConditionMessageEditor
  },
  props: {
    componentData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentDataFrame: {},
      currentFormula: {},
      indicators: [],
      columnValueCombinationOptionList: [],
      filterOptionList: [],
      // 後端儲存用
      newConditionSetting: {
        comparingValues: [
          {
            comparisonOperator: null,
            dataType: 'INT',
            value: ''
          }
        ],
        componentId: null,
        dataFrameId: null,
        name: '',
        targetConfig: {
          analysisValueType: null,
          combinationColumns: [],
          componentHashKey: null,
          restrictions: []
        },
        triggerEvent: 'DATA_CHANGE'
      },
      // 變更示警訊息中 要動態呈現實際值的欄位陣列
      messageParams: [],
      // 前端畫面暫存
      tempConditionSetting: {
        dataSourceId: null,
      },
      conditionId: null,
      isPatchingConditionMessage: false,
      dataFrameOptionList: [],
      isProcessing: false,
      isFetchingDataFrame: false,
      isFetchingIndocators: false,
      isFetchingFormulas: false,
      xAxis: [],
      hasError: false
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
    dataSourceOptionList () {
      return this.dataSourceList.reduce((acc, cur) => {
        if (cur.state !== 'ENABLE' || cur.enableDataFrameCount < 1) return acc
        acc.push({ name: cur.name, id: cur.id })
        return acc
      }, [])
    },
    currentDataSource () {
      const currentDataSourceId = this.componentType === 'formula' ? this.componentData.formulaSetting.dataSourceId : this.componentData.dataSourceId
      return this.dataSourceOptionList.find(dataSource => dataSource.id === currentDataSourceId)
    },
    currentDataFrameId () {
     return this.componentType === 'formula' ? this.componentData.formulaSetting.dataFrameId : this.componentData.dataFrameId
    },
    comparisonOperatorOptionList () {
      return [
        { value: 'GREATER_THAN',             name: this.$t('comparisonOperator.GREATER_THAN') },
        { value: 'GREATER_THAN_OR_EQUAL_TO', name: this.$t('comparisonOperator.GREATER_THAN_OR_EQUAL_TO') },
        { value: 'LESS_THAN',                name: this.$t('comparisonOperator.LESS_THAN') },
        { value: 'LESS_THAN_OR_EQUAL_TO',    name: this.$t('comparisonOperator.LESS_THAN_OR_EQUAL_TO') },
        { value: 'EQUAL',                    name: this.$t('comparisonOperator.EQUAL') },
        { value: 'NOT_EQUAL',                name: this.$t('comparisonOperator.NOT_EQUAL') },
      ]
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    paramsOptionList () {
      // 指標
      const selectedIndicator = this.indicators
        .filter(indicator => indicator.type === this.newConditionSetting.targetConfig.analysisValueType)
        .map(indicator => ({ 
          type: 'indicator',
          value: indicator.type,
          name: indicator.text,
          originalName: indicator.text
        }))

      // 展開條件
      const selectedColumnValueCombinations = this.columnValueCombinationOptionList
        .filter(option => option.isSelected)
        .map(column => ({
          type: 'column',
          name: `${column.columnName}`,
          value: column.columnId,
          originalName: column.columnName
        }))

      // 如果選離群值，須將圖表 x 軸資訊加入參數列表
      const xAxisColumns = []
      if (this.newConditionSetting.targetConfig.analysisValueType === 'OUTLIER_VALUE') {
        this.componentData.chartInfo.xAxis.forEach(column => {
          xAxisColumns.push({
            type: 'column',
            name: `${column.display_name}`,
            value: column.dc_id,
            originalName: column.display_name
          })
        })
      }
      return [...selectedIndicator, ...selectedColumnValueCombinations, ...xAxisColumns]
    },
    showConditionComapringSection () {
      return this.newConditionSetting.targetConfig.analysisValueType && this.newConditionSetting.targetConfig.analysisValueType !== 'OUTLIER_VALUE'
    },
    isSaveable () {
      return !this.isProcessing && !this.isFetchingDataFrame && !this.isFetchingIndocators && !this.hasError
    },
    componentType () {
      return this.componentData.type
    }
  },
  mounted () {false
    this.fetchDataFrameList(this.currentDataSource.id)
    this.componentType === 'formula' && this.fetchFormulaList()
    this.getComponentIndicators(this.componentData.keyResultId)
    this.columnValueCombinationOptionList = this.componentData.controlList.reduce((acc, cur) => {
      // 暫時預設全選，待後端修正
      acc.push(...cur.map(control => ({ ...control, isSelected: true })))
      return acc
    }, [])
    this.configFilterOptionList()
  },
  methods: {
    configFilterOptionList() {
      this.filterOptionList = this.componentData.filterList.reduce((acc, cur) => {
        const validFilterList = []
        // 確認 filter 是否有使用者的給定值
        cur.forEach(filter => this.checkIsValidFilter(filter) && validFilterList.push(filter))
        validFilterList.forEach(filter => {
          acc.push({ 
            ...filter,
            // 暫時預設全選，待後端修正
            isSelected: true,
            targetValues: this.transformFilterValue(filter)
          })
        })
        return acc
      }, [])
    },
    checkIsValidFilter (filter) {
      switch (filter.statsType) {
        case 'CATEGORY': 
          return filter.dataValues.length > 0
        case 'BOOLEAN':
          return filter.dataValues.length > 0
        case 'NUMERIC':
          return filter.start && filter.end
        case ('DATETIME'):
          return filter.start && filter.end
        case ('RELATIVEDATETIME'): 
          return filter.dataValues.length > 0 && filter.dataValues[0] !== 'unset'
        default: 
          return false
      }
    },
    transformFilterValue (filter) {
      switch (filter.statsType) {
        case 'CATEGORY': 
          return filter.dataValues.join(', ')
        case 'BOOLEAN':
          return filter.dataValues.join(', ')
        case 'NUMERIC':
          return `${filter.start} - ${filter.end}`
        case ('DATETIME'):
          return `${filter.start} - ${filter.end}`
        case ('RELATIVEDATETIME'): 
          return this.$t('miniApp.' + filter.dataValues[0])
      }
    },
    fetchDataFrameList (dataSourceId) {
      this.isFetchingDataFrame = true
      getDataFrameById(dataSourceId, false)
        .then(response => this.currentDataFrame = response.find(dataFrame => dataFrame.id === this.currentDataFrameId))
        .catch(() => this.hasError = true)
        .finally(() => this.isFetchingDataFrame = false)
    },
    getComponentIndicators (componentId) {
      this.isFetchingIndocators = true
      getComponentIndicators(componentId)
        .then(response => {
          this.indicators = response.types
          // 預設為第一個值
          this.newConditionSetting.targetConfig.analysisValueType = response.types[0].type
        })
        .catch(() => this.hasError = true)
        .finally(() => this.isFetchingIndocators = false)
    },
    fetchFormulaList () {
      this.isFetchingFormulas = true
      getFormulaList()
        .then(formulaList => this.currentFormula = formulaList.find(formula => formula.id === this.componentData.formulaSetting.formulaId))
        .catch(() => this.hasError = true)
        .finally(() => this.isFetchingFormulas = false)
    },
    updateSelectedIndicator (type) {
      this.newConditionSetting.targetConfig.analysisValueType = type
    },
    onAlertMessageProcessFinished () {
      this.isProcessing = false
      this.$emit('converted')
    },
    createAlertCondition () {
      this.$validator.validateAll().then(async (isValid) => {
        if (!isValid) return

        this.isProcessing = true
        try {
          const settingData = {
            ...this.newConditionSetting,
            componentId: this.componentData.keyResultId,
            dataFrameId: this.currentDataFrameId,
          }
          // 展開條件
          settingData.targetConfig.combinationColumns = this.columnValueCombinationOptionList
            .filter(combination => combination.isSelected)
            .map(column => ({
              dataColumnId: column.columnId,
              dataType: column.dataType,
              displayName: column.columnName,
              statsType: column.statsType
            }))

          // 分類和處理資料過濾條件
          const initialFilterLists = {
            general: [],
            relativeDateTime: []
          }
          const selectedFilterLists = this.filterOptionList.reduce((acc, cur) => {
            if (!cur.isSelected) return acc
            const category = cur.statsType === 'RELATIVEDATETIME' ? 'relativeDateTime' : 'general'
            acc[category].push(cur)
            return acc
          }, initialFilterLists)

          // 資料過濾條件: 一般 filter
          settingData.targetConfig.restrictions = this.restrictions(selectedFilterLists.general)

          // 資料過濾條件: 相對時間 filter
          settingData.targetConfig.dateRangeColumn = this.formatRelatvieDateTimeFilter(selectedFilterLists.relativeDateTime[0])
          
          // 指標如果選定離群值，不帶條件設定
          if (!this.showConditionComapringSection) settingData.comparingValues = null

          this.conditionId = await convertComponentToAlertCondition(settingData)
          this.$emit('update', this.conditionId)

          Message({
            message: this.$t('alert.alertConditionSuccessfullyCreated'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        } catch (error) {
          this.$emit('close')
        }
      })
    },
    formatRelatvieDateTimeFilter (filter) {
      if (!filter) return null
      const selectedValue = filter.dataValues[0]
      const filterInfo = {
        dataColumnId: this.componentData.dateTimeColumn.dataColumnId,
        dataType: 'DATETIME',
        displayName: this.componentData.dateTimeColumn.dataColumnPrimaryAlias,
        recentInterval: null,
        recentIntervalUnit: null,
        statsType: 'DATETIME'
      }

      // update datetime range
      switch (true) {
        case RegExp('^.*hour.*$').test(selectedValue):
          filterInfo.recentInterval = Number(selectedValue.split('hour')[0])
          filterInfo.recentIntervalUnit = 'Hour'
          break
        case RegExp('^today$').test(selectedValue): 
          filterInfo.recentInterval = 0
          filterInfo.recentIntervalUnit = 'Day'
          break
        case RegExp('^.*day.*$').test(selectedValue): 
          filterInfo.recentInterval = Number(selectedValue.split('day')[0])
          filterInfo.recentIntervalUnit = 'Day'
          break
        case RegExp('^.*week.*$').test(selectedValue):
          filterInfo.recentInterval = Number(selectedValue.split('week')[0])
          filterInfo.recentIntervalUnit = 'Week'
          break
        case RegExp('^.*month.*$').test(selectedValue):
          filterInfo.recentInterval = Number(selectedValue.split('month')[0])
          filterInfo.recentIntervalUnit = 'Month'
          break
        case RegExp('^.*season.*$').test(selectedValue):
          filterInfo.recentInterval = Number(selectedValue.split('season')[0])
          filterInfo.recentIntervalUnit = 'Season'
          break
      }

      return filterInfo
    },
    restrictions (filterList) {
      if (filterList.length === 0) return []
      return filterList
        .filter(filter => this.checkShouldApplyMiniAppFilter(filter))
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
              ...((filter.statsType === 'NUMERIC' || filter.statsType === 'FLOAT' || filter.statsType === 'DATETIME') && {
                start: filter.start,
                end: filter.end
              }),
            }
          }]
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.create-alert-condition-dialog {
  &.full-page-dialog {
    .dialog-container {
      width: 40%;
      min-width: 652px;
    }
  }

  .setting-block {
    position: relative;
    padding: 24px;
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 12px;

    &__title {
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      margin-bottom: 16px;
    }

    &__spinner {
      margin: 0;
      padding: 0;
    }

    /deep/ .input-field {

      &:not(:last-of-type) {
        margin-bottom: 24px;
      }
      
      &__label {
        font-size: 14px;
        color: #CCCCCC;
      }

      &__select {
        border-bottom: 1px solid #FFF;
      }

      /deep/ .el-input__inner {
        font-size: 14px;
        padding-left: 0;

        &::placeholder {
          color: #AAAAAA;
        }
      }

      /deep/ .el-input {
        &.is-disabled {
          .el-input__inner {
            background-color: transparent;
          }
        }
      }
    }

    /deep/ .input-block {
      // 以下是為與相鄰的 select 樣式一致
      height: 41px;
      font-size: 14px;
      .input {
        height: 100%;
        padding-bottom: 0;
      }
      .error-text {
        bottom: -9px;
      }
    }

    .data-source {
      display: flex;
      &__title {
        width: 100px;
        font-size: 14px;
        color: #FFFFFF;
        font-weight: 600;
      }
      &__content {
        font-size: 14px;
        color: #DDDDDD;
        font-weight: normal;
      }
      &:not(:last-of-type) {
        margin-bottom: 17px;
      }
    }

    .select-group {
      display: flex;
      &--row {
        flex-direction: row;
        .single-select {
          &:not(:last-of-type) {
            margin-right: 88px;
          }
        }
      }
      &--column {
        flex-direction: column;
        .single-select {
          &:not(:last-of-type) {
            margin-bottom: 16px;
          }
        }
      }
    }

    .single-select {
      display: flex;
      .checkbox-group {
        margin-right: 8px;
      }
      .checkbox-label {
        margin-top: 4px;
      }
      .label-title {
        font-size: 14px;
      }
      .label-description {
        font-size: 14px;
        color: #AAAAAA;
      }
    }
  }

  .button {
    &__block {
      display: flex;
      justify-content: flex-end;

      .btn:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
}
</style>