<template>
  <div class="display-correlation-features">
    <div class="feature-header">
      <div class="feature-header-left">
        <div class="feature-header-title">
          <div class="dot" />{{ $t('resultDescription.featureList') }}
        </div>
        <div class="feature-header-description">
          {{ $t('resultDescription.hereIsFeatures') }}
        </div>
      </div>
      <template v-if="!isNaN(confidence)">
        <el-tooltip
          :content="$t('resultDescription.modelConfidence')"
          placement="bottom"
        >
          <div class="feature-header-confidence">
            {{ Math.round( confidence > 0 ? confidence * 100 : 0) }}
            <span class="unit-icon">%</span>
          </div>
        </el-tooltip>
      </template>
    </div>
    <div class="feature-body">
      <div
        v-for="(item, index) in features"
        :class="['feature-item', {'selected': index === displayFactorIndex}]"
        :key="index"
        @click="onClickItem(index)"
      >
        <div class="item-header">
          <div class="item-title">
            {{ item['alias'] }}
          </div>
          <div class="item-importance">
            {{ round(item['importance'], 4) }}
          </div>
        </div>
        <div class="item-bar">
          <div
            :style="{width: item['importance'] * 100 + '%'}"
            class="item-inner-bar"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'DisplayCorrelationFeatures',
  props: {
    features: { type: Array, default: () => [] },
    confidence: {
      type: Number,
      default: 0
    }
  },
  computed: {
    displayFactorIndex () {
      return this.$store.state.result.displayFactorIndex
    },
    doClickCorrelation () {
      return this.$store.state.chatBot.doClickCorrelation
    }
  },
  watch: {
    doClickCorrelation (val) {
      if (!val) return
      let clickIndex = this.features.findIndex(element => element.alias === '環境溼度')
      this.onClickItem(clickIndex)
      this.$store.commit('chatBot/setDoClickCorrelation', false)
    }
  },
  methods: {
    onClickItem (index) {
      this.$store.commit('result/updateDisplayFactorIndex', index)
    },
    round (x, n = 2) {
      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n)
    }
  }
}
</script>
<style lang="scss">
.display-correlation-features {

  .feature-header {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background: #2B4A4E;
  }

  .feature-body {
    background: #173538;
    max-height: 400px;
    overflow-y: auto;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .feature-header-left {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin-right: 10px;
  }

  .feature-header-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 400;

    .dot {
      width: 4px;
      height: 8px;
      background: #4DE2F0;
      margin-right: 8px;
    }
  }

  .feature-header-description {
    font-size: 12px;
  }

  .feature-header-confidence {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 60px;
    height: 60px;
    border: 1px solid $theme-color-warning;
    border-radius: 100%;
    color: $theme-color-warning;
    font-size: 20px;
    padding: 4px;

    .unit-icon {
      font-size: 12px;
      line-height: 16px;
      height: 20px;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }

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
    flex: 1;
    margin-bottom: 8px;
  }

  .item-importance {
    width: 50px;
    display: flex;
    justify-content: flex-end;
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
