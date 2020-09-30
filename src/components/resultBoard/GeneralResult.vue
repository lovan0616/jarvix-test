<template>
  <result-board 
    :segmentation-payload="segmentationPayload"
    :result-id="resultId"
    :result-info="resultInfo"
    :restrictions="restrictions"
    :is-war-room-addable="isWarRoomAddable"
    class="general-result"
    @unPin="unPin"
  >
    <result-board-body slot="PageResultBoardBody">
      <template 
        v-if="hasMultiAnalysis" 
        slot="multiAnalyPanel"
      >
        <ul class="multi-analysis__list">
          <li class="multi-analysis__item" >
            <svg-icon icon-class="basic-info"/>
            <span 
              class="multi-analysis__item-label" 
              @click="fetchOverview">概況分析</span>
          </li>
          <li class="multi-analysis__item">
            <svg-icon icon-class="clustering"/>
            <span 
              class="multi-analysis__item-label" 
              @click="fetchClustering">分群分析</span>
            <div class="multi-analysis__item-dropdownlist">
              <svg-icon icon-class="more"/>
              <dropdown-select
                :bar-data="barData"
                class="dropdown"
              />
            </div>
          </li>
        </ul>
      </template>
      <template 
        v-if="resultInfo.key_result && resultInfo.key_result.length > 0"
        slot="PageResultBoardChart"
      >
        <task
          v-for="(chartTask, index) in resultInfo.key_result"
          :key="'chart-' + index"
          :component-id="chartTask"
          :data-frame-id="dataFrameId"
          intend="key_result"
        />
      </template>
      <template
        v-if="resultInfo.key_result && resultInfo.key_result.length === 0"
        slot="PageResultBoardChart"
      >
        <no-result
          :message="$t('message.emptyResult')"
          class="general-result--empty"
        />
      </template>
      <template slot="InsightBasicInfo">
        <task
          v-if="resultInfo.basic_info && resultInfo.basic_info.length > 0"
          :component-id="resultInfo.basic_info[0]"
          intend="basic_info"
        />
      </template>
      <template slot="InsightRootCause">
        <template v-if="resultInfo.general_insight && resultInfo.general_insight.length > 0">
          <task
            v-for="(otherTask, index) in resultInfo.general_insight"
            :key="'other-' + index"
            :component-id="otherTask"
            intend="general_insight"
          />
        </template>
        <template v-if="resultInfo.correlation_insight && resultInfo.correlation_insight.length > 0">
          <task
            v-for="(otherTask, index) in resultInfo.correlation_insight"
            :key="'other-' + index"
            :component-id="otherTask"
            intend="correlation_insight"
          />
        </template>
      </template>
      <template 
        v-if="resultInfo.recommended_insight && resultInfo.recommended_insight.length > 0"
        slot="InsightRecommended">
        <recommended-insight 
          v-for="(componentId, index) in resultInfo.recommended_insight" 
          :key="index"
          :component-id="componentId"
        />
      </template>
    </result-board-body>
  </result-board>
</template>
<script>
import RecommendedInsight from '@/components/display/RecommendedInsight'
import DropdownSelect from '@/components/select/DropdownSelect'

import { mapState } from 'vuex'

export default {
  name: 'GeneralResult',
  components: {
    RecommendedInsight,
    DropdownSelect
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
  data: () => {
    return {
      test: 0,
      currentResultInfo: null
    }
  },
  computed: {
    ...mapState('result', ['currentResultId']),
    // TODO 改成從 result info 拿
    hasMultiAnalysis () {
      return true
    },
    // TODO
    barData () {
      return [{ title:'儲存分群結果為欄位', icon: 'feature' }]
    }
  },
  methods: {
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    },
    fetchOverview () {
      // 拿現在的 result id 去交換 概況分析
      this.$store.dispatch('chatBot/askOverview', this.currentResultId)
        .then(resultId => {
          this.$store.commit('result/updateCurrentResultId', resultId)
          this.$emit('fetch-new-components-list')
        })
    },
    fetchClustering () {
      // 拿現在的 result id 去交換 分群分析
      this.$store.dispatch('chatBot/askClustering', this.currentResultId)
        .then(resultId => {
          this.$store.commit('result/updateCurrentResultId', resultId)
          this.$emit('fetch-new-components-list')
        })
    },
  }
}
</script>
<style lang="scss" scoped>
.general-result {
  &--empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>