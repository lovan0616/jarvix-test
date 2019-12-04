<template>
  <div class="display-correlation-features">
    <div :class="['feature-item', {'selected': index === cursor}]"
      v-for="(item, index) in features"
      v-bind:key="index"
      @click="onClickItem(index)"
    >
      <div class="item-header">
        <div class="item-title">
          {{item['alias']}}
        </div>
        <div class="item-importance">
          {{round(item['importance'], 4)}}
        </div>
      </div>
      <div class="item-bar">
        <div class="item-inner-bar" :style="{width: item['importance'] * 100 + '%'}"></div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'DisplayCorrelationFeatures',
  props: {
    features: { type: Array, default: () => [] }
  },
  data () {
    return {
      cursor: 0
    }
  },
  methods: {
    onClickItem (index) {
      this.changeCursor(index)
      //FIXME assume this component is created by task
      this.$parent.$emit('task-event', 'change-cursor', index)
    },
    changeCursor (index) {
      this.cursor = index
    },
    round (x, n = 2) {
      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n)
    }
  }
}
</script>
<style lang="scss">
.display-correlation-features {
  background: #173538;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;

  .feature-item {
    border-bottom: 1px solid #274245;
    padding: 8px 12px 12px 8px;
    cursor: pointer;

    &:last-child {
      border-bottom: 0;
    }

    &.selected {
      background: #274245;
    }
  }

  .item-header {
    display: flex;
    justify-content: space-between;
  }

  .item-title {
    margin-bottom: 8px;
  }

  .item-importance {
    display: flex;
    align-items: center;
    font-size: 13px;
  }

  .item-bar {
    width: 100%;
    height: 4px;
    border-radius: 2px;
  }

  .item-inner-bar {
    height: 100%;
    border-radius: 2px;
    background: #4DE2F0;
  }
}
</style>
