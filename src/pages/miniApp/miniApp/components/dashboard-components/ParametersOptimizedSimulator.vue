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
      <form 
        :data-vv-scope="`params-optimization-${simulatorId}`" 
        class="simulator__setting-container" 
        @submit.prevent="simulate">
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
                :simulator-id="simulatorId"
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
                v-for="(output, index) in outputInfo.criteria"
                :is-processing="isSimulating"
                :criteria-info="output"
                :key="index + '-' + output.modelColumnName"
                setting-type="EXPECTATION"
                class="simulator__setting-input"
              />
            </div>
          </div>
          <div class="simulator__setting">
            <div class="simulator__setting-title">{{ $t('miniApp.outputResultSetting') }}</div>
            <div class="simulator__setting-content">
              <parameters-optimized-simulator-output
                :is-processing="isSimulating"
                :risk-property.sync="outputInfo.riskProperty"
                setting-type="RISK"
                class="simulator__setting-input"
              />
            </div>
          </div>
        </div>
        
        <div class="simulator__setting-container--bottom">
          <button
            :disabled="isSimulating"
            type="submit"
            class="btn-m btn-default btn-simulate"
          >{{ $t('miniApp.startSimulating') }}</button>
        </div>
      </form>
      <div class="simulator__result">
        <div 
          v-if="!taskId" 
          class="simulator__default-message">
          {{ failedMessage || $t('miniApp.notYetSimulate') }}
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
import { v4 as uuidv4 } from 'uuid'

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
      outputInfo: {
        criteria: [],
        riskProperty: 'LOW'
      },
      resultList: null,
      taskId: null,
      isFetchInputFailed: false,
      isSimulateFailed: false,
      failedMessage: null,
      intervalFunction: null,
      simulatorResults: [],
      activeTabName: this.$t('miniApp.simulationResult'),
      simulatorId: uuidv4()
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
        .then(({ioArgs: { output: outputList }}) => this.outputInfo.criteria = outputList.map(output => ({
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
    },
    simulate () {
      this.$validator.validateAll(`params-optimization-${this.simulatorId}`).then(result => {
        if (!result) return
        this.isSimulateFailed = false
        this.isSimulating = true

        createParamOptimizationTask({
          dataFrameId: this.modelSetting.dataFrameId,
          modelId: this.modelSetting.modelId,
          restrictions: this.restrictions.length > 0 ? this.restrictions : null,
          riskProperty: this.outputInfo.riskProperty,
          setting: {
            expectItems: this.outputInfo.criteria.map(output => ({
              expectType: output.expectType
            })),
            inputItems: this.modelInfo.map(input => {
              if (input.statsType === 'CATEGORY' || input.statsType === 'BOOLEAN') {
                return {
                  conditionType: input.userInput.type,
                  dataColumnId: input.columnId,
                  items: input.userInput.type === 'ALL' ? null : input.userInput.selectedList,
                  fixedValue: null,
                  rangeMax: null,
                  rangeMin: null,
                  statsType: input.statsType,
                  startTime: null,
                  endTime: null
                }
              } else if (input.statsType === 'NUMERIC') { 
                return {
                  conditionType: input.userInput.type,
                  dataColumnId: input.columnId,
                  items: null,
                  fixedValue: input.userInput.type === 'RANGE' ? null : input.userInput.min,
                  rangeMax: input.userInput.type === 'RANGE' ? input.userInput.max : null,
                  rangeMin: input.userInput.type === 'RANGE' ? input.userInput.min : null,
                  statsType: input.statsType,
                  startTime: null,
                  endTime: null
                }
              } else if (input.statsType === 'DATETIME') {
                return {
                  conditionType: 'RANGE',
                  dataColumnId: input.columnId,
                  items: null,
                  fixedValue: null,
                  rangeMax: null,
                  rangeMin: null,
                  statsType: input.statsType,
                  startTime: this.customerTimeFormatter(input.userInput.start, 'SECOND'),
                  endTime: this.customerTimeFormatter(input.userInput.end, 'SECOND')
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