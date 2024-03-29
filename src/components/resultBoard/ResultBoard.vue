<template>
  <div class="result-board-container">
    <div
      :id="pinBoardId"
      :class="{'has-filter': hasFilter}"
      class="result-board"
    >
      <div class="board-header">
        <div class="header-block">
          <!-- 這邊要注意因為 pinboard 會有舊的 segmentation -->
          <result-board-header
            v-if="segmentationPayload.question"
            :title="segmentationPayload.question"
            :segmentation="segmentationPayload"
          />
          <question-name
            v-else
            :question-segmentation="segmentationPayload"
            class="result-board__header"
          />
        </div>
        <button
          v-if="!isPinboardPage"
          class="btn-m btn-default download-button"
          @click="downloadResult"
        >
          <svg-icon
            :icon-class="isDownloading ? 'spinner' : 'download'"
            class="icon"
          />
          {{ $t('button.downloadPage') }}
        </button>
        <div
          v-if="isPinboardPage"
          class="pin-button-block"
        >
          <button
            class="btn-m btn-default"
            @click="askPinboardTitleQuestion"
          >
            <svg-icon
              icon-class="len-with-line-chart"
              class="icon icon-ask-jarvix"
            />{{ $t('pinboard.intelligentAnalysis') }}
          </button>
          <button
            class="btn-m btn-default"
            @click.stop.prevent="togglePinboardInfo"
          >
            <svg-icon
              icon-class="data-explanation"
              class="icon"
            />{{ $t('button.dataExplanation') }}
          </button>
          <button
            :disabled="isRefreshing"
            class="btn-m btn-default"
            @click.stop.prevent="refreshData"
          >
            <svg-icon
              :icon-class="isRefreshing ? 'spinner' : 'refresh'"
              class="icon"
            />{{ $t('button.dataUpdate') }}
          </button>
          <pinboard-info-dialog
            v-if="isShowPinboardInfo"
            :result-id="resultId"
            :filter-info="restrictions"
            @close="closePinboardInfo"
          />
          <button class="hover-box">
            <svg-icon
              icon-class="more"
              class="icon more-icon"
            />
            <div class="pinboard-popup hover-box__popup">
              <div
                class="popup-box"
                @click.stop="showShare"
              >
                <svg-icon
                  icon-class="share"
                  class="icon popup-icon"
                />
                <div class="popup-text">
                  {{ $t('button.share') }}
                </div>
              </div>

              <div
                class="popup-box border-line"
                @click.stop="downloadResult"
              >
                <svg-icon
                  :icon-class="isDownloading ? 'spinner' : 'download'"
                  class="icon popup-icon"
                />
                <div class="popup-text">
                  {{ $t('button.downloadPage') }}
                </div>
              </div>
              <div
                class="popup-box"
                @click.stop="showDelete"
              >
                <svg-icon
                  icon-class="delete"
                  class="icon popup-icon"
                />
                <div class="popup-text">
                  {{ $t('button.delete') }}
                </div>
              </div>
            </div>
          </button>
        </div>
        <div
          v-else-if="$route.name === 'PageResult'"
        >
          <button
            class="btn-m btn-default pin-button"
            @click="pinToBoard"
          >
            <span class="pin-slash"><svg-icon
              :icon-class="isLoading ? 'spinner' : 'pin'"
              class="icon"
            /></span>
            {{ showAddToWarRoomButton ? $t('button.pinToBoard') + ' / ' + $t('button.warRoom') : $t('button.pinToBoard') }}
          </button>
          <pinboard-dialog
            v-if="showPinboardDialog"
            :is-war-room-addable="showAddToWarRoomButton"
            @pin="selectPinboard"
            @pinToWarRoom="pinToWarRoom"
            @close="closePinboardDialog"
          />
        </div>
      </div>
      <slot name="PageResultBoardBody" />
      <slot name="RootCauseResultBoardBody" />
    </div>

    <writing-dialog
      v-if="isShowShare"
      :title="$t('button.shareLink')"
      :button="$t('button.copy')"
      :show-both="false"
      @closeDialog="closeShare"
      @confirmBtn="confirmShare"
    >
      <input
        ref="shareInput"
        :value="shareUrl"
        type="text"
        class="input pinboard-name-input"
      >
    </writing-dialog>
    <decide-dialog
      v-if="isShowDelete"
      :title="`${$t('editing.confirmDelete')} ${questionName}？`"
      :type="'delete'"
      @closeDialog="closeDelete"
      @confirmBtn="confirmDelete"
    />
    <decide-dialog
      v-if="isShowConfimAccountSwitch"
      :title="$t('pinboard.reminding')"
      :content="$t('pinboard.switchAccountReminding', { accountName: pinboardAccountName })"
      :btn-text="$t('button.confirm')"
      type="delete"
      @closeDialog="isShowConfimAccountSwitch = false"
      @confirmBtn="confirmOpenJarviX"
    />
    <slot name="dialogs" />
  </div>
</template>
<script>
import ResultBoardHeader from './ResultBoardHeader'
import QuestionName from './QuestionName'
import PinboardDialog from './PinboradDialog'
import ShareDialog from '@/pages/pinboard/components/ShareDialog'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import PinboardInfoDialog from '@/pages/pinboard/components/filter/PinboardInfoDialog'
import { addResultToWarRoomPool } from '@/API/WarRoom'
import { refreshResult } from '@/API/NewAsk'
import { Message } from 'element-ui'
import { mapState, mapGetters } from 'vuex'
import { toPng } from 'html-to-image'
import * as download from 'downloadjs'
import { isEnOrEnum } from '@/utils/general'

export default {
  name: 'ResultBoard',
  components: {
    ResultBoardHeader,
    QuestionName,
    PinboardDialog,
    ShareDialog,
    DecideDialog,
    WritingDialog,
    PinboardInfoDialog
  },
  props: {
    resultId: {
      type: Number,
      default: null
    },
    resultInfo: {
      type: Object,
      default: () => {}
    },
    restrictions: {
      type: Array,
      default: () => []
    },
    segmentationPayload: {
      type: Object,
      default: () => null
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
  data () {
    return {
      isLoading: false,
      isDownloading: false,
      isRefreshing: false,
      pinBoardId: null,
      dataSourceId: null,
      dataFrameId: null,
      showPinboardDialog: false,
      isShowDelete: false,
      isShowShare: false,
      isShowPinboardInfo: false,
      isShowConfimAccountSwitch: false
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission', 'getCurrentAccountId']),
    ...mapState('userManagement', ['accountList']),
    isPinboardPage () {
      return this.$route.name === 'PersonalPagePinboard' || this.$route.name === 'ProjectPagePinboard'
    },
    questionName () {
      let boardHeader = this.$children.filter(element => element.componentName === 'ResultBoardHeader')[0]
      return boardHeader ? boardHeader.componentData.title : ''
    },
    shareUrl () {
      return `${window.location.origin}/share-result/${this.resultId}`
    },
    hasFilter () {
      return (this.$store.state.dataFrameAdvanceSetting.filterList.length > 0 && this.$route.name === 'PageResult') || this.restrictions.length > 0
    },
    currentResultId () {
      return this.$store.state.result.currentResultId
    },
    accountId () {
      return this.$route.params.account_id
    },
    isPersonalPinboard () {
      return this.$route.name === 'PersonalPagePinboardList'
    },
    showAddToWarRoomButton () {
      return this.isWarRoomAddable && this.hasPermission('war_room')
    },
    question () {
      return this.segmentationPayload.sentence.reduce((acc, cur, index) => {
        let currentWord = cur.word
        return acc + ((index !== 0 && isEnOrEnum(currentWord)) ? ` ${currentWord}` : currentWord)
      }, '')
    },
    pinboardAccountName () {
      const pinboardAccount = this.accountList.find(item => item.id === this.pinboardAccountId)
      return pinboardAccount ? pinboardAccount.name : null
    }
  },
  mounted () {
    // Pinboard 頁預設全都是 pin 完的狀態
    if (this.isPinboardPage) {
      this.pinBoardId = this.$parent.$attrs['data-pinboard-id']
      this.dataSourceId = this.$parent.$attrs['data-data-source-id']
      this.dataFrameId = this.$parent.$attrs['data-data-frame-id']
    }
  },
  methods: {
    downloadResult () {
      if (this.isDownloading) return
      this.isDownloading = true
      const node = this.$el
      const fileName = this.question

      const excludeNode = node => node.tagName !== 'BUTTON'
      toPng(node, { filter: excludeNode })
        .then(dataUrl => {
          this.isDownloading = !download(dataUrl, fileName)
        })
        .catch(() => {})
    },
    refreshData () {
      this.isRefreshing = true
      refreshResult({ askResultId: this.resultId, isFilter: false })
        .then(res => {
          let promise = new Promise(resolve => this.$emit('refresh', { resolveFunction: resolve, pinBoardId: this.pinBoardId }))
          promise.then(() => {
            this.isRefreshing = false
          })
        })
        .catch(() => {
          this.isRefreshing = false
        })
    },
    pinToBoard () {
      if (this.isLoading) return false
      if (this.showPinboardDialog) {
        this.showPinboardDialog = false
        return false
      }
      setTimeout(() => {
        this.showPinboardDialog = true
      })
    },
    selectPinboard (id) {
      this.isLoading = true
      this.$store.dispatch('pinboard/pinToBoard', { folderId: id, resultId: this.currentResultId })
        .then(res => {
          this.pinBoardId = res.id
          this.isLoading = false
          this.showPinboardDialog = false
          Message({
            message: this.$t('message.pinboardSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        }).catch(() => {
          this.isLoading = false
          this.showPinboardDialog = false
        })
    },
    pinToWarRoom (id) {
      this.isLoading = true
      addResultToWarRoomPool(id, this.currentResultId)
        .then(() => {
          this.isLoading = false
          this.closePinboardDialog()
          Message({
            message: this.$t('message.successfullyAddedToWarRoom'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        }).catch(() => {
          this.isLoading = false
          this.showPinboardDialog = false
        })
    },
    closePinboardDialog () {
      this.showPinboardDialog = false
    },
    unPin () {
      this.$store.dispatch('pinboard/unPinById', this.pinBoardId)
        .then(res => {
          if (this.isPinboardPage) {
            // 這邊是為了 transition 所以先抓高度
            let elem = document.getElementById(this.pinBoardId)
            elem.style.height = elem.offsetHeight + 'px'
            elem.style.height = 0
            elem.style.overflow = 'hidden'
            elem.style.padding = 0
            elem.style.margin = 0
            window.setTimeout(() => {
              this.isLoading = false
              this.$store.commit('pinboard/deletePinboardById', { accountId: this.accountId, id: this.pinBoardId })
            }, 900)
            this.$emit('unPin', this.pinBoardId)
          } else {
            this.isLoading = false
            this.pinBoardId = null
          }
        }).catch(() => {
          this.isLoading = false
        })
    },
    confirmShare () {
      let input = this.$refs.shareInput
      input.select()
      /* For mobile devices */
      input.setSelectionRange(0, 99999)
      document.execCommand('copy')

      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
      this.$nextTick(() => {
      })
    },
    confirmDelete () {
      this.unPin()
      this.isShowDelete = false
    },
    showShare () {
      this.isShowShare = true
    },
    closeShare () {
      this.isShowShare = false
    },
    showDelete () {
      this.isShowDelete = true
    },
    closeDelete () {
      this.isShowDelete = false
    },
    togglePinboardInfo () {
      this.isShowPinboardInfo = !this.isShowPinboardInfo
    },
    closePinboardInfo () {
      this.isShowPinboardInfo = false
    },
    askPinboardTitleQuestion () {
      if (this.pinboardAccountId !== this.getCurrentAccountId) {
        this.isShowConfimAccountSwitch = true
        return
      }
      this.openJarviX()
    },
    confirmOpenJarviX () {
      this.isShowConfimAccountSwitch = false
      this.openJarviX()
    },
    openJarviX () {
      window.open(`${location.origin}/account/${this.pinboardAccountId}/group/${this.pinboardGroupId}/result?question=${this.question}&stamp=${new Date().getTime()}&dataSourceId=${this.dataSourceId}&dataFrameId=${this.dataFrameId}&action=click_pinboard`)
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board {
  background: rgb(0, 0, 0);
  border: 1px solid $theme-border-color;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);

  .board-header {
    align-items: center;
    background-color: rgba(35, 61, 64, 0.6);
    border-bottom: 1px solid $theme-border-color;
    display: flex;
    padding: 20px 28px;
    position: relative;
    z-index: 2;
  }

  &__header {
    ::v-deep .question-name {
      font-size: 30px;
      line-height: 38px;
    }
  }

  .header-block {
    flex: 1;
  }

  .pin-button-block {
    align-items: center;
    display: flex;

    .head-btn {
      background-color: transparent;
      color: $theme-text-color;

      &.delete {
        border: 1px solid #fff;
      }

      &:hover {
        background-color: $theme-color-primary;
        color: #fff;
      }
    }

    .btn-default {
      margin-right: 11px;

      .icon {
        margin-right: 6px;
      }
    }

    .hover-box {
      align-items: center;
      background-color: $button-color;
      border: none;
      border-radius: 4px;
      display: flex;
      height: 30px;
      justify-content: center;
      position: relative;
      width: 42px;

      &__popup {
        top: 30px;

        &::before {
          border-bottom: 10px solid #233131;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          content: '';
          height: 0;
          position: absolute;
          right: 30px;
          top: -10px;
          width: 0;
        }

        &::after {
          display: none;
        }
      }

      &:hover {
        .more-icon {
          color: #444;
        }

        .hover-box__popup {
          visibility: visible;
        }
      }

      .more-icon {
        color: $theme-color-white;
        transform: rotate(90deg);
      }
    }
  }

  .download-button {
    margin-right: 11px;
  }
}
</style>
