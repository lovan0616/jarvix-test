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
            <div class="key-result-spinner"
              v-show="isLoading"
            >
              <spinner
                :title="$t('resultDescription.analysisProcessing')"
              ></spinner>
            </div>
            <div class="chart-block"
              v-show="!isLoading"
            >
               <keep-alive>
                <task v-if="taskObject.subKeyResults[cursor]"
                  v-bind:key="`sub-key-result-${cursor}`"
                  :templateUrl="`api/task/${taskObject.subKeyResults[cursor].intent}/template`"
                  :dataUrl="`api/task/${taskObject.subKeyResults[cursor].intent}/data`"
                  :params="taskObject.subKeyResults[cursor].entities"
                ></task>
              </keep-alive>
              <keep-alive>
                <task v-if="taskObject.subCorrelationInsights[cursor]"
                  v-bind:key="`sub-correlation-insight-${cursor}`"
                  :templateUrl="`api/task/${taskObject.subCorrelationInsights[cursor].intent}/template`"
                  :dataUrl="`api/task/${taskObject.subCorrelationInsights[cursor].intent}/data`"
                  :params="taskObject.subCorrelationInsights[cursor].entities"
                ></task>
              </keep-alive>
            </div>
          </div>
        </div>
      </template>
      <template slot="InsightBasicInfo">
        <task v-if="taskObject.subBasicInfos[cursor]"
          v-bind:key="`sub-basic-info-${cursor}`"
          :templateUrl="`api/task/${taskObject.subBasicInfos[cursor].intent}/template`"
          :dataUrl="`api/task/${taskObject.subBasicInfos[cursor].intent}/data`"
          :params="taskObject.subBasicInfos[cursor].entities"
        ></task>
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
      cursor: 0,
      isLoading: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  methods: {
    onChangeCursor (cursor) {
      this.isLoading = true
      this.cursor = cursor
      this.$nextTick(() => {
        this.isLoading = false
      })
    }
  },
  computed: {
    taskObject () {
      let taskObject = {
        title: [],
        keyResultSelector: [],
        subTitles: [],
        subKeyResults: [],
        subBasicInfos: [],
        subCorrelationInsights: [],
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
          case 'sub_key_result':
            taskObject.subKeyResults[element.entities.sub_task_index] = element
            break
          case 'sub_basic_info':
            taskObject.subBasicInfos[element.entities.sub_task_index] = element
            break
          case 'sub_insight':
            taskObject.subCorrelationInsights[element.entities.sub_task_index] = element
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
    min-width: 200px;
  }

  .key-result-viewer {
    min-width: calc(100% - 200px);
    padding-left: 24px;
  }

  .key-result-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>
