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
    <root-cause-board-body slot="RootCauseResultBoardBody">
      <template slot="RootCauseDescription">
        <task
          v-if="resultInfo.root_cause_summary.length > 0"
          :component-id="resultInfo.root_cause_summary[0]"
          intend="root_cause_summary"
        />
      </template>
      <template slot="PageResultBoardChart">
        <task
          v-if="resultInfo.root_cause_phenomenon.length > 0"
          :component-id="resultInfo.root_cause_phenomenon[0]"
          intend="root_cause_phenomenon"
        />
      </template>
      <template slot="RootCauseItem">
        <template v-if="resultInfo.root_cause_item.length > 0">
          <task
            v-for="(rootCauseItem, index) in resultInfo.root_cause_item"
            :key="'chart-' + index"
            :component-id="rootCauseItem"
            intend="root_cause_item"
          />
        </template>
      </template>
    </root-cause-board-body>
  </result-board>
</template>
<script>
export default {
  name: 'RootCauseResult',
  props: {
    resultInfo: {
      type: Object,
      required: true
    },
    restrictions: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
