<template>
  <div class="selected-region">
    <div class="region-title-block">
      <div class="region-title"><svg-icon icon-class="filter"></svg-icon>{{ title }}：</div>
      <button class="btn-m btn-outline"
        @click="save"
      >{{ $t('resultDescription.saveFilterCondition') }}</button>
    </div>
    <slot name="selectedFilterRegion"></slot>
  </div>
</template>
<script>
export default {
  name: 'SelectedRegion',
  props: {
    title: {
      type: String
    }
  },
  methods: {
    save () {
      this.$emit('save')
    }
  }
}
</script>
<style lang="scss" scoped>
.selected-region {
  margin-bottom: 16px;
  background: $filter-color;
  border-radius: 8px;
  padding: 14px 20px;
  margin-top: 16px;

  .region-title-block {
    display: flex;
    justify-content: space-between;
  }

  .region-title {
    margin-bottom: 16px;
  }
  .filter-description {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
