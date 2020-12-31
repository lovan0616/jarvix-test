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
        <div class="simulator__setting-title">模擬參數設定</div>
        <div class="simulator__setting-content">
          <simulator-input
            v-for="(columnInfo, index) in scriptInfo"
            :is-processing="isProcessing"
            :column-info="columnInfo"
            :key="columnInfo.columnId"
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
        <div 
          v-if="!result" 
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
          <div class="simulator__result-title">{{ result.name }}</div>
          <div class="simulator__result-content">
            <div class="simulator__result-value">
              <div class="simulator__result-data">{{ result.value }}</div>
              <!--暫時寫死，未來應該要能設定-->
              <div class="simulator__result-unit">%</div>
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
import { getScripInfo, executeScript } from '@/API/Script'

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
    scriptId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      scriptInfo: null,
      result: null,
      isFetchInputFailed: false,
      isSimulateFailed: false,
      failedMessage: null
    }
  },
  computed: {
    
  },
  watch: {
    scriptInfo: {
      deep: true,
      handler (newList) {
        const isAllInit = newList.every(column => column.isInit)
        if (!isAllInit) return
        this.isLoading = false
      }
    }
  },
  mounted () {
    this.getScriptInfo()
  },
  methods: {
    getScriptInfo () {
      this.isLoading = true
      getScripInfo(this.scriptId)
        .then(response => {
          this.scriptInfo = response.inputColumns.map(column => ({
            columnId: column,
            isInit: false,
            userInput: ''
          }))
        })
        .catch(() => {
          this.isLoading = false
          this.isFetchInputFailed = true
        })
    },
    updateColumnInfoState(index) {
      this.scriptInfo = this.scriptInfo.map((input, currentIndex) => {
        if (index !== currentIndex) return input
        return {
          ...input, 
          isInit: true
        }
      })
      this.scriptInfo[index].isInit = true
    },
    simulate () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isSimulateFailed = false
        this.isProcessing = true
        
        executeScript(this.scriptId, {
          inputValues: this.scriptInfo.map(column => column.userInput)
        })
          .then(response => {
            this.result = {
              // 先固定取第一筆來顯示
              name: response.outputPrimaryAlias[0],
              value: response.outputValues && Math.round(Number(response.outputValues[0]))
            }
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
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__content {
    display: flex;
    height: 100%;
    justify-content: center;
  }

  &__setting,
  &__result {
    background: #101919;
    border-radius: 5.2px;
    width: 50%;
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
    margin-right: 12px;
    &-content {
      flex: 1;
      height: calc(100% - 36px);
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 12px;
    }
    &-action {
      padding-top: 12px;
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
  }

  &__result-content {
    height: calc(100% - 36px);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &__result-value {
    display: flex;
    color: #2AD2E2;
    font-weight: bold;
    font-size: 80px;
    align-items: baseline;
    justify-content: center;
    width: 100%;
  }

  &__result-data {
    max-width: calc(100% - 32px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__result-unit {
    font-weight: 600;
    font-size: 36px;
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