<template>
  <div class="etl-column-setting">
    <div class="section column-header">
      <div class="title">
        <svg-icon icon-class="arrow-right" class="icon"></svg-icon>
        <a href="javascript:void(0)" class="link"
          @click="$emit('back')"
        >{{ $t('etl.backToDataFrame') }}</a>
        <p class="data-frame-name">
          {{ $t('etl.advanceSetting') }}
          （{{ $t('etl.column') }}：{{ currentColumnInfo.primaryAlias || '' }}）
        </p>
      </div>
    </div>
    <div class="section column-setting">
      <single-column-setting
        :column-info="currentColumnInfo"
        :key="currentTableIndex + '_' + currentColumnIndex"
        @updateInfo="updateSetting"
      ></single-column-setting>
    </div>
    <div class="section column-summary">
      <!-- TODO 待串接資料 -->
      <div class="title">資料概要</div>
      <dl v-for="i in 3" :key="i">
        <dt>第{{i}}常見value</dt>
        <dd>30%</dd>
      </dl>
    </div>
  </div>
</template>
<script>
import SingleColumnSetting from './SingleColumnSetting'

export default {
  name: 'EtlColumnSetting',
  components: {
    SingleColumnSetting
  },
  data () {
    return {
    }
  },
  methods: {
    updateSetting (info) {
      this.$store.commit('dataManagement/updateReplaceValue', {
        tableIndex: this.currentTableIndex,
        columnIndex: info.index,
        info
      })
    }
  },
  computed: {
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    },
    currentTableIndex () {
      return this.$store.state.dataManagement.currentTableIndex
    },
    currentColumnIndex () {
      return this.$store.state.dataManagement.currentColumnIndex
    },
    currentColumnInfo () {
      return this.etlTableList[this.currentTableIndex].columns[this.currentColumnIndex]
    }
  }
}
</script>
<style lang="scss" scoped>
.etl-column-setting {
  display: flex;
  flex-wrap: wrap;
  background-color: rgba(50, 58, 58, 0.95);
  border-radius: 5px;
  padding: 24px;
  .section {
    &.column-header {
      flex: 0 0 100%;
      .icon {
        color: $theme-color-primary;
        transform: rotate(180deg);
      }
      .data-frame-name {
        margin: 24px 0 16px 0;
      }
    }
    &.column-setting {
      flex: 1 0 50%;
      overflow: auto;
    }
    &.column-summary {
      flex: 0 1 40%;
      background: rgba(67, 76, 76, 0.95);
      border-radius: 5px;
      padding: 12px 16px;
      height: fit-content;
      margin-left: 20px;

      dl {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
