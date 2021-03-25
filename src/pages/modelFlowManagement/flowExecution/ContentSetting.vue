<template>
  <div class="content-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="1"
    />
    <div class="dialog-body">
      <!-- select data source -->
      <div class="setting-block">
        <div class="setting-block__title">
          {{ $t('editing.sourceOfData') }}
        </div>
        <div class="setting-block__content">
          <div class="select-wrapper">
            <default-select 
              v-validate="'required'"
              :option-list="dataSourceOptionList"
              :placeholder="$t('miniApp.chooseDataSource')"
              :is-disabled="isLoading"
              v-model="sourceDataSourceId"
              filterable
              class="setting-block__select"
              name="dataSourceId"
              @change="fetchDataFrameList"
            />
            <div 
              v-show="errors.has('dataSourceId')"
              class="error-text"
            >{{ errors.first('dataSourceId') }}</div>
          </div>
          <div class="select-wrapper">
            <default-select 
              v-validate="'required'"
              :option-list="dataFrameOptionList"
              :placeholder="$t('miniApp.chooseDataFrame')"
              :is-disabled="!!(!isLoading && !sourceDataSourceId)"
              v-model="sourceDataframeId"
              filterable
              class="setting-block__select"
              name="dataframeId"
              @change="fetchDataColumnList"
            />
            <div 
              v-show="errors.has('dataframeId')"
              class="error-text"
            >{{ errors.first('dataframeId') }}</div>
          </div>
        </div>
      </div>
      <!-- select model -->
      <div class="setting-block">
        <div class="setting-block__title">
          {{ $t('modelFlow.upload.modelSetting') }}
        </div>
        <default-select 
          v-validate="'required'"
          :option-list="modelOptionList"
          :placeholder="$t('modelFlow.upload.chooseModel')"
          v-model="modelId"
          filterable
          class="setting-block__select"
          name="modelId"
          @change="modelChangedHandler"
        />
        <div 
          v-show="errors.has('modelId')"
          class="error-text"
        >{{ errors.first('modelId') }}</div>
      </div>
      <!-- input setting -->
      <div 
        v-if="modelId"
        class="setting-block">
        <div class="setting-block__title">
          {{ $t('modelFlow.upload.inputSetting') }}
        </div>
        <input-column-setting-card
          v-for="(input, index) in ioArgs.input"
          :key="index"
          :column-info="input"
          :is-processing="false"
        />
      </div>
      <!-- output setting -->
      <div 
        v-if="modelId" 
        class="setting-block">
        <div class="setting-block__title">
          {{ $t('modelFlow.upload.outputSetting') }}
        </div>
      </div>
      
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-default"
          @click="next"
        >
          {{ $t('button.nextStep') }}
        </button>
      </div>
    </div>
  </div>
  <!-- <div class="setting-block__warning">
          <svg-icon icon-class="data-explanation" />
          {{ $t('model.upload.argsReminder', {mainScriptName}) }}
        </div> -->
</template>
<script>
import UploadProcessBlock from './components/UploadProcessBlock'
import InputColumnSettingCard from './components/InputColumnSettingCard'
import DefaultSelect from '@/components/select/DefaultSelect'
import { getDataSourceList, getDataFrameById, getDataFrameColumnInfoById } from '@/API/DataSource'
import { getModelList, getModelInfo } from '@/API/Model'
import { statsTypeOptionList } from '@/utils/general'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'ContentSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    InputColumnSettingCard,
    DefaultSelect
  },
  data () {
    return {
      isLoading: false,
      statsTypeOptionList,
      modelId: null,
      sourceDataSourceId: null,
      sourceDataframeId: null,
      dataSourceOptionList: [],
      dataFrameOptionList: [],
      dataColumnOptionList: [],
      modelOptionList: [],
      ioArgs: {
        input: [],
        output: []
      },
      targetDataframeName: ''
    }
  },
  computed: {
    ...mapState('modelFlowManagement', ['currentUploadFlowInfo']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapMutations('modelFlowManagement', ['updateCurrentUploadFlowInfo', 'updateShowCreateFlowDialog']),
    fetchData () {
      this.fetchDataSourceList()
      this.fetchModelList()
      // 清空原資料
      this.clearData()
    },
    fetchDataSourceList () {
      this.isLoading = true
      getDataSourceList()
        .then(response => {
          this.dataSourceOptionList = response
            .filter(source => source.state === 'ENABLE')
            .map(source => {
              return {
                name: source.name,
                value: source.id
              }
            })
        }).finally(() => {
          this.isLoading = false
        })
    },
    fetchDataFrameList () {
      getDataFrameById(this.sourceDataSourceId)
        .then(response => {
          this.clearData()
          this.dataFrameOptionList = response
            .map(frame => {
              return {
                name: frame.primaryAlias,
                value: frame.id
              }
            })
          // 先選第一個
          if (this.dataFrameOptionList.length > 0 ) {
            this.sourceDataframeId = this.dataFrameOptionList[0].value
            this.fetchDataColumnList()
          }
        })
    },
    fetchDataColumnList () {
      getDataFrameColumnInfoById(this.sourceDataframeId)
        .then(response => {
          this.dataColumnOptionList = response.map(column => {
            return {
              name: `${column.name}(${this.getStatsType(column.statsType)})`,
              value: column.id,
              statsType: column.statsType
            }
          })
        })
    },
    fetchModelList () {
      // TODO: 把失敗的 filter
      getModelList(this.getCurrentGroupId)
        .then(response => {
          this.modelOptionList = response.models
            .map(model => {
              return {
                name: `${model.name} (ID:${model.id})`,
                value: model.id
              }
            })
        })
    },
    clearData () {
      this.sourceDataframeId = null
      this.dataFrameOptionList = []
      this.dataColumnOptionList = []
      this.columnList = []
    },
    getStatsType (statsType) {
      return this.statsTypeOptionList.filter(element => statsType === element.value)[0].name
    },
    modelChangedHandler () {
      // 模型更動要把 IO 全部更新
      getModelInfo(this.modelId)
        .then(({ioArgs}) => {
          this.ioArgs = {
            input: ioArgs.input.map(input => {
              return {
                ...input,
                columnId: null,
                id: uuidv4()
              }
            }),
            output: ioArgs.output.map(output => {
              return {
                modelColumnName: output.modelColumnName,
                columnStatsType: output.statsType,
                originalName: '',
                id: uuidv4()
              }
            })
          }
        })
    },
    cancel () {
      this.updateShowCreateFlowDialog(false)
    },
    next () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.updateCurrentUploadModelInfo({
          // ...this.currentUploadModelInfo,
          // ioArgs: {
          //   input: this.columnList.map(({ modelColumnName, statsType }) => ({ modelColumnName, statsType }))
          // }
        })
        this.$emit('next')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content-setting-dialog {
  .dialog-title {
    margin-bottom: 16px;
  }

  .setting-block {
    background: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }

    &__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 16px;
    }

    &__content {
      display: flex;
      .select-wrapper {
        display: inline-block;

        &:not(:first-of-type) {
          margin-left: 16px;
        }
      }
    }

    &__warning {
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: normal;
      color: var(--color-warning);
    }

    

    &__select {
      
    }

    /deep/ .el-input__inner {
      padding-left: 0;
      border-bottom: 1px solid #FFFFFF;

      &::placeholder { 
        font-size: 16px;
      }
    }

    /deep/ .el-input.is-disabled {
      .el-input__inner {
        color: #AAAAAA;
        border-bottom: 1px solid #AAAAAA;

        &::placeholder { 
          color: #AAAAAA;
        }
      }

      .el-icon-arrow-up:before {
        color: #AAAAAA;
      }
    } 

    /deep/ .input-field {
      &__label {
        font-size: 14px;
        color: #CCCCCC;
      }

      .el-input__inner {
        &::placeholder { 
          font-size: 14px;
        }
      }
    }
  }
}
</style>
