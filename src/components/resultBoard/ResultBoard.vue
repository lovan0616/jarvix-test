<template>
  <div class="result-board">
    <div class="board-header">
      <slot name="ResultBoardHeader"></slot>
      <a class="pin-button"
        :class="{'is-pinned': pinStatus}"
        href="javascript:void(0)"
        @click="pinToBoard"
      ><span class="pin-slash"><svg-icon icon-class="pin" class="pin-icon"></svg-icon></span></a>
    </div>
    <slot name="ResultBoardBody"></slot>
  </div>
</template>
<script>
import axios from 'axios'
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
      pinBoardId: null
    }
  },
  methods: {
    pinToBoard () {
      const path = window.env.API_ROOT_URL + 'api/pin/report'
      if (this.isPinned) {
        axios.delete(path, {id: this.pinBoardId})
          .then(res => {
            this.pinBoardId = null
            this.updatePinnedStatus()
          })
      } else {
        axios.put(path, {report: this.resultInfo})
          .then(res => {
            this.pinBoardId = res.data.data.pin_report_id
            this.updatePinnedStatus()
          })
      }
    },
    updatePinnedStatus () {
      this.isPinned = !this.isPinned
    }
  },
  computed: {
    pinStatus () {
      // 目前 pinboard 頁，只會有 pinned 的狀態
      return this.isPinned || this.$route.name === 'PagePinboard'
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board {
  background: #FFF;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;

  .board-header {
    position: relative;
    padding: 15px 30px;
    border-bottom: 1px solid #D8D8D8;
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
    color: #0F9696;

    &:after {
      content: 'pin to board';
    }

    &.is-pinned {
      width: 100px;
      background: #78A5A9;
      color: #fff;
      border-radius: 30px;
      padding: 0 15px;

      &:after {
        content: 'pinned';
      }

      &:hover {
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
