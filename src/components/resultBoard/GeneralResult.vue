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
        v-if="resultInfo.canClustering" 
        slot="multiAnalyPanel"
      >
        <ul class="multi-analysis__list">
          <li :class="['multi-analysis__item', 'is-default-active', 'is-active']">
            <spinner 
              v-if="isProcessing.overview" 
              size="16"/>
            <svg-icon 
              v-else 
              icon-class="basic-info"/>
            <span 
              class="multi-analysis__item-label" 
              @click="fetchOverview">概況分析</span>
          </li>
          <li class="multi-analysis__item">
            <spinner 
              v-if="isProcessing.clustering" 
              size="16"/>
            <svg-icon 
              v-else 
              icon-class="clustering"/>
            <span 
              class="multi-analysis__item-label" 
              @click="fetchClustering">分群分析</span>
            <div class="multi-analysis__item-dropdownlist">
              <svg-icon icon-class="more"/>
              <dropdown-select
                :bar-data="barData"
                class="dropdown"
                @switchDialogName="switchDialogName"
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
          v-for="componentId in resultInfo.key_result"
          :key="componentId"
          :component-id="componentId"
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
            v-for="componentId in resultInfo.general_insight"
            :key="componentId"
            :component-id="componentId"
            intend="general_insight"
          />
        </template>
        <template v-if="resultInfo.correlation_insight && resultInfo.correlation_insight.length > 0">
          <task
            v-for="componentId in resultInfo.correlation_insight"
            :key="componentId"
            :component-id="componentId"
            intend="correlation_insight"
          />
        </template>
      </template>
      <template 
        v-if="resultInfo.recommended_insight && resultInfo.recommended_insight.length > 0"
        slot="InsightRecommended">
        <recommended-insight 
          v-for="componentId in resultInfo.recommended_insight" 
          :key="componentId"
          :component-id="componentId"
        />
      </template>
    </result-board-body>
    <template slot="dialogs">
      <save-clustering-dialog
        v-show="isShowSaveClusteringDialog"
        :data-frame-alias="transcript.dataFrame.dataFrameAlias"
        :result-id="tempResultId.clustering"
        @close="isShowSaveClusteringDialog = false"
      />
    </template>
  </result-board>
</template>
<script>
import RecommendedInsight from '@/components/display/RecommendedInsight'
import DropdownSelect from '@/components/select/DropdownSelect'
import SaveClusteringDialog from '@/components/dialog/SaveClusteringDialog'

import { mapState } from 'vuex'

export default {
  name: 'GeneralResult',
  components: {
    RecommendedInsight,
    DropdownSelect,
    SaveClusteringDialog
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
    transcript: {
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
      currentResultInfo: null,
      isProcessing: {
        overview: false,
        clustering: false
      },
      tempResultId: {
        clustering: 0
      },
      hasSavedClustering: false,
      isShowSaveClusteringDialog: false
    }
  },
  computed: {
    ...mapState('result', ['currentResultId']),
    barData () {
      return [
        { title:'儲存分群結果為欄位',
          icon: 'feature',
          dialogName: 'saveClustering',
          disabled: !this.resultInfo.canSaveResult || this.hasSavedClustering
        },
      ]
    }
  },
  watch: {
    resultInfo: {
      deep: true,
      handler () {
        for (const key in this.isProcessing) {
          this.isProcessing[key] = false
        }
      }
    }
  },
  methods: {
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    },
    fetchOverview () {
      if (Object.values(this.isProcessing).some(item => item)) return
      this.$store.dispatch('chatBot/askOverview', this.currentResultId)
        .then(() => {
          // MOCK DATA
          const resultId = this.currentResultId - 2000
          this.isProcessing.overview = true
          this.tempResultId.overview = resultId
          setTimeout(() => {
            this.$emit('fetch-new-components-list', resultId)
          }, 3 * 1000)
        })
    },
    fetchClustering () {
      if (Object.values(this.isProcessing).some(item => item)) return
      this.$store.dispatch('chatBot/askClustering', this.currentResultId)
        .then(() => {
          // MOCK DATA
          const resultId = this.currentResultId - 2000
          this.isProcessing.clustering = true
          this.tempResultId.clustering = resultId
          setTimeout(() => {
            this.$emit('fetch-new-components-list', resultId)
          }, 3 * 1000)
        })
    },
    switchDialogName (action) {
      if (action === 'saveClustering') this.isShowSaveClusteringDialog = true
    }
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