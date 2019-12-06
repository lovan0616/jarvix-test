<template>
  <div class="result-board-container">
    <div class="result-board">
      <div class="board-header">
        <div class="header-block">
          <slot name="PageResultBoardHeader"></slot>
        </div>
        <div class="pin-button-block"
          v-if="isPinboardPage"
        >
          <a class="head-btn share"
            href="javascript:void(0)"
            @click="showShare"
          >
            <svg-icon icon-class="share" class="icon"></svg-icon>{{ $t('button.share') }}
            <share-dialog
              v-if="isShowShareDialog"
              :share-url="shareUrl"
              @cancel="closeShareDialog"
            ></share-dialog>
          </a>
          <a class="head-btn delete"
            href="javascript:void(0)"
            @click="showDelete"
          >
            <svg-icon icon-class="delete" class="icon"></svg-icon>{{ $t('button.delete') }}
          </a>
        </div>
        <div class="pin-button-block"
          v-else
        >
          <a class="pin-button"
            :class="{'is-pinned': pinStatus, 'is-loading': isLoading}"
            href="javascript:void(0)"
            @click="pinToBoard"
            @mouseover="isMouseoverPinButton = true"
            @mouseleave="isMouseoverPinButton = false"
            :data-text="pinButtonText"
          >
            <span class="pin-slash"><svg-icon :icon-class="isLoading  ? 'spinner' : 'pin'" class="pin-icon"></svg-icon></span>
          </a>
          <pinboard-dialog
            v-if="showPinboardList"
            @pin="selectPinboard"
            @close="closePinboardList"
          ></pinboard-dialog>
        </div>
      </div>
      <slot name="PageResultBoardBody"></slot>
      <slot name="RootCauseResultBoardBody"></slot>
    </div>
    <div class="related-question-block"
      v-if="$slots.RelatedQuestions"
    >
      <div class="block-title">{{ $t('resultDescription.relatedQuestion') }}</div>
      <div class="related-question-list">
        <slot name="RelatedQuestions"></slot>
      </div>
    </div>

    <writing-dialog
      v-if="isShowShare"
      :title="$t('button.shareLink')"
      :button="$t('button.copy')"
      @closeDialog="closeShare"
      @confirmBtn="confirmShare"
      :showBoth="false"
    >
      <input type="text" class="input pinboard-name-input" :value="shareUrl" ref="shareInput">
    </writing-dialog>
    <decide-dialog
      v-if="isShowDelete"
      :title="`${confirmDeleteText} ${resultInfo.tasks[0].entities.question}？`"
      :type="'delete'"
      @closeDialog="closeDelete"
      @confirmBtn="confirmDelete"
    >
    </decide-dialog>

  </div>
</template>
<script>
import PinboardDialog from './PinboradDialog'
import ShareDialog from '@/pages/pinboard/components/ShareDialog'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import { Message } from 'element-ui'

export default {
  name: 'ResultBoard',
  components: {
    PinboardDialog,
    ShareDialog,
    DecideDialog,
    WritingDialog
  },
  props: {
    resultInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isPinned: false,
      isLoading: false,
      pinBoardId: null,
      showPinboardList: false,
      isShowShareDialog: false,
      isMouseoverPinButton: false,
      isShowDelete: false,
      isShowShare: false,
      confirmDeleteText: this.$t('editing.confirmDelete')
    }
  },
  mounted () {
    // Pinboard 頁預設全都是 pin 完的狀態
    if (this.isPinboardPage) {
      this.pinBoardId = this.$parent.$attrs.id
    }
  },
  methods: {
    pinToBoard () {
      if (this.isLoading) return false
      if (this.isPinned) {
        this.isLoading = true

        this.$store.dispatch('pinboard/unPinById', this.pinBoardId)
          .then(res => {
            if (this.isPinboardPage) {
              // 這邊是為了 transition 所以先抓高度
              let elem = document.getElementById(this.pinBoardId)
              elem.style.height = elem.offsetHeight + 'px'
              window.setTimeout(() => {
                elem.style.height = 0
                elem.style.overflow = 'hidden'
                elem.style.padding = 0
                elem.style.margin = 0
              }, 300)
              window.setTimeout(() => {
                this.isLoading = false
                this.$store.commit('pinboard/unPinById', this.pinBoardId)
              }, 900)
            } else {
              this.isLoading = false
              this.pinBoardId = null
            }
            // 更新 pinned 狀態
            this.updatePinnedStatus()
          }).catch(() => {
            this.isLoading = false
          })
      } else {
        if (this.showPinboardList) {
          this.showPinboardList = false
          return false
        }
        // 取得最新的 pinboardList
        this.$store.dispatch('pinboard/getPinboardList').then(() => {
          this.showPinboardList = true
        })
      }
    },
    selectPinboard (id) {
      this.isLoading = true
      this.$store.dispatch('pinboard/pinToBoard', {id, report: this.resultInfo})
        .then(res => {
          this.pinBoardId = res
          this.updatePinnedStatus()
          this.isLoading = false
          this.showPinboardList = false
        }).catch(() => {
          this.isLoading = false
          this.showPinboardList = false
        })
    },
    updatePinnedStatus () {
      this.isPinned = !this.isPinned
    },
    closePinboardList () {
      this.showPinboardList = false
    },
    unPin () {
      this.$store.dispatch('pinboard/unPinById', this.pinBoardId)
        .then(res => {
          if (this.isPinboardPage) {
            // 這邊是為了 transition 所以先抓高度
            let elem = document.getElementById(this.pinBoardId)
            elem.style.height = elem.offsetHeight + 'px'
            window.setTimeout(() => {
              elem.style.height = 0
              elem.style.overflow = 'hidden'
              elem.style.padding = 0
              elem.style.margin = 0
            }, 300)
            window.setTimeout(() => {
              this.isLoading = false
              this.$store.commit('pinboard/unPinById', this.pinBoardId)
            }, 900)
          } else {
            this.isLoading = false
            this.pinBoardId = null
          }
        }).catch(() => {
          this.isLoading = false
        })
    },
    showShareDialog () {
      this.isShowShareDialog = true
    },
    closeShareDialog () {
      this.isShowShareDialog = false
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
        duration: 3 * 1000
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
    }
  },
  computed: {
    pinButtonText () {
      if (this.isLoading) return this.$t('button.processing')
      if (this.isPinned && !this.isMouseoverPinButton) return this.$t('button.pinned')
      if (this.isPinned && this.isMouseoverPinButton) return this.$t('button.cancelPinned')
      return this.$t('button.pinToBoard')
    },
    isPinboardPage () {
      return this.$route.name === 'PagePinboard'
    },
    pinStatus () {
      // 目前 pinboard 頁，只會有 pinned 的狀態
      return this.isPinned || this.$route.name === 'PagePinboard'
    },
    pinboardList () {
      return this.$store.state.pinboard.pinboardList
    },
    shareUrl () {
      return `${window.location.origin}/result?question=${this.resultInfo.tasks[0].entities.question}&stamp=${new Date().getTime()}&dataSourceId=${this.resultInfo.tasks[0].entities.bookmark_id}&action=share`
    },
    hasFilter () {
      return this.$store.state.dataSource.filterList.length > 0
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board {
  background: rgba(0, 0, 0, 0.35);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 48px;

  .board-header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 28px;
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 8px 8px 0 0;
  }

  .header-block {
    flex: 1;
  }

  .pin-button-block {
    position: relative;

    .head-btn {
      position: relative;
      font-size: 14px;
      line-height: 26px;
      color: $theme-text-color;
      padding: 4px 12px;
      border-radius: 4px;

      &.share {
        background-color: #1EB8C7;
        margin-right: 12px;
      }
      &.delete {
        border: 1px solid #fff;
      }

      &:hover {
        background-color: #63cbd5;
        color: #fff;
      }

      .icon {
        margin-right: 8px;
      }
    }
  }

  .pin-button {
    display: flex;
    align-items: center;
    height: 32px;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.02em;
    color: $theme-color-primary;
    background-color: rgba(255, 255, 255, 0.16);
    padding: 15px 12px;
    border-radius: 4px;
    transition: all 0.3s;

    &:after {
      content: attr(data-text);
    }

    &:hover {
      background-color: #63cbd5;
      color: #fff;
    }

    &.is-loading {
      cursor: not-allowed;
      min-width: 120px;
      background: $theme-color-primary;
      opacity: 0.5;
      color: #fff;
      padding-left: 15px;
    }

    &.is-pinned:not(.is-loading) {
      min-width: 100px;
      background: #57B4BD;
      color: #fff;
      padding-left: 15px;
      transition: all 0.3s;

      &:hover {
        background-color: #67888E;

        // unpin icon 的斜線
        .pin-slash {
          position: relative;

          &:before {
            display: block;
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 16px;
            height: 12px;
            border-bottom: 1px solid #fff;
            transform-origin: bottom center;
            transform: rotateZ(-45deg) scale(1.2);
          }
        }
      }
    }

    .pin-icon {
      font-size: 16px;
      margin-right: 9px;
    }
  }
}
.related-question-block {
  background-color: rgba(0, 0, 0, 0.35);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 28px 28px 4px;

  .block-title {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 18px;
  }

  .related-question-list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
<style lang="scss">
.related-question-list {
  .result-board {
    width: 32%;

    &::before {
      content: '';
      width: 100%;
      height: 5px;
      background-color: #4DE2F0;
      border-radius: 5px 5px 0px 0px;
    }

    &:not(:nth-child(3n)) {
      margin-right: 2%;
    }
  }
}
</style>
