<template>
  <result-board
    :result-info="resultInfo"
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
    resultInfo: {
      type: Object,
      required: true
    },
    restrictions: {
      type: Array,
      default: () => []
    },
    segmentationPayload: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    }
  }
}
</script>