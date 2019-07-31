<template>
  <div class="result-board">
    <div class="board-header">
      <slot name="ResultBoardHeader"></slot>
      <a class="pin-button"
        :class="{'is-pinned': pinStatus, 'is-loading': isLoading}"
        href="javascript:void(0)"
        @click="pinToBoard"
      ><span class="pin-slash"><svg-icon :icon-class="isLoading  ? 'spinner' : 'pin'" class="pin-icon"></svg-icon></span></a>
    </div>
    <slot name="ResultBoardBody"></slot>
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

  .board-header {
    position: relative;
    padding: 15px 30px;

    &:after {
      position: absolute;
      left: 0;
      bottom: -3px;
      display: block;
      content: "";
      width: 140px;
      border: 3px solid #8EF5FF;
    }
  }
  .pin-button {
    display: flex;
    align-items: center;
    position: absolute;
    right: 30px;
    bottom: 15px;
    height: 30px;
    font-size: 13px;
    line-height: 26px;
    letter-spacing: 0.02em;
    color: $theme-color-primary;

    &:after {
      content: 'pin to board';
    }

    &.is-loading {
      cursor: not-allowed;
      width: 120px;
      background: #43BAC3;
      opacity: 0.5;
      color: #fff;
      border-radius: 30px;
      padding-left: 15px;

      &:after {
        content: 'loading...';
      }
    }

    &.is-pinned {
      width: 100px;
      background: #78A5A9;
      color: #fff;
      border-radius: 30px;
      padding-left: 15px;
      transition: all 0.3s;

      &:after {
        content: 'pinned';
      }

      &:hover {
        background-color: #67888E;

        &:after {
          content: 'unpin';
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
</style>
