<template>
  <div class="join-logic-hints__block">
    <svg-icon
      :icon-class="iconClass"
      class="join-logic-hints__icon"
    />
    <div
      :class="`join-logic-hints__description--${hintPosition}`"
      class="join-logic-hints__description"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'JoinLogicHints',
  props: {
    iconClass: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    hintPosition: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.join-logic-hints {
  &__block {
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
    position: relative;
    overflow: visible;
    height: 20px;
  }
  &__icon {
    position: absolute;
    top: 3px;
    left: 0;
    cursor: pointer;
    fill: #555;
    transition: fill .3s ease;
    &:hover {
      fill: #CCC;
      & ~ .join-logic-hints__description {
        display: block;
      }
    }
  }
  &__description {
    display: none;
    position: absolute;
    top: 26px;
    left: -18px;
    background: #233131;
    border-radius: 8px;
    padding: 12px;
    width: 212px;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
    z-index: 4;
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: -8px;
      left: 16px;
      border-color: transparent transparent #233131 transparent;
      border-style: solid;
      border-width: 0px 10px 10px 10px;
      height: 0px;
      width: 0px;
      transition: all .3s ease;
    }
    &--top {
      top: unset;
      bottom: 24px;
      left: -18px;
      &:before {
        top: unset;
        bottom: -8px;
        left: 16px;
        border-color: #233131 transparent transparent transparent;
        border-width: 10px 10px 0px 10px;
      }
    }
  }
}
</style>