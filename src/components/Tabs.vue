<template>
  <ul class="tab-list">
    <li
      v-for="(item, index) in items"
      :key="index + item"
      class="tab"
      :class="{'is-active': selectedTab === item.id}"
      @click="$emit('update:selected', item.id)"
    >
      <span class="tooltip-container">
        {{item.name}}
        <div class="tooltip">{{$t('editing.columnSourceRemind')}}</div>
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'tabs',
  props: {
    selected: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedTab: this.selected
    }
  },
  watch: {
    selected (id) {
      this.selectedTab = id
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-list {
  display: flex;
  margin: 0;
  padding: 0;
  .tab {
    list-style-type: none;
    min-width: 130px;
    max-width: 180px;
    padding: 0 20px;
    line-height: 37px;
    text-align: center;
    color: #AAAAAA;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.is-active {
      color: #fff;
      background: linear-gradient(360deg, #324B4E 0%, rgba(50, 75, 78, 0) 100%);
      border-bottom: 3px solid $theme-color-primary;
    }
  }

  .tooltip-container {
    .tooltip {
      width: 212px;
      white-space: normal;
      padding: 8px 12px;
      line-height: 14px;
      color: #DDDDDD;
    }
  }
}
</style>
