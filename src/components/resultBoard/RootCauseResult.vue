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
    <root-cause-board-body slot="RootCauseResultBoardBody">
      <template slot="RootCauseDescription">
        <task
          v-if="taskObject.root_cause_summary.length > 0"
          :templateUrl="`api/task/${taskObject.root_cause_summary[0].intent}/template`"
          :dataUrl="`api/task/${taskObject.root_cause_summary[0].intent}/data`"
          :params="taskObject.root_cause_summary[0].entities"
        ></task>
      </template>

      <template slot="PageResultBoardChart">
        <task
          v-if="taskObject.root_cause_phenomenon.length > 0"
          :templateUrl="`api/task/${taskObject.root_cause_phenomenon[0].intent}/template`"
          :dataUrl="`api/task/${taskObject.root_cause_phenomenon[0].intent}/data`"
          :params="taskObject.root_cause_phenomenon[0].entities"
        ></task>
      </template>

      <template slot="RootCauseItem">
         <task
          v-if="taskObject.root_cause_item.length > 0"
          v-for="(rootCauseItem, index) in taskObject.root_cause_item"
          :key="'chart-' + index"
          :templateUrl="`api/task/${rootCauseItem.intent}/template`"
          :dataUrl="`api/task/${rootCauseItem.intent}/data`"
          :params="rootCauseItem.entities"
        ></task>
      </template>
    </root-cause-board-body>
  </result-board>
</template>
<script>
export default {
  name: 'RootCauseResult',
  props: {
    resultInfo: {
      type: Object
    }
  },
  computed: {
    taskObject () {
      let taskObject = {
        title: [],
        root_cause_phenomenon: [],
        root_cause_summary: [],
        root_cause_item: []
      }

      this.resultInfo.tasks.forEach(element => {
        switch (element.entities.diagram_type) {
          case 'title':
            taskObject.title.push(element)
            break
          case 'root_cause_phenomenon':
            taskObject.root_cause_phenomenon.push(element)
            break
          case 'root_cause_summary':
            taskObject.root_cause_summary.push(element)
            break
          case 'root_cause_item':
            taskObject.root_cause_item.push(element)
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
