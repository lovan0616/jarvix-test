<template>
  <div class="content-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="2"
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
              :is-disabled="isLoadingDataSource"
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
              :is-disabled="!!(isLoadingDataFrame || !sourceDataSourceId)"
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
          :enable-lazy-loading="enableModelsLazyLoading"
          v-model="modelId"
          class="setting-block__select"
          name="modelId"
          @change="modelChangedHandler"
          @intersect="fetchModelList"
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
        <spinner 
          v-if="isLoadingModel"
          :title="$t('editing.loading')"
          class="spinner-container"
          size="30"
        />
        <template v-else>
          <input-column-setting-card
            v-for="(input, index) in ioArgs.input"
            :key="index"
            :data-column-option-list="dataColumnOptionList"
            :column-info="input"
            :placeholder="sourceDataframeId ? $t('batchLoad.chooseColumn') : $t('modelFlow.upload.pleaseChooseDataFrame')"
            class="setting-block__card"
          />
        </template>
      </div>
      <!-- output setting -->
      <div 
        v-if="modelId" 
        class="setting-block">
        <div class="setting-block__title">
          {{ $t('modelFlow.upload.outputSetting') }}
        </div>
        <spinner 
          v-if="isLoadingModel"
          :title="$t('editing.loading')"
          class="spinner-container"
          size="30"
        />
        <template v-else>
          <div class="setting-block__subtitle">
            {{ $t('modelFlow.upload.outputFrameName') }}
          </div>
          <input-verify
            v-validate="'required'"
            v-model.trim="targetDataframeName"
            :placeholder="$t('modelFlow.upload.enterOutputFrameName')"
            :name="'output-frame-name'"
            class="setting-block__input"
            type="text"
          />
          <div class="setting-block__subtitle">
            {{ $t('modelFlow.upload.outputColumnName') }}
          </div>
          <output-column-setting-card
            v-for="(output, index) in ioArgs.output"
            :key="index"
            :column-info="output"
            class="setting-block__card"
          />
        </template>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isLoading"
          class="btn btn-default"
          @click="next"
        >
          {{ $t('button.nextStep') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import UploadProcessBlock from './components/UploadProcessBlock'
import InputColumnSettingCard from './components/InputColumnSettingCard'
import OutputColumnSettingCard from './components/OutputColumnSettingCard'
import DefaultSelect from '@/components/select/DefaultSelect'
import InputVerify from '@/components/InputVerify'
import { getDataSourceList, getDataFrameById, getDataFrameColumnInfoById } from '@/API/DataSource'
import { getModelList, getModelInfo } from '@/API/Model'
import { statsTypeOptionList } from '@/utils/general'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { Message } from 'element-ui'

export default {
  name: 'ContentSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    InputColumnSettingCard,
    OutputColumnSettingCard,
    DefaultSelect,
    InputVerify
  },
  data () {
    return {
      isLoadingDataSource: false,
      isLoadingDataFrame: false,
      isLoadingDataColumn: false,
      isLoadingModel: false,
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
      targetDataframeName: '',
      enableModelsLazyLoading: true,
      modelsPagination: {
        currentPage: -1,
        itemPerPage: 0,
        totalItems: 0,
        totalPages: 0
      }
    }
  },
  computed: {
    ...mapState('modelFlowManagement', ['currentUploadFlowInfo']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    outputColumnNames () {
      return this.ioArgs.output.map(item => item.originalName)
    },
    isLoading () {
      return this.isLoadingDataSource
        || this.isLoadingDataFrame
        || this.isLoadingDataColumn
        || this.isLoadingModel
    }
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
      this.isLoadingDataSource = true
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
        }).finally(() => this.isLoadingDataSource = false)
    },
    fetchDataFrameList () {
      this.isLoadingDataFrame = true
      getDataFrameById(this.sourceDataSourceId)
        .then(response => {
          this.clearData()
          this.dataFrameOptionList = response
            .filter(this.isSelectableSourceDataframe)
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
          } else {
            this.clearInputSettings()
          }
        })
        .finally(() => this.isLoadingDataFrame = false)
    },
    fetchDataColumnList () {
      this.clearInputSettings()
      this.isLoadingDataColumn = true
      const hasFeature = true
      const hasAliasLimit = true
      const hasBlockClustering = false
      const includePrimaryKey = false
      getDataFrameColumnInfoById(this.sourceDataframeId, hasFeature, hasAliasLimit, hasBlockClustering, includePrimaryKey)
        .then(response => {
          this.dataColumnOptionList = response.map(column => {
            return {
              name: `${column.name}(${this.getStatsType(column.statsType)})`,
              value: column.id,
              statsType: column.statsType
            }
          })
        })
        .finally(() => this.isLoadingDataColumn = false)
    },
    fetchModelList () {
      // 取過且已經取到最後一頁
      if (this.modelsPagination.currentPage >= 0
        && this.modelsPagination.currentPage >= this.modelsPagination.totalPages - 1) {
        this.enableModelsLazyLoading = false
        return
      }
      getModelList(this.getCurrentGroupId, ++this.modelsPagination.currentPage)
        .then(({ models, pagination }) => {
          this.modelsPagination = pagination
          const newModelOptions = models
            .map(model => {
              return {
                name: `${model.name} (ID:${model.id})`,
                value: model.id
              }
            })
          this.modelOptionList = [ ...this.modelOptionList, ...newModelOptions ]
        })
    },
    clearData () {
      this.sourceDataframeId = null
      this.dataFrameOptionList = []
      this.dataColumnOptionList = []
      this.columnList = []
    },
    clearInputSettings () {
      // 切換資料表時，清除已經選擇的資料欄位
      this.ioArgs.input.forEach(item => {
        if (item.columnId) item.columnId = null
      })
    },
    getStatsType (statsType) {
      return this.statsTypeOptionList.filter(element => statsType === element.value)[0].name
    },
    modelChangedHandler () {
      this.isLoadingModel = true
      // 模型更動要把 IO 全部更新
      getModelInfo(this.modelId)
        .then(({ioArgs}) => {
          this.ioArgs = {
            input: ioArgs.input.map(input => {
              return {
                modelColumnName: input.modelColumnName,
                columnStatsType: input.statsType,
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
        }).finally(() => {
          this.isLoadingModel = false
        })
    },
    cancel () {
      this.updateShowCreateFlowDialog(false)
    },
    next () {
      if (this.isLoading) return

      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return

        // output 欄位名稱不能重複
        if (this.hasDuplicatedElements(this.outputColumnNames)) {
          return Message({
            message: this.$t('model.outputColumnNameDuplicated'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
        }

        this.updateCurrentUploadFlowInfo({
          ...this.currentUploadFlowInfo,
          ioArgs: {
            input: this.ioArgs.input.map(({ modelColumnName, columnStatsType, columnId }) => ({ modelColumnName, columnStatsType, columnId })),
            output: this.ioArgs.output.map(({ modelColumnName, columnStatsType, originalName }) => ({ modelColumnName, columnStatsType, originalName }))
          },
          modelId: this.modelId,
          sourceDataframeId: this.sourceDataframeId,
          targetDataframeName: this.targetDataframeName
        })
        this.$emit('next')
      })
    },
    isSelectableSourceDataframe (frame) {
      // 來源資料表：
      // 不得為其他 model script 產出來的表 (用 table name 判斷)
      // 不得為 join table 後的表 (joinCount > 1 為 join table)
      return !frame.name.startsWith('sc_') && !(frame.joinCount > 1)
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

    &__subtitle {
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 14px;
      color: #CCCCCC;
    }

    &__input {
      margin-bottom: 24px;
      max-width: 300px;

      >>> .input-verify-text {
        margin-bottom: 0;
      }

      >>> .input-error {
        bottom: -16px;
      }
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
      &:not(:last-of-type) {
        margin-right: 16px;
      }

      .error-text {
        position: absolute;
      }

      &__label {
        font-size: 14px;
        color: #CCCCCC;
      }

      &__text {
        font-size: 16px;
        line-height: 39px;
        @include text-hidden;
      }

      &__select {
        width: 238px;
      }

      &__input {
        position: relative;

        .icon {
          position: absolute;
          left: -25px;
          bottom: 12px;
          font-size: 16px;
          color: #8F9595;
        }
      }

      .el-input__inner {
        &::placeholder { 
          font-size: 14px;
        }
      }
    }

    /deep/ .card > .input-field {
      min-width: 220px;
      &:not(:last-of-type) {
        margin-right: 50px;
      }
    }
  }
}
</style>
