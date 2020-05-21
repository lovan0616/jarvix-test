<template>
  <div class="column-summary">
    <div v-if="summaryData.statsType === 'NUMERIC'">
      <component
        :is="componentName(summaryData.statsType)"
        :dataset="getHistogramData(summaryData)"
      ></component>
      <ul
        class="list"
      >
        <li
          class="list-item"
          v-for="(value, name) in getDataList(dataBlock.data)"
          :key="name + value"
        >
          <div class="list-item-name">
            {{name}}
          </div>
          <div class="list-item-value">
            {{value}}
          </div>
        </li>
      </ul>
    </div>

    <!-- <div
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

      <ul
         v-else-if="dataBlock.diagram === 'list'"
        class="list"
      >
        <li
          class="list-item"
          v-for="(value, name) in getDataList(dataBlock.data)"
          :key="name + value"
        >
          <div class="list-item-name">
            {{name}}
          </div>
          <div class="list-item-value">
            {{value}}
          </div>
        </li>
      </ul>
    </div> -->
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
  computed: {
    getHistogramData () {
      if (this.summaryData.statsType !== 'NUMERIC') return
      const stateMeta = this.summaryData.numeric_stats_meta
      return {
        data: stateMeta.bins.map(rangeData => rangeData.count),
        range: [stateMeta.min, stateMeta.max]
      }
    }
  },
  methods: {
    componentName (statsType) {
      if (!statsType) return
      switch (statsType) {
        case 'NUMERIC':
          return 'DisplayHistogramChart'
      }
    },
    getDataList (dataObj) {
      let dataList = {}
      for (let prop in dataObj) {
        if (typeof dataObj[prop] === 'object') {
          dataList = {...dataList, ...dataObj[prop]}
        } else {
          const typesInEnglish = ['null', 'true', 'false']
          const propName = typesInEnglish.includes(prop) ? prop : this.$t(`resultDescription.${prop}`)
          dataList[propName] = dataObj[prop]
        }
      }
      return dataList
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
