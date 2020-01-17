<template>
  <result-board
    :result-info="resultInfo"
  >
    <template slot="PageResultBoardHeader">
      <task
        :component-id="resultInfo.title[0]"
        intend="title"
      ></task>
    </template>
    <result-board-body slot="PageResultBoardBody">
      <template slot="PageResultBoardChart">
        <div class="key-result-wrapper">
          <div class="key-result-selector">
            <task
              :component-id="resultInfo.key_result_selector[0]"
              intend="key_result_selector"
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
                <task
                  v-if="resultInfo.sub_key_result[displayFactorIndex]"
                  v-bind:key="`sub-key-result-${displayFactorIndex}`"
                  :component-id="resultInfo.sub_key_result[displayFactorIndex]"
                  intend="sub_key_result"
                ></task>
              </keep-alive>
              <keep-alive>
                <task
                  v-if="resultInfo.sub_insight[displayFactorIndex]"
                  v-bind:key="`sub-insight-${displayFactorIndex}`"
                  :component-id="resultInfo.sub_insight[displayFactorIndex]"
                  intend="sub_insight"
                ></task>
              </keep-alive>
            </div>
          </div>
        </div>
      </template>
      <template slot="InsightBasicInfo">
        <task
          v-if="resultInfo.sub_basic_info[displayFactorIndex]"
          v-bind:key="`sub-basic-info-${displayFactorIndex}`"
          :component-id="resultInfo.sub_basic_info[displayFactorIndex]"
          intend="sub_basic_info"
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
      isLoading: true
    }
  },
  destroyed () {
    this.$store.commit('result/updateDisplayFactorIndex', 0)
  },
  mounted () {
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  methods: {
    onChangeCursor (cursor) {
      this.isLoading = true
      
      this.$nextTick(() => {
        this.isLoading = false
      })
    }
  },
  computed: {
    displayFactorIndex () {
      return this.$store.state.result.displayFactorIndex
    }
  },
  watch: {
    displayFactorIndex (value) {

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
