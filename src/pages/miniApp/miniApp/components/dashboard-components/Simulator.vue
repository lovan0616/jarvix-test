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
          </div>
        </div>
        <div class="simulator__setting-container--bottom">
          <button
            :disabled="isProcessing"
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
          v-else-if="isProcessing"
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
import SimulatorInput from './SimulatorInput'
import { modelSimulate } from '@/API/Model'

export default {
  inject: ['$validator'],
  name: "Simulator",
  components: {
    DefaultSelect,
    EmptyInfoBlock,
    SimulatorInput
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
    }
  },

}
</script>

<style lang="scss" scoped>
.simulator {}
</style>