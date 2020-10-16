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
        v-if="currentResultId && resultInfo.canDoList.length > 0" 
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
              {{ $t('clustering.dataOverview') }}
            </span>
            <div class="multi-analysis__item-status">
              <spinner 
                v-if="isProcessing[intentType.OVERVIEW]" 
                size="16"/>
            </div>
          </li>
          <li
            :class="{'is-active': activeTab === intentType.CLUSTERING}"
            class="multi-analysis__item"
            @click="clickTab(intentType.CLUSTERING)"
          >
            <span class="multi-analysis__item-label">
              <svg-icon icon-class="clustering"/>
              {{ $t('clustering.clusteringAnalysis') }}
            </span>
            <div class="multi-analysis__item-status">
              <spinner 
                v-if="isProcessing[intentType.CLUSTERING]" 
                size="16"/>
              <div
                v-else-if="hasFetchedClustering"
                class="multi-analysis__item-dropdownlist"
              >
                <svg-icon 
                  icon-class="more"
                  class="more-icon" />
                <dropdown-select
                  :bar-data="barData"
                  class="dropdown"
                  @switchDialogName="switchDialogName"
                />
              </div>
            </div>
          </li>
        </ul>
      </template>
      <template  
        v-if="isShowInfo" 
        slot="PageResultBoardIndicator">
        <notify-info-block :msg="displayedInfo" />
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
        v-if="currentResultId && isShowSaveClusteringDialog"
        :data-frame-alias="transcript.dataFrame.dataFrameAlias"
        :result-id="cachedResultId[intentType.CLUSTERING]"
        @close="isShowSaveClusteringDialog = false"
      />
    </template>
  </result-board>
</template>
<script>
import RecommendedInsight from '@/components/display/RecommendedInsight'
import DropdownSelect from '@/components/select/DropdownSelect'
import SaveClusteringDialog from '@/components/dialog/SaveClusteringDialog'
import { Message } from 'element-ui'
import { intentType } from '@/utils/general'
import { mapState } from 'vuex'
import NotifyInfoBlock from '@/components/display/NotifyInfoBlock'

export default {
  name: 'GeneralResult',
  components: {
    RecommendedInsight,
    DropdownSelect,
    SaveClusteringDialog,
    NotifyInfoBlock
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
      isProcessing: {
        OVERVIEW: false,
        CLUSTERING: false
      },
      cachedResultId: {
        OVERVIEW: null,
        CLUSTERING: null
      },
      activeTab: null,
      isShowSaveClusteringDialog: false,
      intentType
    }
  },
  computed: {
    ...mapState('result', ['currentResultId']),
    barData () {
      return [
        {
          title: 'clustering.saveClusteringResultAsColumn',
          icon: 'feature',
          dialogName: 'saveClustering'
        },
      ]
    },
    hasFetchedClustering () {
      return this.intent === this.intentType.CLUSTERING || this.cachedResultId.CLUSTERING
    },
    isShowInfo () {
      const intentsWithInfo = ['CLUSTERING']
      return intentsWithInfo.includes(this.intent)
    },
    displayedInfo () {
      if (!this.isShowInfo) return
      switch (this.intent) {
        case 'CLUSTERING': 
        return this.$t('editing.resultOverSizeMessage')
      }
    }
  },
  watch: {
    'resultInfo.key_result' () {
      this.clearAllProcessingStatus()
    }
  },
  mounted () {
    if (this.currentResultId) {
      this.cachedResultId[this.intent] = this.currentResultId
      this.activeTab = this.intent
    }
  },
  methods: {
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    },
    fetchSpecificType (type) {
      // 有資料正在 fetching 則擋掉
      if (Object.values(this.isProcessing).some(item => item)) return
      // 已經拿過 result id 就重複使用
      if (this.cachedResultId[type]) {
        this.isProcessing[type] = true
        this.activeTab = this.intentType[type]
        this.$store.commit('result/updateCurrentResultId', this.cachedResultId[type])
        this.$emit('fetch-new-components-list', this.cachedResultId[type])
        return
      }

      this.isProcessing[type] = true
      this.$store.dispatch('chatBot/askSpecificType', {
        resultId: this.currentResultId,
        type: type.toLowerCase()
      })
        .then(({ resultId }) => {
          this.isProcessing[type] = false
          this.cachedResultId[type] = resultId
          this.activeTab = this.intentType[type]
          this.$store.commit('result/updateCurrentResultId', resultId)
          this.$emit('fetch-new-components-list', resultId)
        })
        .catch(() => {
          this.clearAllProcessingStatus()
        })
    },
    clickTab (tabName) {
      if (this.activeTab === this.intentType[tabName]) return
      this.fetchSpecificType(tabName)
    },
    switchDialogName (action) {
      if (action !== 'saveClustering') return
      if (!this.resultInfo.canSaveResult) {
        return Message({
          message: this.$t('clustering.reasonsOfnotAllowedToSaveClusteringResultAsColumn'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }
      this.isShowSaveClusteringDialog = true
    },
    clearAllProcessingStatus () {
      for (const key in this.isProcessing) {
        this.isProcessing[key] = false
      }
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
  .task {
    padding-top: 30px;
    &:first-child {
      padding-top: 40px;
    }
  }
}
</style>