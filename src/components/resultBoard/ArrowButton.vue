<template>
  <div class="arrow-block"
    :class="{down: isVertical}"
  >
    <div class="arrow"></div>
    <div class="arrow"></div>
    <div class="tool-tip">{{ this.$t('resultDescription.more') }}</div>
  </div>
</template>
<script>
export default {
  name: 'ArrowButton',
  props: {
    isVertical: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.arrow-block {
  position: absolute;
  top: 190px;
  right: 80px;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #000000;
    transform: translateY(-5px);

    .tool-tip {
      opacity: 1;
    }
  }

  &.down {
    flex-direction: column;

    .arrow {
      transform: rotate(45deg);
      margin: -6px 0 0 0;
      animation: arrowDown 2s infinite;
    }
  }

  .arrow {
    display: block;
    width: 10px;
    height: 10px;
    border-bottom: 2px solid $theme-color-warning;
    border-right: 2px solid $theme-color-warning;
    margin: 0 0 0 -6px;
    animation: arrowRight 2s infinite;
  }
  .arrow:nth-child(2){
    animation-delay: -0.2s;
  }
  .arrow:nth-child(3){
    animation-delay: -0.4s;
  }

  .tool-tip {
    opacity: 0;
    position: absolute;
    top: -20px;
    width: 50px;
    text-align: center;
    font-size: 12px;
    background-color: #000;
    padding: 2px 0;
    border-radius: 4px;
    box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
    transition: all 0.3s;
  }
}

@keyframes arrowRight {
  0%{
    opacity: 0;
    transform: rotate(-45deg) translate(-5px,-5px);
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: 0.3;
    transform: rotate(-45deg) translate(5px,5px);
  }
}

@keyframes arrowDown {
  0%{
    opacity: 0;
    transform: rotate(45deg) translate(-5px,-5px);
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: 0.3;
    transform: rotate(45deg) translate(5px,5px);
  }
}
</style>
