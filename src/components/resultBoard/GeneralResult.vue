<template>
  <result-board
    :result-info="resultInfo"
    :restrictions="restrictions"
  >
    <template slot="PageResultBoardHeader">
      <task
        :component-id="resultInfo.title[0]"
        intend="title"
      ></task>
    </template>
    <result-board-body slot="PageResultBoardBody">
      <template slot="PageResultBoardChart">
        <task
          v-if="resultInfo.key_result.length > 0"
          v-for="(chartTask, index) in resultInfo.key_result"
          :key="'chart-' + index"
          :component-id="chartTask"
          intend="key_result"
        ></task>
      </template>
      <template slot="InsightBasicInfo">
        <task
          v-if="resultInfo.basic_info.length > 0"
          :component-id="resultInfo.basic_info[0]"
          intend="basic_info"
        ></task>
      </template>
      <template slot="InsightRootCause">
        <task
          v-if="resultInfo.general_insight.length > 0"
          v-for="(otherTask, index) in resultInfo.general_insight"
          :key="'other-' + index"
          :component-id="otherTask"
          intend="general_insight"
        ></task>
        <task
          v-if="resultInfo.correlation_insight.length > 0"
          v-for="(otherTask, index) in resultInfo.correlation_insight"
          :key="'other-' + index"
          :component-id="otherTask"
          intend="correlation_insight"
        ></task>
      </template>
    </result-board-body>
  </result-board>
</template>
<script>
export default {
  name: 'GeneralResult',
  props: {
    resultInfo: {
      type: Object
    },
    restrictions: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>

</style>
