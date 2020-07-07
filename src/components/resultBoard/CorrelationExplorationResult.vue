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
    <result-board-body
      slot="PageResultBoardBody"
      class="correlation-result-body"
    >
      <template slot="PageResultBoardIndicator">
        <hint-info-block
          :msg-list="[$t('editing.resultOverSizeMessage')]"
          inline
        />
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
      <!-- TODO 推薦洞察 -->
      <template slot="InsightRecommended">
        <recommended-insight-item 
          v-for="(insight, i) in fakeResultInfo.recommended_insight"
          :key="i">
          <task
            :component-id="insight"
            :show-toolbox="false"
            :custom-chart-style="{ width: '100%', height: '280px' }"
            intend="recommended_insight"
          />
        </recommended-insight-item>
      </template>
    </result-board-body>
  </result-board>
</template>
<script>
import HintInfoBlock from '@/components/display/HintInfoBlock'

export default {
  name: 'CorrelationExplorationResult',
  components: {
    HintInfoBlock
  },
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
      isLoading: true,
      fakeResultInfo: {
        recommended_insight: [198005, 198006, 198007, 197995]
      }
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
.correlation-result-body.result-board-body {
  padding-top: 16px;
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
