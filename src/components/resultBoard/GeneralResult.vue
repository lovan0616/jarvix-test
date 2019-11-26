<template>
  <result-board
    :result-info="resultInfo"
  >
    <template slot="PageResultBoardHeader">
      <task
        :templateUrl="`api/task/${taskObject.title[0].intent}/template`"
        :dataUrl="`api/task/${taskObject.title[0].intent}/data`"
        :params="taskObject.title[0].entities"
      ></task>
    </template>
    <result-board-body slot="PageResultBoardBody">
      <template slot="PageResultBoardChart">
        <task
          v-if="taskObject.key_result.length > 0"
          v-for="(chartTask, index) in taskObject.key_result"
          :key="'chart-' + index"
          :templateUrl="`api/task/${chartTask.intent}/template`"
          :dataUrl="`api/task/${chartTask.intent}/data`"
          :params="chartTask.entities"
        ></task>
      </template>
      <template slot="InsightBasicInfo">
        <task
          v-if="taskObject.basic_info.length > 0"
          :templateUrl="`api/task/${taskObject.basic_info[0].intent}/template`"
          :dataUrl="`api/task/${taskObject.basic_info[0].intent}/data`"
          :params="taskObject.basic_info[0].entities"
        ></task>
      </template>
      <template slot="InsightRootCause">
        <task
          v-if="taskObject.other.length > 0"
          v-for="(otherTask, index) in taskObject.other"
          :key="'other-' + index"
          :templateUrl="`api/task/${otherTask.intent}/template`"
          :dataUrl="`api/task/${otherTask.intent}/data`"
          :params="otherTask.entities"
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
  computed: {
    taskObject () {
      let taskObject = {
        title: [],
        key_result: [],
        basic_info: [],
        other: []
      }

      this.resultInfo.tasks.forEach(element => {
        switch (element.entities.diagram_type) {
          case 'title':
            taskObject.title.push(element)
            break
          case 'key_result':
            taskObject.key_result.push(element)
            break
          case 'basic_info':
            taskObject.basic_info.push(element)
            break
          default:
            taskObject.other.push(element)
            break
        }
      })

      return taskObject
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
