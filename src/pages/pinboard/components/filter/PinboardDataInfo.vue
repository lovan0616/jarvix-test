<template>
	<div class="pinboard-data-info">
		<div class="pinboard-data-info__title">{{$t('pinboard.dataFrame')}}</div>
		<ul class="pinboard-data-info__list">
			<li>{{ getDataFrameName }}</li>
		</ul>
		<div class="pinboard-data-info__title">{{$t('pinboard.relativeDataColun')}}</div>
		<ul class="pinboard-data-info__list">
			<li>haha </li>
		</ul>
	</div>
</template>
<script>

export default {
  name: 'PinboardDataInfo',
  props: {
		dataFrameId: {
      type: Number,
      default: null
    }
  },
  computed: {

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
		margin: 4px 0 16px;
	}
}
</style>
