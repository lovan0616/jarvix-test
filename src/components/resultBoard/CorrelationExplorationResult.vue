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
        <div class="key-result-wrapper">
          <div class="key-result-selector">
            <task
              :templateUrl="`api/task/${taskObject.keyResultSelector[0].intent}/template`"
              :dataUrl="`api/task/${taskObject.keyResultSelector[0].intent}/data`"
              :params="taskObject.keyResultSelector[0].entities"
              @change-cursor="onChangeCursor"
            ></task>
          </div>
          <div class="key-result-viewer">
            <keep-alive>
              <task
                v-bind:key="cursor"
                :templateUrl="`api/task/${taskObject.keyResults[cursor].intent}/template`"
                :dataUrl="`api/task/${taskObject.keyResults[cursor].intent}/data`"
                :params="taskObject.keyResults[cursor].entities"
              ></task>
            </keep-alive>
          </div>
        </div>
      </template>
    </result-board-body>
  </result-board>
</template>
<script>
export default {
  name: 'CorrelationExplorationResult',
  props: {
    resultInfo: {
      type: Object
    }
  },
  data () {
    return {
      cursor: 0
    }
  },
  methods: {
    onChangeCursor (cursor) {
      this.cursor = cursor
    }
  },
  computed: {
    taskObject () {
      let taskObject = {
        title: [],
        keyResultSelector: [],
        keyResults: [],
        other: []
      }

      this.resultInfo.tasks.forEach(element => {
        switch (element.entities.diagram_type) {
          case 'title':
            taskObject.title.push(element)
            break
          case 'key_result_selector':
            taskObject.keyResultSelector.push(element)
            break
          case 'key_result':
            taskObject.keyResults.push(element)
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
.key-result-wrapper {
  display: flex;
  .key-result-selector {
    width: 220px;
  }

  .key-result-viewer {
    width: 100%;
    padding-left: 24px;
  }
}
</style>
