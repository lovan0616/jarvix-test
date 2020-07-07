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
      <!-- TODO 推薦洞察 -->
      <template 
        v-if="fakeResultInfo.recommended_insight.length > 0" 
        slot="InsightRecommended">
        <!-- 這個換動態轉換成 RecommendedInsight-->
        <task-fake
          v-for="id in fakeResultInfo.recommended_insight"
          :key="id"
          :component-id="id"
          :show-toolbox="false"
          :custom-chart-style="{ width: '100%', height: '240px' }"
          :arrow-btn-right="20"
          intend="recommended_insight"
        />
      </template>
    </result-board-body>
  </result-board>
</template>
<script>
import RecommendedInsight from '@/components/display/RecommendedInsight'
import TaskFake from '@/components/display/TaskFake'

export default {
  name: 'GeneralResult',
  components: {
    RecommendedInsight,
    TaskFake
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
      fakeResultInfo: {
        recommended_insight: [197209, 198006, 199050, 198660]
      }
    }
  },
  methods: {
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    }
  }
}
</script>