<template>
  <result-board
    :segmentation-payload="segmentationPayload"
    :result-id="resultId"
    :result-info="resultInfo"
    :restrictions="restrictions"
    :is-war-room-addable="isWarRoomAddable"
    @refresh="refreshPinboardData"
  >
    <result-board-body
      slot="PageResultBoardBody"
      class="correlation-result-body"
    >
      <template slot="PageResultBoardIndicator">
        <notify-info-block
          :msg="$t('editing.resultOverSizeMessage')"
        />
      </template>
      <template slot="PageResultBoardChart">
        <div class="key-result-wrapper">
          <div class="key-result-selector">
            <task
              v-if="resultInfo.key_result_selector && resultInfo.key_result_selector.length > 0"
              :key="resultInfo.key_result_selector[0]"
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
                  :key="resultInfo.sub_key_result[displayFactorIndex]"
                  :component-id="resultInfo.sub_key_result[displayFactorIndex]"
                  :data-frame-id="dataFrameId"
                  intend="sub_key_result"
                />
              </keep-alive>
              <keep-alive>
                <task
                  v-if="resultInfo.sub_insight[displayFactorIndex]"
                  :key="resultInfo.sub_insight[displayFactorIndex]"
                  :component-id="resultInfo.sub_insight[displayFactorIndex]"
                  :is-show-toolbox="false"
                  :is-show-legend="false"
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
          :key="resultInfo.sub_basic_info[displayFactorIndex]"
          :component-id="resultInfo.sub_basic_info[displayFactorIndex]"
          intend="sub_basic_info"
        />
      </template>
      <template
        v-if="resultInfo.recommended_insight && resultInfo.recommended_insight.length > 0"
        slot="InsightRecommended"
      >
        <recommended-insight
          v-for="(componentId, index) in resultInfo.recommended_insight"
          :key="index"
          :component-id="componentId"
        />
      </template>
    </result-board-body>
  </result-board>
</template>
<script>
import NotifyInfoBlock from '@/components/display/NotifyInfoBlock'
import RecommendedInsight from '@/components/display/RecommendedInsight'

export default {
  name: 'CorrelationExplorationResult',
  components: {
    NotifyInfoBlock,
    RecommendedInsight
  },
  props: {
    resultInfo: {
      type: Object,
      required: true
    },
    restrictions: {
      type: Array,
      default: () => []
    },
    dataFrameId: {
      type: Number,
      default: null
    },
    resultId: {
      type: Number,
      default: null
    },
    segmentationPayload: {
      type: Object,
      default: () => null
    },
    isWarRoomAddable: {
      type: Boolean,
      default: false
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
  methods: {
    refreshPinboardData (refreshInfo) {
      this.$emit('refresh', refreshInfo)
    }
  }
}
</script>
<style lang="scss" scoped>
.correlation-result-body {
  ::v-deep .key-result-container {
    & > .chart-block {
      padding-top: 20px;
    }
    .key-result-wrapper {
      display: flex;
      .key-result-selector {
        min-width: 200px;
      }

      .key-result-viewer {
        min-width: calc(100% - 200px);
        padding-left: 24px;
        .chart-block {
          padding-top: 10px;
        }
        .task ~ .task {
          padding-top: 30px;
        }
      }

      .key-result-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    }
  }
}
</style>
