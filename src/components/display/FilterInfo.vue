<template>
  <div 
    v-show="filterStatusList.length > 0" 
    class="filter-info-block">
    <div class="info-title-block">
      <div class="block-title">
        <span class="filter-icon"><svg-icon icon-class="filter"/></span>
        <span class="title-text">{{ $t('resultDescription.filterRestrictions') }}</span>
        <button 
          class="btn btn-m btn-outline"
          @click="onClearAll"
        >
          {{ $t('resultDescription.clearAllFilter') }}
        </button>
      </div>
      <div class="remark-info">
        <span class="remark-title"><svg-icon 
          icon-class="lamp" 
          class="lamp-icon"/>{{ $t('resultDescription.prompt') }}：</span>{{ $t('resultDescription.filterRule') }}</div>
    </div>
    <div class="info-body-block">
      <single-filter-block
        v-for="(f, index) in filterList"
        :key="index"
        :restriction="f.restriction"
        :status="filterStatusList[index]"
        @status-change="onFilterStatusChange(index, $event)"
      />
    </div>
  </div>
</template>
<script>
import SingleFilterBlock from './SingleFilterBlock'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'FilterInfo',
  components: {
    SingleFilterBlock
  },
  computed: {
    ...mapState('dataSource', ['filterList']),
    ...mapGetters('dataSource', ['filterStatusList'])
  },
  methods: {
    onFilterStatusChange (index, updated) {
      const result = this.filterStatusList.map((status, i) => {
        if (updated) {
          if (index >= i) return updated
          else return !updated
        } else {
          if (index <= i) return updated
          else return !updated
        }
      })
      this.$store.dispatch('dataSource/updateFilterStatusList', result)
    },
    onClearAll (e) {
      this.$store.dispatch('dataSource/clearAllFilter')
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-info-block {
  background: rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  margin-bottom: 16px;
  padding: 16px 24px 24px;

  .filter-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: $filter-color;
    margin-right: 6px;
    font-size: 12px;
    line-height: 24px;
    border-radius: 8px;
    text-align: center;
  }

  .info-title-block {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .block-title {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    margin-right: 20px;

    .title-text {
      margin-right: 16px;
    }
  }

  .remark-info {
    flex: 1;
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    align-self: flex-start;
    justify-content: flex-end;

    .remark-title {
      display: inline-flex;
      align-items: center;
      color: $theme-color-warning;
    }
    .lamp-icon {
      margin-right: 4px;
    }
  }

  .info-body-block {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
