<template>
  <div class="pinboard-data-info">
    <div class="pinboard-data-info__title">{{ $t('pinboard.dataFrame') }}</div>
    <ul class="pinboard-data-info__list">
      <li>{{ getDataInfo.dataframeName }}</li>
    </ul>
    <div class="pinboard-data-info__title">{{ $t('pinboard.relativeDataColun') }}</div>
    <ul class="pinboard-data-info__list">
      <li v-if="selectedColumnsInfo === null"> {{ $t('pinboard.allColumns') }} </li>
      <li
        v-for="(column, index) in selectedColumnsInfo"
        :key="index"
      >{{ column }} </li>
    </ul>
  </div>
</template>
<script>
import {mapState} from 'vuex'

export default {
  name: 'PinboardDataInfo',
  props: {
    resultId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapState('pinboard', ['pinboardData']),
    getDataInfo() {
      return this.pinboardData.find(data => data.resultId === this.resultId)
    },
    selectedColumnsInfo () {
      if (this.getDataInfo.selectedColumns === null) return null

      return this.getDataInfo.selectedColumns.map(element => {
        let columnMap = this.getDataInfo.dataColumnMap
        for (let column in columnMap) {
          if (columnMap[column].id === element) {
            return columnMap[column].primary_alias
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pinboard-data-info {
	&__title {
		font-size: 14px;
		line-height: 22px;
	}

	&__list {
    font-size: 14px;
    line-height: 24px;
    padding-left: 25px;
		margin: 4px 0 16px;
	}
}
</style>
