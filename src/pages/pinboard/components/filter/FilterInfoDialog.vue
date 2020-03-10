<template>
  <div class="filter-info-dialog">
    <div class="filter-info-block">
      <div
        v-for="(restrict, index) in filterInfo"
        :key="index"
      >
        <pinboard-filter-info
          :restriction="restrict"
          :not-last="index !== filterInfo.length - 1"
        ></pinboard-filter-info>
      </div>
    </div>
  </div>
</template>
<script>
import PinboardFilterInfo from './PinboardFilterInfo'

export default {
  name: 'FilterInfoDialog',
  components: {
    PinboardFilterInfo
  },
  props: {
    filterInfo: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-info-dialog {
  width: 380px;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #323A3A;
  box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
  border-radius: 8px;
  padding: 24px 20px;
  text-align: left;
  z-index: 999;

  &:before {
    position: absolute;
    top: -20px;
    right: 30px;
    display: block;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    pointer-events: none;
    border-bottom-color: #323A3A;
    border-width: 10px;
  }

  .filter-info-block {
    max-height: 350px;
    overflow: auto;
  }
}
</style>
