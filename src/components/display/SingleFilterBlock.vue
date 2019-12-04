<template>
  <div class="single-filter-block">
    <div class="column-name">test</div>
    <label class="checkbox-label filer-checkbox">
      <input type="checkbox" >
      <div class="checkbox-square"></div>
    </label>
    <div class="filter-info-tooltip"></div>
  </div>
</template>
<script>
export default {
  name: 'SingleFilterBlock',
  props: {
    filterInfo: {
      type: Object
    }
  }
}
</script>
<style lang="scss" scoped>
.single-filter-block {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 70px;
  background-color: transparent;
  border-radius: 5px;
  padding: 8px;
  border: 1px solid #839699;
  color: #839699;

  &:not(:first-child) {
    margin-left: 12px;
    position: relative;

    &:before {
      content: "";
      display: inline-flex;
      width: 12px;
      position: absolute;
      top: 15px;
      left: -12px;
      border-top: 2px solid #839699;
    }
  }

  &:hover {
    .filter-info-tooltip {
      display: block;
    }
  }

  &.checked {
    background-color: $filter-color;

    &:not(:first-child):before {
      border-top: 2px solid $filter-color;
    }
  }

  .column-name {
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  .filter-info-tooltip {
    display: none;
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
    width: auto;
    color: #fff;
    font-size: 13px;
    line-height: 1.2;
    // 處理寬度被 parent 限制的問題
    white-space: nowrap;
    text-align: center;
    background-color: #323A3A;
    box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
    border-radius: 8px;
    padding: 5px 8px;
    z-index: 999;

    &:after {
      bottom: 100%;
      left: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-bottom-color: #323A3A;
      border-width: 7px;
      margin-left: -7px;
    }
  }
}
</style>
