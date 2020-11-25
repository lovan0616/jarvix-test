<template>
  <result-board 
    :segmentation-payload="segmentationPayload"
    :result-id="resultId"
    :result-info="resultInfo"
    :restrictions="restrictions"
    :is-war-room-addable="isWarRoomAddable"
    :pinboard-group-id="pinboardGroupId"
    :pinboard-account-id="pinboardAccountId"
    class="general-result"
    @refresh="refreshPinboardData"
    @unPin="unPin"
  >
    <result-board-body slot="PageResultBoardBody">
      <template
        v-if="currentResultId && resultInfo.canDoList.length > 0" 
        slot="multiAnalyPanel"
      >
        <ul class="multi-analysis__list">
          <li
            v-for="(typeInfo, index) in switchTypeList"
            :key="typeInfo.denotation"
            :class="{ 'is-active': activeTab === typeInfo.denotation }"
            class="multi-analysis__item"
            @click="clickTab(typeInfo.denotation, index)"
          >
            <span class="multi-analysis__item-label">
              <svg-icon :icon-class="typeInfo.icon"/>
              {{ typeInfo.name }}
            </span>
            <div class="multi-analysis__item-status">
              <spinner 
                v-if="typeInfo.isProcessing" 
                size="16"/>
              <svg-icon 
                v-else-if="typeInfo.isFailed"
                class="exclamation-triangle-icon"
                icon-class="exclamation-triangle" />
              <div
                v-else-if="hasFetchedClustering(index)"
                class="multi-analysis__item-dropdownlist"
              >
                <svg-icon 
                  icon-class="more"
                  class="more-icon" />
                <dropdown-select
                  :bar-data="barData"
                  class="dropdown"
                  @switchDialogName="switchDialogName($event, typeInfo)"
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
          @failed="setTaskFailed"
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
          :key="resultInfo.basic_info[0]"
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
        :result-id="selectedTypeInfo.cachedResultId"
        @close="closeDialog"
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
    },
    pinboardGroupId: {
      type: Number,
      default: null
    },
    pinboardAccountId: {
      type: Number,
      default: null
    }
  },
  data: () => {
    return {
      activeTab: null,
      isShowSaveClusteringDialog: false,
      intentType,
      switchTypeList: [],
      selectedTypeInfo: null
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
    isShowInfo () {
      const intentsWithInfo = ['CLUSTERING']
      // 切分群時不會有 intent，所以從 active tab 取值
      return intentsWithInfo.includes(this.intent || this.activeTab)
    },
    displayedInfo () {
      if (!this.isShowInfo) return
      // 切分群時不會有 intent，所以從 active tab 取值
      switch (this.intent || this.activeTab) {
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
      this.activeTab = this.intent
      const OverViewIndex = this.resultInfo.canDoList.indexOf('OVERVIEW')
      if(OverViewIndex !== -1) this.resultInfo.canDoList.splice(0, 0, this.resultInfo.canDoList.splice(OverViewIndex, 1)[0])
      this.switchTypeList = this.resultInfo.canDoList.map(type => ({
        denotation: type,
        ...this.getSwitchTypeInfoList(type),
        isProcessing: false,
        cachedResultId: type === this.intent ? this.currentResultId : null,
        isFailed: false
      }))
    }
  },
  methods: {
    refreshPinboardData (refreshInfo) {
      this.$emit('refresh', refreshInfo)
    },
    unPin (pinBoardId) {
      this.$emit('unPin', pinBoardId)
    },
    fetchSpecificType (type, index) {
      // 有資料正在 fetching 則擋掉
      const isFetching = this.switchTypeList.some(typeInfo => typeInfo.isProcessing)
      if (isFetching) return

      const targetTypeInfo = this.switchTypeList[index]

      // 已經拿過 result id 就重複使用
      if (targetTypeInfo.cachedResultId) {
        targetTypeInfo.isProcessing = true
        this.activeTab = type
        this.$store.commit('result/updateCurrentResultId', targetTypeInfo.cachedResultId)
        this.$emit('fetch-new-components-list', targetTypeInfo.cachedResultId)
        return
      }

      targetTypeInfo.isProcessing = true
      this.$store.dispatch('chatBot/askSpecificType', {
        resultId: this.currentResultId,
        type: type
      })
        .then(({ resultId }) => {
          this.switchTypeList[index] = {
            ...targetTypeInfo,
            isProcessing: false,
            cachedResultId: resultId
          }
          this.activeTab = type
          this.$store.commit('result/updateCurrentResultId', resultId)
          this.$emit('fetch-new-components-list', resultId)
        })
        .catch(() => this.clearAllProcessingStatus())
    },
    clickTab (tabName, index) {
      if (this.activeTab === tabName) return
      this.fetchSpecificType(tabName, index)
    },
    switchDialogName (action, typeInfo) {
      if (action !== 'saveClustering') return
      if (!this.resultInfo.canSaveResult) {
        return Message({
          message: this.$t('clustering.reasonsOfnotAllowedToSaveClusteringResultAsColumn'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }
      this.selectedTypeInfo = typeInfo
      this.isShowSaveClusteringDialog = true
    },
    closeDialog () {
      this.isShowSaveClusteringDialog = false
      this.selectedTypeInfo = null
    },
    clearAllProcessingStatus () {
      this.switchTypeList.forEach(type => type.isProcessing = false)
    },
    hasFetchedClustering (index) {
      return this.switchTypeList[index].denotation === this.intentType.CLUSTERING && (this.intent === this.intentType.CLUSTERING || this.switchTypeList[index].cachedResultId)
    },  
    setTaskFailed () {
      this.switchTypeList.forEach((type, index) => { 
        if (type.denotation !== this.activeTab) return
        this.$set(this.switchTypeList, index, {
          ...type,
          isFailed: true
        })
      })
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
  .task[data-intend="key_result"] {
    padding-top: 30px;
  }
}
</style>