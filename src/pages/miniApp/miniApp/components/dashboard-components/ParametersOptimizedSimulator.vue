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
        <div class="simulator__setting-container--top">
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
          <div class="simulator__setting">
            <div class="simulator__setting-title">{{ $t('miniApp.outputParamsCriteria') }}</div>
            <div class="simulator__setting-content">
              <parameters-optimized-simulator-output
                v-for="(output, index) in outputInfo"
                :is-processing="isSimulating"
                :output-info="output"
                :key="index + '-' + output.modelColumnName"
                class="simulator__setting-input"
              />
              
            </div>
          </div>
        </div>
        
        <div class="simulator__setting-container--bottom">
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
          v-if="!taskId" 
          class="simulator__default-message">
          {{ $t('miniApp.notYetSimulate') }}
        </div>
        <template v-else>
          <el-tabs 
            v-model="activeTabName"
            class="simulator__result-tab"
            type="card">
            <el-tab-pane 
              :label="$t('miniApp.simulationResult')" 
              :name="$t('miniApp.simulationResult')">
              <div
                v-if="isSimulateFailed"
                class="simulator__default-message">
                {{ failedMessage || $t('message.systemIsError') }}
              </div>
              <spinner
                v-else-if="isSimulating"
                :title="$t('miniApp.simulating')"
              />
              <div 
                v-else
                class="simulator__result-panel">
                <simulator-result-card
                  v-for="(result, index) in simulatorResults"
                  :key="index"
                  :result="result"
                />
              </div>
            </el-tab-pane>
            <!-- 下次再加 -->
            <!-- <el-tab-pane 
              :label="$t('miniApp.savedRecord')" 
              :name="$t('miniApp.savedRecord')">
              <div class="simulator__record-panel">
                {{ $t('miniApp.savedRecord') }}
              </div>
            </el-tab-pane> -->
          </el-tabs>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import SimulatorResultCard from './SimulatorResultCard'
import ParametersOptimizedSimulatorInput from './ParametersOptimizedSimulatorInput'
import ParametersOptimizedSimulatorOutput from './ParametersOptimizedSimulatorOutput'
import { getModelInfo, createParamOptimizationTask, getParamOptimizationResult } from '@/API/Model'

export default {
  inject: ['$validator'],
  name: "ParametersOptimizedSimulator",
  components: {
    DefaultSelect,
    EmptyInfoBlock,
    SimulatorResultCard,
    ParametersOptimizedSimulatorInput,
    ParametersOptimizedSimulatorOutput
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
      outputInfo: null,
      resultList: null,
      taskId: null,
      isFetchInputFailed: false,
      isSimulateFailed: false,
      failedMessage: null,
      intervalFunction: null,
      simulatorResults: [],
      activeTabName: this.$t('miniApp.simulationResult'),
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
  destroyed () {
    this.clearPolling()
  },
  methods: {
    getModelInfo () {
      this.isLoading = true
      getModelInfo(this.modelSetting.modelId)
        .then(({ioArgs: { output: outputList }}) => this.outputInfo = outputList.map(output => ({
          ...output,
          expectType: 'MAX'
        })))
        .catch(() => this.isFetchInputFailed = true)
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
          riskProperty: 'MEDIUM',
          setting: {
            expectItems: this.outputInfo.map(output => ({
              expectType: output.expectType
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
        .then((taskId) => {
          this.taskId = taskId
          this.startPolling()
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
    },
    startPolling () {
      if(!this.isSimulating) return
      this.intervalFunction = window.setInterval(() => {
        getParamOptimizationResult(this.taskId)
          .then(({status, results, errorMessage})=> {
            switch(status) {
              case 'Ready':
              case 'Process':
                break
              case 'Complete':
                this.simulatorResults = results
                this.clearPolling()
                break
              case 'Fail':
                this.failedMessage = errorMessage
                this.isSimulateFailed = true
                this.clearPolling()
                break
            }
          })
          .catch(error => { 
            this.isSimulating = false
            this.failedMessage = error.error && error.error.message
            this.isSimulateFailed = true
            this.clearPolling()
          }) 
      }, 5000) 
    },
    clearPolling () {
      this.isSimulating = false
      if (this.intervalFunction) window.clearInterval(this.intervalFunction)
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

  &__setting-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 0 0 365px;
    border-right: 1px solid #3B4343;

    &--top {
      height: calc(100% - 46px);
      overflow-y: auto;
    }
    &--bottom {
      .btn-simulate {
        width: 100%;
      }
    }
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

  &__setting {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    &-content {
      flex: 1;
      height: calc(100% - 36px);
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 12px;
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
    flex: 1 1 auto;
    display: flex;
    padding-top: 0;
    width: 70%;
  }

  &__result-content {
    height: calc(100% - 36px);
    display: flex;
    width: 100%;
    flex-direction: column;
    overflow-y: auto;
  }

  &__result-panel, 
  &__record-panel {
    padding-top: 16px;
    height: 100%;
  }

  &__result-panel {
    display: flex;
    overflow-y: auto;
  }

  /deep/ .el-tabs {
    width: 100%;
    &>.el-tabs__header {
      border: none;
      margin: 0;
      width: 100%;

      .el-tabs__nav {
        position: relative;
        width: 100%;
        border: none;
        overflow-x: auto;

        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: #3B4343;
        }
      }
      .el-tabs__item {
        border: none;
        color:  #646464;
        border-bottom: 1px solid #3B4343;
        text-align: center;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
        &.is-active {
          color: $theme-text-color-primary;
          border-bottom: 3px solid $theme-text-color-primary;
        }
      }
    }

    &>.el-tabs__content {
      height: calc(100% - 40px);

      .el-tab-pane, .spinner-block {
        height: 100%;
      }
    }
  }

  &__default-message {
    width: 100%;
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

  /deep/ .empty-info-block {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>  