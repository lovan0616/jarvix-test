<template>
  <div class="pinboard-info-dialog">
    <div class="pinboard-info-block">
      <el-tabs
        v-model="activeTab"
        class="pinboard-info-tab"
        type="card">
        <el-tab-pane
          :label="$t('pinboard.source')"
          :name="$t('pinboard.source')"
        >
          <pinboard-data-info
            :result-id="resultId"/>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('pinboard.restrict')"
          :name="$t('pinboard.restrict')">
          <pinboard-filter-info
            v-for="(restrict, index) in filterInfo"
            :result-id="resultId"
            :key="index"
            :restriction="restrict"
            :is-last="index === filterInfo.length - 1"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import PinboardFilterInfo from './PinboardFilterInfo'
import PinboardDataInfo from './PinboardDataInfo'

export default {
  name: 'PinboardInfoDialog',
  components: {
    PinboardFilterInfo,
    PinboardDataInfo
  },
  props: {
    resultId: {
      type: Number,
      default: null
    },
    filterInfo: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeTab: this.$t('pinboard.source')
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (!this.$el.contains(evt.target)) {
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pinboard-info-dialog {
  width: 380px;
  position: absolute;
  top: 100%;
  right: 188px;
  background-color: #323A3A;
  box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
  border-radius: 8px;
  padding: 10px 20px 0;
  text-align: left;
  z-index: 999;

  &:before {
    position: absolute;
    top: -16px;
    right: 30px;
    display: block;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    pointer-events: none;
    border-bottom-color: #323A3A;
    border-width: 10px;
  }

  .pinboard-info-block {
    max-height: 280px;
    overflow: hidden;

    >>> .el-tabs--card {

      &>.el-tabs__header {
        margin: 0 0 25px;
        border-bottom: 3px solid #414848;

        .el-tabs__nav {
          width: 100%;
          border: none;

          &::before {
            content: '';
            position: absolute;
            bottom: 0;
            height: 3px;
            background: #324B4E;
          }
        }

        .el-tabs__item {
          border: none;
          color:  #AAAAAA;
          text-align: center;

          &.is-active {
            color: #fff;
            background: linear-gradient(360deg, #324B4E 0%, rgba(50, 75, 78, 0) 100%);
            border-bottom: 3px solid $theme-color-primary;
          }
        }
      }
      .el-tabs__content {
        padding-right: 10px;
        max-height: 210px;
        overflow-y: auto;
      }
    }
  }
}
</style>
