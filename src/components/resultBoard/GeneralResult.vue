<template>
  <result-board
    :result-info="resultInfo"
  >
    <template slot="PageResultBoardHeader">
      <task
        :templateUrl="`api/task/${resultInfo.tasks[0].intent}/template`"
        :dataUrl="`api/task/${resultInfo.tasks[0].intent}/data`"
        :params="resultInfo.tasks[0].entities"
      ></task>
    </template>
    <result-board-body slot="PageResultBoardBody">
      <template slot="PageResultBoardChart">
        <task
          :templateUrl="`api/task/${resultInfo.tasks[1].intent}/template`"
          :dataUrl="`api/task/${resultInfo.tasks[1].intent}/data`"
          :params="resultInfo.tasks[1].entities"
        ></task>
      </template>
      <template slot="InsightBasicInfo">
        <task
          :templateUrl="`api/task/${resultInfo.tasks[2].intent}/template`"
          :dataUrl="`api/task/${resultInfo.tasks[2].intent}/data`"
          :params="resultInfo.tasks[2].entities"
        ></task>
      </template>
      <template slot="InsightRootCause">
        <task
          :templateUrl="`api/task/${resultInfo.tasks[3].intent}/template`"
          :dataUrl="`api/task/${resultInfo.tasks[3].intent}/data`"
          :params="resultInfo.tasks[3].entities"
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
    }
  },
  methods: {
    getSlotName (value) {
      switch (value) {
        case 'title':
          return 'PageResultBoardHeader'
        case 'basic_info':
          return 'InsightBasicInfo'
        case 'key_result':
          return 'PageResultBoardChart'
        default:
          return 'InsightRootCause'
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>