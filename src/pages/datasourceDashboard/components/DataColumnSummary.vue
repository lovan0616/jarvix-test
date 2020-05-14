<template>
  <div class="column-summary">
    <ul
      v-if="summaryData.diagram === 'list'"
      class="list"
    >
      <li
        class="list-item"
        v-for="item in summaryData.data.data"
        :key="item.name + item.value"
      >
        <div class="list-item-name">
          {{item.name}}
        </div>
        <div class="list-item-value">
          {{item.value}}
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
export default {
  name: 'DataColumnSummary',
  props: {
    summaryData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.column-summary {
  .list {
    margin: 0;
    padding: 0;
  }

  .list-item {
    list-style-type: none;
    display: flex;
    padding: 5px 0;
    font-weight: normal;
  }

  .list-item-name {
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-item-value {
    width: 30%;
    text-align: right;
  }
}
</style>
