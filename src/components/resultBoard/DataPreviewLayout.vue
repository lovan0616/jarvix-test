<template>
  <result-board
    :result-id="resultId"
    :restrictions="restrictions"
    @unPin="unPin"
  >
    <result-board-header
      slot="PageResultBoardHeader"
      :title="segmentationPayload.question"
      :segmentation="segmentationPayload"
    />
    <result-board-body slot="PageResultBoardBody">
      <data-frame-data
        v-if="segmentationPayload.dataframeId"
        slot="PageResultBoardChart"
        :key="segmentationPayload.dataframeId"
        :data-frame-id="segmentationPayload.dataframeId"
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
    }
  },
  methods: {
    unPin (pinBoardId) {
      console.log(pinBoardId, 'pinBoardId')
      this.$emit('unPin', pinBoardId)
    }
  }
}
</script>