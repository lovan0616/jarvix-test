<template>
  <result-board
    :segmentation-payload="segmentationPayload"
    :result-id="resultId"
    :restrictions="restrictions"
    @refresh="refreshPinboardData"
    @unPin="unPin"
  >
    <result-board-body slot="PageResultBoardBody">
      <data-frame-data
        v-if="dataFrameId"
        slot="PageResultBoardChart"
        :key="dataFrameId"
        :data-frame-id="dataFrameId"
        :show-correlation-matrix="false"
        mode="display"
      />
    </result-board-body>
  </result-board>
</template>
<script>
import DataFrameData from '@/components/DataFrameData'
export default {
  name: 'DataPreviewLayout',
  components: {
    DataFrameData
  },
  props: {
    restrictions: {
      type: Array,
      default: () => []
    },
    segmentationPayload: {
      type: Object,
      default: () => {}
    },
    resultId: {
      type: Number,
      default: null
    },
    dataFrameId: {
      type: Number,
      default: null
    }
  },
  methods: {
    refreshPinboardData (refreshInfo) {
      this.$emit('refresh', refreshInfo)
    },
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    }
  }
}
</script>