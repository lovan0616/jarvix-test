<template>
  <div class="pinboard-info-dialog">
    <div class="pinboard-info-block">
      <el-tabs
        v-model="activeTab"
        class="pinboard-info-tab"
        type="card"
      >
        <el-tab-pane
          :label="$t('pinboard.source')"
          :name="$t('pinboard.source')"
        >
          <pinboard-data-info
            :result-id="resultId"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="hasFilter"
          :label="$t('pinboard.restrict')"
          :name="$t('pinboard.restrict')"
        >
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
import { mapState } from 'vuex'

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
  computed: {
    ...mapState('pinboard', ['pinboardData']),
    getDataInfo () {
      return this.pinboardData.find(data => data.resultId === this.resultId)
    },
    hasFilter () {
      return (this.$store.state.dataFrameAdvanceSetting.filterList.length > 0 && this.$route.name === 'PageResult') || this.getDataInfo.restrictions.length > 0
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
  background-color: #323a3a;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(71, 235, 251, 0.5);
  padding: 10px 20px 0;
  position: absolute;
  right: 188px;
  text-align: left;
  top: 70%;
  width: 380px;
  z-index: 999;

  &::before {
    border: solid transparent;
    border-bottom-color: #323a3a;
    border-width: 10px;
    content: ' ';
    display: block;
    height: 0;
    pointer-events: none;
    position: absolute;
    right: 30px;
    top: -16px;
    width: 0;
  }

  .pinboard-info-block {
    max-height: 280px;
    overflow: hidden;

    >>> .el-tabs--card {
      & > .el-tabs__header {
        border-bottom: 3px solid #414848;
        margin: 0 0 25px;

        .el-tabs__nav {
          border: none;
          width: 100%;

          &::before {
            background: #324b4e;
            bottom: 0;
            content: '';
            height: 3px;
            position: absolute;
          }
        }

        .el-tabs__item {
          border: none;
          color: #aaa;
          text-align: center;

          &.is-active {
            background: linear-gradient(360deg, #324b4e 0%, rgba(50, 75, 78, 0) 100%);
            border-bottom: 3px solid $theme-color-primary;
            color: #fff;
          }
        }
      }

      .el-tabs__content {
        max-height: 210px;
        overflow-y: auto;
        padding-right: 10px;
      }
    }
  }
}
</style>
