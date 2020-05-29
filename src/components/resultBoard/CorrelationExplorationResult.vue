<template>
  <result-board
    :result-info="resultInfo"
    :restrictions="restrictions"
  >
    <template slot="PageResultBoardHeader">
      <task
        :component-id="resultInfo.title[0]"
        intend="title"
      />
    </template>
    <result-board-body slot="PageResultBoardBody">
      <template slot="PageResultBoardIndicator">
        <div class="hint-info-block">
          <div class="hint-info"><span class="hint-title"><svg-icon icon-class="lamp"/> {{ $t('resultDescription.prompt') }}:</span> {{ $t('editing.resultOverSizeMessage') }}</div>
        </div>
      </template>
      <template slot="PageResultBoardChart">
        <div class="key-result-wrapper">
          <div class="key-result-selector">
            <task
              :component-id="resultInfo.key_result_selector[0]"
              intend="key_result_selector"
            />
          </div>
          <div class="key-result-viewer">
            <div 
              v-show="isLoading"
              class="key-result-spinner"
            >
              <spinner
                :title="$t('resultDescription.analysisProcessing')"
              />
            </div>
            <div 
              v-show="!isLoading"
              class="chart-block"
            >
              <keep-alive>
                <task
                  v-if="resultInfo.sub_key_result[displayFactorIndex]"
                  :key="`sub-key-result-${displayFactorIndex}`"
                  :component-id="resultInfo.sub_key_result[displayFactorIndex]"
                  intend="sub_key_result"
                />
              </keep-alive>
              <keep-alive>
                <task
                  v-if="resultInfo.sub_insight[displayFactorIndex]"
                  :key="`sub-insight-${displayFactorIndex}`"
                  :component-id="resultInfo.sub_insight[displayFactorIndex]"
                  intend="sub_insight"
                />
              </keep-alive>
            </div>
          </div>
        </div>
      </template>
      <template slot="InsightBasicInfo">
        <task
          v-if="resultInfo.sub_basic_info[displayFactorIndex]"
          :key="`sub-basic-info-${displayFactorIndex}`"
          :component-id="resultInfo.sub_basic_info[displayFactorIndex]"
          intend="sub_basic_info"
        />
      </template>
    </result-board-body>
  </result-board>
</template>
<script>
export default {
  name: 'CorrelationExplorationResult',
  props: {
    resultInfo: {
      type: Object,
      required: true
    },
    restrictions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isLoading: true
    }
  },
  computed: {
    displayFactorIndex () {
      return this.$store.state.result.displayFactorIndex
    }
  },
  watch: {
    displayFactorIndex (value) {
      this.isLoading = true

      this.$nextTick(() => {
        this.isLoading = false
      })
    }
  },
  destroyed () {
    this.$store.commit('result/updateDisplayFactorIndex', 0)
  },
  mounted () {
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
}
</script>
<style lang="scss" scoped>
.hint-info-block {
  background-color: rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  padding: 11px;
  font-size: 14px;
  line-height: 1;
  margin-bottom: 12px;

  .hint-title {
    color: #FFDF6F;
  }
}

>>>.result-board-body {
  padding-top: 23px;
}

.key-result-wrapper {
  display: flex;
  .key-result-selector {
    min-width: 200px;
  }

  .key-result-viewer {
    min-width: calc(100% - 200px);
    padding-left: 24px;
  }

  .key-result-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>
