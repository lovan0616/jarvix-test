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
          <div class="setting-block__title">{{ $t('alert.sourceSetting') }}</div>
          <div class="input-field">
            <label class="input-field__label">{{ $t('miniApp.dataSource') }}</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                :option-list="dataSourceOptionList"
                :placeholder="$t('miniApp.chooseDataSource')"
                :is-disabled="isProcessing"
                v-model="tempConditionSetting.dataSourceId"
                class="input-field__select"
                name="dataSourceId"
                @change="fetchDataFrameList"
              />
              <div 
                v-show="errors.has('dataSourceId')"
                class="error-text"
              >{{ errors.first('dataSourceId') }}</div>
            </div>
          </div>
          <div class="input-field">
            <label class="input-field__label">{{ $t('miniApp.dataFrame') }}</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                :option-list="dataFrameOptionList"
                :placeholder="$t('miniApp.chooseDataFrame')"
                :is-disabled="isLoadingDataFrameList"
                v-model="newConditionSetting.dataFrameId"
                class="input-field__select"
                name="dataFrameId"
                @change="fetchDataColumnList"
              />
              <div 
                v-show="errors.has('dataFrameId')"
                class="error-text"
              >{{ errors.first('dataFrameId') }}</div>
            </div>
          </div>
          <div class="input-field">
            <label class="input-field__label">{{ $t('alert.dataColumn') }}</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                :option-list="dataColumnNumericOptionList"
                :is-disabled="isLoadingDataColumnList"
                v-model="newConditionSetting.targetConfig.dataColumnId"
                :placeholder="$t('alert.selectDataColumn')"
                class="input-field__select"
                name="dataColumnId"
                @change="onSelectDataColumn"
              />
              <div 
                v-show="errors.has('dataColumnId')"
                class="error-text"
              >{{ errors.first('dataColumnId') }}</div>
            </div>
          </div>
        </div>
        <!-- Condition Comparing Values -->
        <div class="setting-block">
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
            :prop-param-options="dataColumnAllOptionList"
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
            :disabled="isProcessing"
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
import SingleComparingValueCard from './SingleComparingValueCard'
import AlertConditionMessageEditor from './AlertConditionMessageEditor'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { 
  getDataFrameById, 
  getDataFrameColumnInfoById
} from '@/API/DataSource'
import {
  postAlertCondition
} from '@/API/Alert'

export default {
  name: 'CreateAlertConditionDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock,
    SingleComparingValueCard,
    AlertConditionMessageEditor
  },
  data () {
    return {
      // 後端儲存用
      newConditionSetting: {
        name: '',
        dataFrameId: null,
        targetConfig: {
          dataColumnId: null,
          dataType: 'INT',
          displayName: '',
          statsType: 'NUMERIC'
        },
        comparingValues: [
          {
            comparisonOperator: null,
            dataType: 'INT',
            value: ''
          }
        ],
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
      dataColumnAllOptionList: [],
      isLoadingDataFrameList: false,
      isLoadingDataColumnList: false,
      isProcessing: false,
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
    dataSourceOptionList () {
      return this.dataSourceList.reduce((acc, cur) => {
        if (cur.state !== 'ENABLE' || cur.enableDataFrameCount < 1) return acc
        acc.push({ name: cur.name, value: cur.id })
        return acc
      }, [])
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
    dataColumnNumericOptionList () {
      return this.dataColumnAllOptionList.filter(item => {
        // 這版本示警只做針對數值型欄位做監控
        return item.statsType === 'NUMERIC'
      })
    }
  },
  methods: {
    fetchDataFrameList (dataSourceId) {
      this.isLoadingDataFrameList = true

      // 清空原資料
      this.dataFrameOptionList = []
      this.dataColumnAllOptionList = []
      this.newConditionSetting.dataFrameId = null
      this.newConditionSetting.targetConfig.dataColumnId = null

      getDataFrameById(this.tempConditionSetting.dataSourceId, ['Enable'])
        .then(response => {
          this.dataFrameOptionList = response.map(dataFrame => ({
            name: dataFrame.primaryAlias,
            value: dataFrame.id
          }))
        })
        .finally(() => this.isLoadingDataFrameList = false)
    },
    fetchDataColumnList (dataFrameId) {
      this.isLoadingDataColumnList = true

      // 清空原資料
      this.dataColumnAllOptionList = []
      this.newConditionSetting.targetConfig.dataColumnId = null

      const hasFeatureColumn = true
      // 過濾掉分群欄位
      const hasBlockClustering = false
      getDataFrameColumnInfoById(dataFrameId, hasFeatureColumn, false, hasBlockClustering).then(response => {
        this.dataColumnAllOptionList = response.reduce((acc, cur) => {
          acc.push({
            name: `${cur.primaryAlias || cur.name}（${cur.statsType}）`,
            value: cur.id,
            originalName: cur.primaryAlias  || cur.name,
            statsType: cur.statsType
          })
          return acc
        }, [])
      })
      .finally(() => this.isLoadingDataColumnList = false)
    },
    onSelectDataColumn () {
      // 補上送到後端所需的欄位名稱
      const column = this.dataColumnAllOptionList.find(item => item.value === this.newConditionSetting.targetConfig.dataColumnId)
      this.newConditionSetting.targetConfig.displayName = column.originalName
    },
    onAlertMessageProcessFinished () {
      this.isProcessing = false
      this.$emit('created')
    },
    createAlertCondition () {
      this.$validator.validateAll().then(async (isValid) => {
        if (!isValid) return

        this.isProcessing = true
        try {
          // 創造示警條件
          this.conditionId = await postAlertCondition(this.newConditionSetting)
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