<template>
  <div class="result-board-container">
    <div class="result-board">
      <div class="board-header">
        <div class="header-block">
          <slot name="PageResultBoardHeader"></slot>
        </div>
        <a class="pin-button"
          :class="{'is-pinned': pinStatus, 'is-loading': isLoading}"
          href="javascript:void(0)"
          @click="pinToBoard"
        ><span class="pin-slash"><svg-icon :icon-class="isLoading  ? 'spinner' : 'pin'" class="pin-icon"></svg-icon></span></a>
      </div>
      <slot name="PageResultBoardBody"></slot>
    </div>
    <div class="related-question-block"
      v-if="$slots.RelatedQuestions"
    >
      <div class="block-title">关联问题</div>
      <div class="related-question-list">
        <slot name="RelatedQuestions"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { updatePinboard } from '@/API/Pinboard'
export default {
  name: 'ResultBoard',
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
      pinBoardId: null
    }
  },
  mounted () {
    // Pinboard 頁預設全都是 pin 完的狀態
    if (this.isPinboardPage) {
      this.updatePinnedStatus()
      this.pinBoardId = this.$parent.$parent.$attrs.id
    }
  },
  methods: {
    pinToBoard () {
      if (this.isLoading) return false
      this.isLoading = true
      if (this.isPinned) {
        this.$store.dispatch('pinboard/deletePinboard', {id: this.pinBoardId})
          .then(res => {
            this.isLoading = false
            if (this.isPinboardPage) {
              /**
               * 這邊為了避免因為資料刪除後造成畫面重新 render，所以只用 css 將物件藏起來
               */
              let elem = document.getElementById(this.pinBoardId)
              // 這邊是為了 transition 所以先抓高度
              elem.style.height = elem.offsetHeight + 'px'

              window.setTimeout(() => {
                elem.style.height = 0
                elem.style.overflow = 'hidden'
                elem.style.padding = 0
                elem.style.margin = 0
              }, 300)
            } else {
              this.pinBoardId = null
              this.updatePinnedStatus()
            }
          }).catch(() => {
            this.isLoading = false
          })
      } else {
        updatePinboard({report: this.resultInfo})
          .then(res => {
            this.pinBoardId = res.pin_report_id
            this.updatePinnedStatus()
            this.isLoading = false
          }).catch(() => {
            this.isLoading = false
          })
      }
    },
    updatePinnedStatus () {
      this.isPinned = !this.isPinned
    }
  },
  computed: {
    isPinboardPage () {
      return this.$route.name === 'PagePinboard'
    },
    pinStatus () {
      // 目前 pinboard 頁，只會有 pinned 的狀態
      return this.isPinned || this.$route.name === 'PagePinboard'
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
  }
  .header-block {
    flex: 1;
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

    &:after {
      content: '加入钉板';
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

      &:after {
        content: '处理中...';
      }
    }

    &.is-pinned {
      min-width: 100px;
      background: #57B4BD;
      color: #fff;
      padding-left: 15px;
      transition: all 0.3s;

      &:after {
        content: '已钉板';
      }

      &:hover {
        background-color: #67888E;

        &:after {
          content: '取消钉板';
        }

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
  padding: 28px;

  .block-title {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 18px;
  }

  .related-question-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
<style lang="scss">
.related-question-list {
  .result-board {
    width: 31.33%;
  }
}
</style>
