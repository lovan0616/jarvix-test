<template>
  <result-board
    :segmentation-payload="segmentationPayload"
    :result-id="resultId"
    :result-info="resultInfo"
    :restrictions="restrictions"
    :is-war-room-addable="isWarRoomAddable"
    @refresh="refreshPinboardData"
  >
    <template slot="PageResultBoardHeader">
      <task
        :key="resultInfo.title[0]"
        :component-id="resultInfo.title[0]"
        intend="title"
      />
    </template>
    <root-cause-board-body slot="RootCauseResultBoardBody">
      <template slot="RootCauseDescription">
        <task
          v-if="resultInfo.root_cause_summary && resultInfo.root_cause_summary.length > 0"
          :key="resultInfo.root_cause_summary[0]"
          :component-id="resultInfo.root_cause_summary[0]"
          intend="root_cause_summary"
        />
      </template>
      <template slot="PageResultBoardChart">
        <task
          v-if="resultInfo.root_cause_phenomenon && resultInfo.root_cause_phenomenon.length > 0"
          :key="resultInfo.root_cause_phenomenon[0]"
          :component-id="resultInfo.root_cause_phenomenon[0]"
          :data-frame-id="dataFrameId"
          intend="root_cause_phenomenon"
        />
      </template>
      <template slot="RootCauseItem">
        <template v-if="resultInfo.root_cause_item && resultInfo.root_cause_item.length > 0">
          <task
            v-for="componentId in resultInfo.root_cause_item"
            :key="componentId"
            :component-id="componentId"
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
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
