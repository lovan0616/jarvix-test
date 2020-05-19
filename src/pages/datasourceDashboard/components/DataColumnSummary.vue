<template>
  <div class="column-summary">
    <div
      v-for="dataBlock in summaryData.data"
      :key="dataBlock.diagram"
      class="data-block"
    >
      <div
        v-if="dataBlock.diagram === 'message'"
        class="message"
      >
        {{dataBlock.message}}
      </div>
      <component
        v-else-if="dataBlock.diagram === 'chart'"
        :is="componentName(dataBlock.chartType)"
        :dataset="dataBlock.dataset"
        :title="dataBlock.title"
      ></component>
      <ul
         v-else-if="dataBlock.diagram === 'list'"
        class="list"
      >
        <li
          class="list-item"
          v-for="item in dataBlock.data"
          :key="item.name + item.value"
        >
          <div class="list-item-name">
             <el-tooltip
              slot="label"
              :enterable="false"
              :content="item.name">
              <span>{{item.name}}</span>
            </el-tooltip>
          </div>
          <div class="list-item-value">
            <el-tooltip
              slot="label"
              :enterable="false"
              :content="item.value">
              <span>{{item.value}}</span>
            </el-tooltip>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import DisplayHistogramChart from './DisplayHistogramChart'

export default {
  name: 'DataColumnSummary',
  props: {
    summaryData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    DisplayHistogramChart
  },
  methods: {
    componentName (chartType) {
      if (!chartType) return
      switch (chartType) {
        case 'histogram':
          return 'DisplayHistogramChart'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.column-summary {
  .data-block:not(:last-of-type) {
    margin-bottom: 12px;
  }

  .message {
    height: 146px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .list {
    margin: 0;
    padding: 0;
  }

  .list-item {
    list-style-type: none;
    display: flex;
    padding: 5px 0;
    font-weight: normal;
    justify-content: space-between;
  }

  .list-item-name,
  .list-item-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-item-name {
    width: 65%;
  }

  .list-item-value {
    width: 30%;
    text-align: right;
  }
}
</style>
