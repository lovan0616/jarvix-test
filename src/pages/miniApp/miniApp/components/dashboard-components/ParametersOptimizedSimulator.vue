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
      <div class="simulator__setting">
        <div class="simulator__setting-title">{{ $t('miniApp.simulationParamSetting') }}</div>
        <div class="simulator__setting-content">
          <simulator-input
            v-for="(columnInfo, index) in modelInfo"
            :is-processing="isProcessing"
            :restrictions="restrictions"
            :column-info="columnInfo"
            :model-id="modelSetting.modelId"
            :key="index + '-' + columnInfo.columnId"
            class="simulator__setting-input"
            @done="updateColumnInfoState(index)"
            @failed="handleFetchInputFailed"
          />
        </div>
        <div class="simulator__setting-action">
          <button
            :disabled="isProcessing"
            type="button"
            class="btn-m btn-default btn-simulate"
            @click="simulate"
          >{{ $t('miniApp.startSimulating') }}</button>
        </div>
      </div>
      <div class="simulator__result">
        <!-- <spinner 
          v-if="isSimulating" 
          :title="$t('miniApp.simulating')"
        /> -->
        <template>
          <el-tabs 
            v-model="activeTabName"
            class="simulator__result-tab"
            type="card">
            <el-tab-pane 
              :label="$t('miniApp.simulationResult')" 
              :name="$t('miniApp.simulationResult')">
              <div class="simulator__result-panel">
                <simulator-result-card
                  v-for="(result, index) in simulatorResults"
                  :key="index"
                  :result="result"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane 
              :label="$t('miniApp.savedRecord')" 
              :name="$t('miniApp.savedRecord')">
              <div class="simulator__record-panel">
                {{ $t('miniApp.savedRecord') }}
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import SimulatorInput from './SimulatorInput'
import SimulatorResultCard from './SimulatorResultCard'
import { modelSimulate, getParamOptimizationResult } from '@/API/Model'
 
export default {
  inject: ['$validator'],
  name: "Simulator",
  components: {
    DefaultSelect,
    EmptyInfoBlock,
    SimulatorInput,
    SimulatorResultCard
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
      isProcessing: false,
      isSimulating: false,
      modelInfo: null,
      resultList: null,
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
    isSimulating(value) {
      if (value) this.startPolling()
    },
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
      this.modelInfo = this.modelSetting.inputList.map(column => ({
        ...column,
        columnId: column.dcId,
        isInit: false,
        userInput: ''
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
        this.isProcessing = true
        
        modelSimulate(this.modelSetting.modelId, {
          inputValues: this.modelInfo.map(column => column.userInput)
        })
          .then(response => {
            this.resultList = response.outputPrimaryAlias.map((element, index) => {
              return {
                name: element,
                value: response.outputValues[index]
              }
            })
          })
          .catch(() => { this.isSimulateFailed = true })
          .finally(() => { this.isProcessing = false })        
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
        getParamOptimizationResult(21)
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
                this.isSimulateFailed = true
                this.failedMessage = errorMessage
                this.clearPolling()
                break
            }
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

  &__setting,
  &__result {
    background: #253030;
    height: 100%;
    padding: 16px;
    &-title {
      font-weight: 600;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 20px;
      margin-bottom: 16px;
    }
  }

  &__setting {
    display: flex;
    flex-direction: column;
    width: 30%;
    border-right: 1px solid #3B4343;
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

      .el-tab-pane {
        height: 100%;
      }
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