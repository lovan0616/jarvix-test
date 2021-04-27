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
        :data-vv-scope="'simulator-' + simulatorId" 
        class="simulator__setting-container"
        @submit.prevent="simulate"
      >
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
                :simulator-id="simulatorId"
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
            type="submit"
            class="btn-m btn-default btn-simulate"
          >{{ $t('miniApp.startSimulating') }}</button>
        </div>
      </form>
      <div class="simulator__result">
        <div 
          v-if="!resultList" 
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
                v-else-if="isProcessing"
                :title="$t('miniApp.simulating')"
              />
              <div 
                v-else
                class="simulator__result-panel">
                <div class="simulator__result-card">
                  <div 
                    v-for="(result, index) in resultList"
                    :key="index"
                    class="item">
                    <div class="item__label">{{ result.name }}</div>
                    <div class="item__value">{{ isNaN(roundNumber(result.value, 3)) ? result.value : roundNumber(result.value, 3) }}</div>
                  </div> 
                </div>
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
import SimulatorInput from './SimulatorInput'
import { modelSimulate } from '@/API/Model'
import { v4 as uuidv4 } from 'uuid'

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
      failedMessage: null,
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
      this.$validator.validateAll(`simulator-${this.simulatorId}`).then(result => {
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
.simulator {
  &__result {
    /deep/ .spinner-block {
      flex: 1;
    }
  }

  &__result-card {
    display: flex;
    flex-wrap: wrap;
    align-content: stretch;
    width: 100%;
    padding: 16px;
    background: #475353;
    border-radius: 5px;
    overflow-y: auto;
  }

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 60px;
    width: 100%;
    &:not(:last-child) {
      margin-bottom: 24px;
    }

    &__label {
      text-align: center;
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      color: #AAAAAA;
    }

    &__value {
      text-align: center;
      font-size: 30px;
      line-height: 42px;
    }
  }
}
</style>