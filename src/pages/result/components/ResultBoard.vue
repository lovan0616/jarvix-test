<template>
  <div class="result-board">
    <div class="board-header">
      <slot name="ResultBoardHeader"></slot>
      <a class="pin-button"
        :class="['is-pinned']"
        href="javascript:void(0)"
      ><span class="pin-slash"><svg-icon icon-class="pin" class="pin-icon"></svg-icon></span></a>
    </div>
    <slot name="ResultBoardBody"></slot>
  </div>
</template>
<script>

export default {
  name: 'ResultBoard'
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
