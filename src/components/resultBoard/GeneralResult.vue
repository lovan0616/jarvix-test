<template>
  <result-board 
    :segmentation-payload="segmentationPayload"
    :result-id="resultId"
    :result-info="resultInfo"
    :restrictions="restrictions"
    :is-war-room-addable="isWarRoomAddable"
    class="general-result"
    @refresh="refreshPinboardData"
    @unPin="unPin"
  >
    <result-board-body slot="PageResultBoardBody">
      <template 
        v-if="resultInfo.key_result && resultInfo.key_result.length > 0"
        slot="PageResultBoardChart"
      >
        <task
          v-for="componentId in resultInfo.key_result"
          :key="componentId"
          :component-id="componentId"
          :data-frame-id="dataFrameId"
          intend="key_result"
        />
      </template>
      <template
        v-if="resultInfo.key_result && resultInfo.key_result.length === 0"
        slot="PageResultBoardChart"
      >
        <no-result
          :message="$t('message.emptyResult')"
          class="general-result--empty"
        />
      </template>
      <template slot="InsightBasicInfo">
        <task
          v-if="resultInfo.basic_info && resultInfo.basic_info.length > 0"
          :key="componentId"
          :component-id="resultInfo.basic_info[0]"
          intend="basic_info"
        />
      </template>
      <template slot="InsightRootCause">
        <template v-if="resultInfo.general_insight && resultInfo.general_insight.length > 0">
          <task
            v-for="componentId in resultInfo.general_insight"
            :key="componentId"
            :component-id="componentId"
            intend="general_insight"
          />
        </template>
        <template v-if="resultInfo.correlation_insight && resultInfo.correlation_insight.length > 0">
          <task
            v-for="componentId in resultInfo.correlation_insight"
            :key="componentId"
            :component-id="componentId"
            intend="correlation_insight"
          />
        </template>
      </template>
      <template 
        v-if="resultInfo.recommended_insight && resultInfo.recommended_insight.length > 0"
        slot="InsightRecommended">
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
import RecommendedInsight from '@/components/display/RecommendedInsight'

export default {
  name: 'GeneralResult',
  components: {
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
  methods: {
    refreshPinboardData (pinBoardId) {
      this.$emit('refresh', pinBoardId)
    },
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    }
  }
}
</script>
<style lang="scss" scoped>
.general-result {
  &--empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>