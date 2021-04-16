<template>
  <div class="simulator">
    <spinner 
      v-if="isLoading" 
    />
    <empty-info-block
      v-else-if="isFetchInputFailed"
      :msg="$t('message.systemIsError')"
    />
    <section 
      v-show="!isLoading && !isFetchInputFailed" 
      class="simulator__content">
      <div class="simulator__setting-container">
        <div class="simulator__setting">
          <div class="simulator__setting-title">{{ $t('miniApp.inputParamsCriteria') }}</div>
          <div class="simulator__setting-content">
            <parameters-optimized-simulator-input
              v-for="(columnInfo, index) in modelInfo"
              :is-processing="isSimulating"
              :restrictions="restrictions"
              :column-info="columnInfo"
              :model-id="modelSetting.modelId"
              :key="index + '-' + columnInfo.columnId"
              class="simulator__setting-input"
              @done="updateColumnInfoState(index)"
              @failed="handleFetchInputFailed"
            />
          </div>
        </div>
        <div class="simulator__setting-action">
          <button
            :disabled="isSimulating"
            type="button"
            class="btn-m btn-default btn-simulate"
            @click="simulate"
          >{{ $t('miniApp.startSimulating') }}</button>
        </div>
      </div>
      <div class="simulator__result">
        <div 
          v-if="!resultList" 
          class="simulator__default-message">
          {{ $t('miniApp.notYetSimulate') }}
        </div>
        <spinner
          v-else-if="isSimulating"
          :title="$t('miniApp.simulating')"
        />
        <empty-info-block
          v-else-if="isSimulateFailed"
          :msg="failedMessage || $t('message.systemIsError')"
        />
        <template v-else>
          <div class="simulator__result-title">{{ $t('miniApp.simulationResult') }}</div>
          <div class="simulator__result-content">
            <div 
              v-for="(result, index) in resultList"
              :key="index"
              class="simulator__result-item item">
              <div class="item__label">{{ result.name }}</div>
              <div class="item__value">{{ isNaN(roundNumber(result.value, 3)) ? result.value : roundNumber(result.value, 3) }}</div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import ParametersOptimizedSimulatorInput from './ParametersOptimizedSimulatorInput'
import { createParamOptimizationTask, getModelInfo } from '@/API/Model'

export default {
  inject: ['$validator'],
  name: "ParametersOptimizedSimulator",
  components: {
    DefaultSelect,
    EmptyInfoBlock,
    ParametersOptimizedSimulatorInput
  },
  props: {
    isEditMode: {
      type: Boolean,
      default: false,
    },
    restrictions: {
      type: Array,
      default: () => ([])
    },
    modelSetting: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      isSimulating: false,
      modelInfo: null,
      resultList: null,
      isFetchInputFailed: false,
      isSimulateFailed: false,
      failedMessage: null
    }
  },
  computed: {
    
  },
  watch: {
    modelInfo: {
      deep: true,
      handler (newList) {
        const isAllInit = newList.every(column => column.isInit)
        if (!isAllInit) return
        this.isLoading = false
      }
    }
  },
  mounted () {
    this.getModelInfo()
  },
  methods: {
    getModelInfo () {
      this.isLoading = true
      getModelInfo(this.modelSetting.modelId)
        .then(({ioArgs: { output }}) => this.modelSetting.outputList = output)
      this.modelInfo = this.modelSetting.inputList.map(column => ({
        ...column,
        columnId: column.dcId,
        isInit: false,
        userInput: {
          type: column.statsType === 'NUMERIC' ? 'RANGE' : 'ALL'
        }
      }))
    },
    updateColumnInfoState(index) {
      this.modelInfo = this.modelInfo.map((input, currentIndex) => {
        if (index !== currentIndex) return input
        return {
          ...input, 
          isInit: true
        }
      })
      this.modelInfo[index].isInit = true
    },
    simulate () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isSimulateFailed = false
        this.isSimulating = true

        createParamOptimizationTask({
          dataFrameId: this.modelSetting.dataFrameId,
          modelId: this.modelSetting.modelId,
          restrictions: this.restrictions.length > 0 ? this.restrictions : null,
          riskProperty: 'HIGH',
          setting: {
            expectItems: this.modelSetting.outputList.map(output => ({
              expectType: 'MAX'
            })),
            inputItems: this.modelInfo.map(input => {
              if (input.statsType === 'CATEGORY') {
                return {
                  conditionType: input.userInput.type,
                  dataColumnId: input.columnId,
                  items: input.userInput.type === 'ALL' ? null : input.userInput.selectedList,
                  fixedValue: null,
                  rangeMax: null,
                  rangeMin: null,
                  statsType: input.statsType
                }
              } else if (input.statsType === 'NUMERIC') { 
                return {
                  conditionType: input.userInput.type,
                  dataColumnId: input.columnId,
                  items: null,
                  fixedValue: input.userInput.type === 'RANGE' ? null : input.userInput.min,
                  rangeMax: input.userInput.type === 'RANGE' ? input.userInput.max : null,
                  rangeMin: input.userInput.type === 'RANGE' ? input.userInput.min : null,
                  statsType: input.statsType
                }
              }
            }),
            outputLimit: 5
          }
        })
        .catch(error => { 
          this.isSimulating = false
          this.failedMessage = error.error && error.error.message
          this.isSimulateFailed = true
         })      
      })
    },
    handleFetchInputFailed (message) {
      this.isLoading = false
      this.isFetchInputFailed = true
      if (!this.failedMessage) this.failedMessage = message
    }
  },

}
</script>

<style lang="scss" scoped>
.simulator {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__content {
    display: flex;
    height: 100%;
    justify-content: center;
    border-radius: 5px;
  }

  &__setting-container,
  &__result {
    background: #253030;
    height: 100%;
    padding: 16px;
    overflow-y: auto;
  }

  &__setting,
  &__result {
    &-title {
      font-weight: 600;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 20px;
      margin-bottom: 16px;
    }
  }

  &__setting-container {
    display: flex;
    flex-direction: column;
    flex: 0 0 365px;
    border-right: 1px solid #3B4343;
  }

  &__setting {
    &-content {
      flex: 1;
      height: calc(100% - 36px);
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 12px;
    }
    &-action {
      padding-top: 12px;
      .btn-simulate {
        width: 100%;
      }
    }
    &-input {
      &:not(:last-of-type) {
        margin-bottom: 16px;
      }
      &:last-of-type {
        margin-bottom: 21px;
      }
    }
  }

  &__result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1 1 auto;
  }

  &__result-content {
    height: calc(100% - 36px);
    display: flex;
    width: 100%;
    flex-direction: column;
    overflow-y: auto;
  }

  &__result-item {
    margin-bottom: 12px;
    width: 100%;
  }

  .item {
    &__label {
      margin-bottom: 8px;
      color: #AAAAAA;
      font-weight: 600;
      font-size: 14px;
    }

    &__value {
      color: #FFFFFF;
      font-size: 14px;
    }
  }

  &__default-message {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999999;
    font-size: 14px;
  }

  &__header {
    display: flex;
    flex-direction: row;
    margin-bottom: 8px;

    .btn-delete {
      color: #CCC;
      cursor: pointer;

      &:hover {
        color: $theme-color-primary;
      }
    }
  }

  &__title {
    flex: 1;
    margin: 0;
    font-size:14px;
    line-height: 22px;
    color: #CCC;
  }

  &__content {
    margin-bottom: 16px;
    overflow-y: auto;

    .empty-message {
      padding: 8px 12px;
      background-color: #1C292B;
      border-radius: 8px;
      font-size: 14px;
      color: #CCC;
    }
  }

  /deep/ .empty-info-block {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>