<template>
  <div class="result-board-container">
    <div 
      :id="pinBoardId"
      :class="{'has-filter': hasFilter}"
      class="result-board"
    >
      <div class="board-header">
        <div class="header-block">
          <slot name="PageResultBoardHeader"/>
        </div>
        <div 
          v-if="isPinboardPage"
          class="pin-button-block"
        >
          <button 
            v-if="hasFilter"
            class="head-btn restrict"
            @click.stop.prevent="toggleFilterInfo"
          >
            {{ $t('button.restrict') }}
            <filter-info-dialog
              v-if="isShowFilterInfo"
              :filter-info="restrictions"
              @close="closeFilterInfo"
            />
          </button>
          <a 
            class="head-btn share"
            href="javascript:void(0)"
            @click="showShare"
          >
            <svg-icon 
              icon-class="share" 
              class="icon"/>{{ $t('button.share') }}
            <share-dialog
              v-if="isShowShareDialog"
              :share-url="shareUrl"
              @cancel="closeShareDialog"
            />
          </a>
          <a 
            class="head-btn delete"
            href="javascript:void(0)"
            @click="showDelete"
          >
            <svg-icon 
              icon-class="delete" 
              class="icon"/>{{ $t('button.delete') }}
          </a>
        </div>
        <div 
          v-else
          class="pin-button-block"
        >
          <a 
            class="pin-button"
            href="javascript:void(0)"
            @click="pinToBoard"
          >
            <span class="pin-slash"><svg-icon 
              :icon-class="isLoading ? 'spinner' : 'pin'" 
              class="pin-icon"/></span>
            {{ $t('button.pinToBoard') }}
          </a>
          <pinboard-dialog
            v-if="showPinboardList"
            @pin="selectPinboard"
            @close="closePinboardList"
          />
        </div>
      </div>
      <slot name="PageResultBoardBody"/>
      <slot name="RootCauseResultBoardBody"/>
    </div>
    <div 
      v-if="$slots.RelatedQuestions"
      class="related-question-block"
    >
      <div class="block-title">{{ $t('resultDescription.relatedQuestion') }}</div>
      <div class="related-question-list">
        <slot name="RelatedQuestions"/>
      </div>
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
        class="input pinboard-name-input">
    </writing-dialog>
    <decide-dialog
      v-if="isShowDelete"
      :title="`${$t('editing.confirmDelete')} ${questionName}？`"
      :type="'delete'"
      @closeDialog="closeDelete"
      @confirmBtn="confirmDelete"
    />
  </div>
</template>
<script>
import PinboardDialog from './PinboradDialog'
import ShareDialog from '@/pages/pinboard/components/ShareDialog'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import FilterInfoDialog from '@/pages/pinboard/components/filter/FilterInfoDialog'
import { Message } from 'element-ui'

export default {
  name: 'ResultBoard',
  components: {
    PinboardDialog,
    ShareDialog,
    DecideDialog,
    WritingDialog,
    FilterInfoDialog
  },
  props: {
    resultInfo: {
      type: Object,
      default: () => {}
    },
    restrictions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isLoading: false,
      pinBoardId: null,
      dataSourceId: null,
      dataFrameId: null,
      showPinboardList: false,
      isShowShareDialog: false,
      isShowDelete: false,
      isShowShare: false,
      isShowFilterInfo: false
    }
  },
  computed: {
    isPinboardPage () {
      return this.$route.name === 'PersonalPagePinboard' || this.$route.name === 'ProjectPagePinboard'
    },
    questionName () {
      let boardHeaderData = this.$children.filter(element => element.componentName === 'ResultBoardHeader')[0].componentData
      return boardHeaderData ? boardHeaderData.segmentation.question : ''
    },
    shareUrl () {
      return `${window.location.origin}/account/${this.accountId}/group/${this.accountId}/result?question=${this.questionName}&stamp=${new Date().getTime()}&dataSourceId=${this.dataSourceId}&dataFrameId=${this.dataFrameId}&action=share`
    },
    hasFilter () {
      return (this.$store.state.dataSource.filterList.length > 0 && this.$route.name === 'PageResult') || this.restrictions.length > 0
    },
    currentResultId () {
      return this.$store.state.result.currentResultId
    },
    accountId () {
      return this.$route.params.account_id
    },
    groupId () {
      return this.$route.params.group_id
    },
    isPersonalPinboard () {
      return this.$route.name === 'PersonalPagePinboardList'
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
    pinToBoard () {
      if (this.isLoading) return false
      if (this.showPinboardList) {
        this.showPinboardList = false
        return false
      }
      setTimeout(() => {
        this.showPinboardList = true
      })
    },
    selectPinboard (id) {
      this.isLoading = true
      this.$store.dispatch('pinboard/pinToBoard', {folderId: id, resultId: this.currentResultId, name: "", userId: 0})
        .then(res => {
          this.pinBoardId = res.id
          this.isLoading = false
          this.showPinboardList = false
          Message({
            message: this.$t('message.pinboardSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        }).catch(() => {
          this.isLoading = false
          this.showPinboardList = false
        })
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
    },
    toggleFilterInfo () {
      this.isShowFilterInfo = !this.isShowFilterInfo
    },
    closeFilterInfo () {
      this.isShowFilterInfo = false
    }
  },
}
</script>
<style lang="scss" scoped>
.result-board {
  background: rgba(0, 0, 0, 0.55);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 48px;

  .board-header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 28px;
    background-color: rgba(35, 61, 64, 0.6);
  }

  .header-block {
    flex: 1;
  }

  .pin-button-block {
    position: relative;

    .head-btn {
      display: inline-block;
      position: relative;
      font-size: 14px;
      line-height: 26px;
      color: $theme-text-color;
      padding: 2px 12px;
      border-radius: 4px;
      border: none;

      &.share, &.restrict {
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
