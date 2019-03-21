<template>
  <div class="result-board">
    <div class="board-header">
      <div class="board-name">不同地區價格的比較測試文字</div>
      <div class="board-period">2016-01 ~ 2017-12</div>
      <a class="pin-button"
        :class="['is-pinned']"
        href="javascript:void(0)"
      ><span class="pin-slash"><svg-icon icon-class="pin" class="pin-icon"></svg-icon></span></a>
    </div>
    <div class="board-body">
      <div class="section-left">
        <div class="indicators-board"
          v-for="n in 3"
          :key="n"
        >
          <div class="board-label">價格最高的地區</div>
          <div class="board-content">5666000</div>
        </div>
      </div>
      <div class="section-right"></div>
    </div>
    <div class="board-footer">
      <div class="insights-info"
        v-for="n in 3"
        :key="n"
      >2017年6月的銷售額高於平均21%($11,025 Million NTD)，佔全年金額7%；貢獻最多的產品是AXSGS111，佔了該月金額約36%</div>
    </div>
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

    .board-name {
      font-size: 18px;
      line-height: 26px;
      letter-spacing: 0.1em;
      color: #2E2E2E;
      margin-bottom: 5px;
    }
    .board-period {
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 0.05em;
      color: #979797;
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
  .board-body {
    padding: 40px 30px 30px;
    display: flex;
    justify-content: space-between;

    .section-left {

    }

    .section-right {
      width: 69.44%;
    }
  }
  .indicators-board {

    &:not(:last-child) {
      margin-bottom: 32px;
    }

    .board-label {
      font-size: 13px;
      line-height: 2px;
      letter-spacing: 0.05em;
      color: #444;
      margin-bottom: 10px;
    }
    .board-content {
      font-size: 28px;
      line-height: 1;
      letter-spacing: 0.05em;
      color: #2E2E2E;
    }
  }
  .board-footer {
    background: #F1F7F7;
    border-radius: 8px;
    padding: 15px 30px;
    font-size: 13px;
    line-height: 22px;
    letter-spacing: 0.05em;
    color: #2E2E2E;

    .insights-info {
      font-size: 13px;
      line-height: 20px;
      letter-spacing: 0.05em;

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
