<template>
  <section class="simulator-setting">
    <!--資料原設定-->
    <div class="setting">
      <div class="setting__title">
        {{ $t('miniApp.sourceOfData') }}
      </div>
      <div class="setting__content">
        <div class="input-field">
          <label class="input-field__label">{{ $t('miniApp.dataSource') }}</label>
          <div class="input-field__input-box">
            <default-select 
              v-validate="'required'"
              :option-list="dataSourceOptionList"
              :placeholder="$t('miniApp.chooseDataSource')"
              :is-disabled="isLoading"
              v-model="modelSetting.dataSourceId"
              filterable
              class="input-field__select"
              name="dataSourceId"
              @change="handleDataSourceSelected"
            />
            <div 
              v-show="errors.has('dataSourceId')"
              class="error-text"
            >{{ errors.first('dataSourceId') }}</div>
          </div>
        </div>
        <div class="input-field">
          <label class="input-field__label">{{ $t('miniApp.dataFrame') }}</label>
          <div class="input-field__input-box">
            <default-select 
              v-validate="'required'"
              :option-list="dataFrameOptionList"
              :placeholder="$t('miniApp.chooseDataFrame')"
              :is-disabled="isLoading"
              v-model="modelSetting.dataFrameId"
              filterable
              class="input-field__select"
              name="dataFrameId"
              @change="handleDataFrameSelected"
            />
            <div 
              v-show="errors.has('dataFrameId')"
              class="error-text"
            >{{ errors.first('dataFrameId') }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--模型設定-->
    <div class="setting">
      <div class="setting__title">
        {{ $t('miniApp.modelSetting') }}
      </div>
      <div class="setting__content">
        <div class="input-field">
          <label class="input-field__label">{{ $t('miniApp.operatedModel') }}</label>
          <div class="input-field__input-box">
            <default-select 
              v-validate="'required'"
              :option-list="modelOptionList"
              :placeholder="$t('miniApp.selectModel')"
              :is-disabled="isLoading"
              v-model="modelSetting.modelId"
              filterable
              class="input-field__select"
              name="model"
              @change="updateModelSetting"
            />
            <div 
              v-show="errors.has('model')"
              class="error-text"
            >{{ errors.first('model') }}</div>
          </div>
        </div>
        <template v-if="modelSetting.modelId">
          <div 
            v-if="modelOuptputList.length > 0" 
            class="input-field">
            <label class="input-field__label">{{ $t('miniApp.modelOperatedResult') }}</label>
            <div class="input-field__input-box">
              {{ modelOuptputList | mergeModelOutputList }}
            </div>
          </div>
          <spinner 
            v-else
            size="20"
          />
        </template>
      </div>
    </div>
    <!--Input 設定-->
    <div 
      v-if="modelSetting.dataSourceId && modelSetting.dataFrameId && modelSetting.modelId" 
      class="setting">
      <div class="setting__title">
        {{ $t('miniApp.inputParamSetting') }}
      </div>
      <div class="setting__content list">
        <spinner 
          v-if="isLoading"
          size="20"
        />
        <template v-else>
          <div class="list__header">
            <div class="list__title">{{ $t('miniApp.modelInputParams') }}</div>
            <div class="list__title">{{ $t('miniApp.targetedDataFrameColumn') }}</div>
          </div>
          <div 
            v-for="(input, index) in modelInputList" 
            :key="input + '-' + index" 
            class="list__item">
            <div class="list__item-data">{{ input.modelColumnName + ' (' + input.statsType + ')' }}</div>
            <svg-icon 
              icon-class="go-right" 
              class="icon"/>
            <div class="list__item-data">
              <div class="input-field__input-box">
                <default-select 
                  v-validate="'required'"
                  :option-list="getdDataColumnOptionList(input.statsType)"
                  :placeholder="$t('editing.chooseDataColumn')"
                  :is-disabled="isLoading"
                  v-model="modelSetting.inputList[index].id"
                  :name="index + 'modelInputId'"
                  class="input-field__select"
                  @change="handleModelInputChange(index, $event)"
                />
                <div 
                  v-show="errors.has(index + 'modelInputId')"
                  class="error-text"
                >{{ errors.first(index + 'modelInputId') }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import { 
  getDataFrameById, 
  getDataFrameColumnInfoById,
  getDateTimeColumns
} from '@/API/DataSource'
import {
  getModelInfo,
  getModelList 
} from '@/API/Model'
import { mapGetters } from 'vuex'

export default {
  inject: ['$validator'],
  name: 'SimulatorSetting',
  components: {
    DefaultSelect
  },
  filters: {
    mergeModelOutputList (list) {
      if (!list || list.length === 0) return ''
      return list.map(output => output.modelColumnName).join('、') 
    }
  },
  props: {
    modelSetting: {
      type: Object,
      default: () => ({
        dataSourceId: null,
        dataFrameId: null,
        modelId: null,
        inputList: []
      })
    },
    modelComponentInfo: {
      type: Object,
      default: () => ({
        dateTimeColumn: null
      })
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isFailed: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      isFetchingModelInfo: false,
      dataSourceOptionList: [],
      dataFrameOptionList: [],
      modelOptionList: [],
      modelInputList: [],
      modelOuptputList: [],
      dataColumnOptionList: []
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
  },
  mounted () {
    this.getModelList()
    this.fetchDataSourceList()

    // 重新編輯時才直接取 model 資料
    this.modelSetting.modelId && this.fetchModelInfo(this.modelSetting.modelId)
  },
  methods: {
    fetchDataSourceList () {
      this.$emit('update:isLoading', true)
      this.dataSourceOptionList = this.dataSourceList.reduce((acc, cur) => {
        if (cur.state !== 'ENABLE' || cur.enableDataFrameCount < 1) return acc
        acc.push({
          name: cur.name,
          value: cur.id
        })
        return acc
      }, [])
      // 如果是在編輯模式，自動去取得資料表清單
      this.modelSetting.dataSourceId && this.fetchDataFrameList()
      this.$emit('update:isLoading', false)
    },
    handleDataSourceSelected () {
      this.$emit('update:isLoading', true)
      // 清空原資料
      this.dataColumnOptionList = []
      this.dataFrameOptionList = []
      this.resetInputList()
      this.modelSetting.dataFrameId = null
      this.fetchDataFrameList()
    },
    fetchDataFrameList () {
      this.$emit('update:isLoading', true)
      const isGetAllStatesDataframe = false
      getDataFrameById(this.modelSetting.dataSourceId, isGetAllStatesDataframe)
        .then(response => {
          this.dataFrameOptionList = response.map(dataFrame => ({
            name: dataFrame.primaryAlias,
            value: dataFrame.id
          }))
          // 如果是在編輯模式，自動去取得資料欄位清單
          this.modelSetting.dataFrameId && this.fetchDataColumnList(this.modelSetting.dataFrameId)
        })
        .finally(() => this.$emit('update:isLoading', false))
    },
    handleDataFrameSelected (dataFrameId) {
      // 清空原資料
      this.dataColumnOptionList = []
      this.resetInputList()
      this.fetchDataColumnList(dataFrameId)
      this.setDataTimeColumns (dataFrameId)
    },
    setDataTimeColumns (dataFrameId) {
      getDateTimeColumns(dataFrameId)
        .then(columnList => this.modelComponentInfo.dateTimeColumn = columnList.find(column => column.isDefault))
    },
    fetchDataColumnList (dataFrameId) {
      const hasFeatureColumn = true
      // 過濾掉分群欄位
      const hasBlockClustering = false
      getDataFrameColumnInfoById(dataFrameId, hasFeatureColumn, false, hasBlockClustering).then(response => {
        this.dataColumnOptionList = response.map(column => ({
          ...column,
          name: `${column.primaryAlias || column.name}（${column.statsType}）`,
          value: column.id,
          originalName: column.primaryAlias  || column.name,
          dcId: column.id
        }))
      })
    },
    getModelList () {
      getModelList(this.getCurrentGroupId, 0, 99999)
        .then(modelList => {
          this.modelOptionList = modelList.models.map(model => ({
            ...model,
            value: model.id
          }))
          this.$emit('update:isLoading', false)
        })
    },
    updateModelSetting (selectedId) {
      this.$emit('update:isLoading', true)

      // 如果 input 取得失敗，外層不應該能加元件
      // 取得失敗時，input 設定區塊還不會顯示，因此不會有欄位驗證能擋
      this.$emit('update:isFailed', false)

      // 清空原資料
      this.modelSetting.inputList = []
      this.modelOuptputList = []

      this.fetchModelInfo (selectedId)
    },
    fetchModelInfo (selectedId) {
      this.$emit('update:isLoading', true)
      getModelInfo(selectedId)
        .then(({ioArgs: { input, output }}) => {
          this.modelInputList = input
          this.modelSetting.inputList = input.map((input, index) => ({
            id: null,
            ...(this.modelSetting.inputList[index] && this.modelSetting.inputList[index])
          }))
          this.modelOuptputList = output
        })
        .catch(() => { this.$emit('update:isFailed', true) })
        .finally(() => { this.$emit('update:isLoading', false) })
    },
    resetInputList () {
      this.modelSetting.inputList = this.modelSetting.inputList.map(input => ({
        dcId: null
      }))
    },
    getdDataColumnOptionList (statesType) {
      return this.dataColumnOptionList.filter(option => option.statsType === statesType)
    },
    handleModelInputChange(index, id) {
      const selectedOption = this.dataColumnOptionList.find(column => column.id === id)
      this.modelSetting.inputList[index] = JSON.parse(JSON.stringify(selectedOption))
    }
  }
}
</script>

<style lang="scss" scoped>
.simulator-setting {
  padding: 24px 17px;

  .setting {
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }

    &__title {
      font-weight: 600;
      font-size: 18px;
      color: #FFFFFF;
      margin-bottom: 8px;
    }

    &__content {
      background: #1C292B;
      border-radius: 12px;
      padding: 25px 17px;
      display: flex;
      flex-wrap: wrap;
      /deep/ .spinner-block {
        padding: 0;
      }
    }

    .input-field {
      display: flex;
      align-items: center;

      &:not(:last-of-type) {
        margin-right: 58px;
      }

      &__label {
        font-size: 14px;
        color: #AAAAAA;
        width: 90px;
      }

      &__input-box {
        position: relative;
      }

      &__input {
        height: 40px;
        font-size: 14px;
        border-color: #FFFFFF;
        width: 232px;

        &::placeholder {
          color: #AAAAAA;
        }
      }

      &__select {
        border-bottom: 1px solid #fff;
        width: 232px;
      }

      &__display {
        font-size: 14px;
      }

      .error-text {
        position: absolute;
      }
      
      /deep/ .el-input__inner {
        font-size: 16px;
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
  }

  .list {
    justify-content: center;
    &__header {
      width: 100%;
      display: flex;
      margin-bottom: 9px;
      padding: 0 16px;
    }

    &__title {
      min-width: 260px;
      font-size: 14px;
      color: #AAAAAA;
    }

    &__item {
      width: 100%;
      padding: 16px;
      background: #141C1D;
      border-radius: 8px;
      display: flex;
      align-items: center;
      &:not(:last-of-type) {
        margin-bottom: 8px;
      }
      .icon {
        width: 30px;
      }
    }

    &__item-data {
      width: 260px;
      &:first-of-type {
        width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>