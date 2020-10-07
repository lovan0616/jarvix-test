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
        v-if="resultInfo.canDoList.length > 0" 
        slot="multiAnalyPanel"
      >
        <ul class="multi-analysis__list">
          <li
            :class="{'is-active': activeTab === intentType.OVERVIEW}"
            class="multi-analysis__item"
            @click="clickTab(intentType.OVERVIEW)"
          >
            <span class="multi-analysis__item-label">
              <svg-icon icon-class="basic-info"/>
              資料概況
            </span>
            <div class="multi-analysis__item-status">
              <spinner 
                v-if="isProcessing[intentType.OVERVIEW]" 
                size="16"/>
              <div
                v-else-if="!tempResultId[intentType.OVERVIEW]"
                @click="fetchSpecificType(intentType.OVERVIEW)">
                <svg-icon icon-class="trigger-analysis"/>
              </div>
            </div>
          </li>
          <li
            v-if="resultInfo.canDoList.indexOf(intentType.CLUSTERING) >= 0"
            :class="{'is-active': activeTab === intentType.CLUSTERING}"
            class="multi-analysis__item"
            @click="clickTab(intentType.CLUSTERING)"
          >
            <span
              :class="{'is-disabled': !tempResultId[intentType.CLUSTERING]}"
              class="multi-analysis__item-label"
            >
              <svg-icon icon-class="clustering"/>
              分群分析
            </span>
            <div class="multi-analysis__item-status">
              <spinner 
                v-if="isProcessing[intentType.CLUSTERING]" 
                size="16"/>
              <div
                v-else-if="hasFetchedClustering"
                class="multi-analysis__item-dropdownlist"
              >
                <svg-icon icon-class="more"/>
                <dropdown-select
                  :bar-data="barData"
                  class="dropdown"
                  @switchDialogName="switchDialogName"
                />
              </div>
              <div
                v-else
                @click="fetchSpecificType(intentType.CLUSTERING)">
                <svg-icon icon-class="trigger-analysis"/>
              </div>
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
import { intentType } from '@/utils/general'
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
    intent: {
      type: String,
      default: null
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
        OVERVIEW: false,
        CLUSTERING: false
      },
      tempResultId: {
        OVERVIEW: null,
        CLUSTERING: null
      },
      activeTab: null,
      isShowSaveClusteringDialog: false,
      intentType,
    }
  },
  computed: {
    ...mapState('result', ['currentResultId']),
    barData () {
      return [
        { title:'儲存分群結果為欄位',
          icon: 'feature',
          dialogName: 'saveClustering',
          disabled: this.resultInfo.isJoinTable || this.hasSavedClustering
        },
      ]
    },
    hasFetchedClustering () {
      return this.intent === this.intentType.CLUSTERING || this.tempResultId.CLUSTERING
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
  mounted () {
    this.tempResultId[this.intent] = this.resultId
    this.activeTab = this.intent
  },
  methods: {
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    },
    fetchSpecificType (type) {
      if (Object.values(this.isProcessing).some(item => item)) return
      this.isProcessing[type] = true
      this.$store.dispatch('chatBot/askSpecificType', {
        resultId: this.currentResultId,
        type: type.toLowerCase()
      })
        .then(() => {
          // MOCK DATA
          const resultId = this.tempResultId[type] || this.currentResultId - 2000
          this.isProcessing[type] = false
          this.tempResultId[type] = resultId
          setTimeout(() => {
            this.activeTab = this.intentType[type]
            this.$emit('fetch-new-components-list', resultId)
          }, 3 * 1000)
        })
    },
    clickTab (tabName) {
      if (this.activeTab === this.intentType[tabName]) return
      if (!this.tempResultId[tabName]) return
      this.activeTab = this.intentType[tabName]
      this.isProcessing[tabName] = true
      setTimeout(() => {
        this.$emit('fetch-new-components-list', this.tempResultId[tabName])
      }, 3 * 1000)
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