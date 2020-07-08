<template>
  <result-board
    :result-info="resultInfo"
    :restrictions="restrictions"
    @unPin="unPin"
  >
    <template slot="PageResultBoardHeader">
      <task
        :component-id="resultInfo.title[0]"
        intend="title"
      />
    </template>
    <result-board-body slot="PageResultBoardBody">
      <template 
        v-if="resultInfo.key_result.length > 0"
        slot="PageResultBoardChart"
      >
        <task
          v-for="(chartTask, index) in resultInfo.key_result"
          :key="'chart-' + index"
          :component-id="chartTask"
          intend="key_result"
        />
      </template>
      <template slot="InsightBasicInfo">
        <task
          v-if="resultInfo.basic_info.length > 0"
          :component-id="resultInfo.basic_info[0]"
          intend="basic_info"
        />
      </template>
      <template slot="InsightRootCause">
        <template v-if="resultInfo.general_insight.length > 0">
          <task
            v-for="(otherTask, index) in resultInfo.general_insight"
            :key="'other-' + index"
            :component-id="otherTask"
            intend="general_insight"
          />
        </template>
        <template v-if="resultInfo.correlation_insight.length > 0">
          <task
            v-for="(otherTask, index) in resultInfo.correlation_insight"
            :key="'other-' + index"
            :component-id="otherTask"
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
    }
  },
  methods: {
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    }
  }
}
</script>