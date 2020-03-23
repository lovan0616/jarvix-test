<template>
  <div class="custom-feature-list">
    <div class="title-block">
      <default-select
        class="data-frame-select"
      ></default-select>
      <button class="btn btn-secondary btn-has-icon">
        <svg-icon icon-class="add-feature" class="icon"></svg-icon>{{ $t('button.addFeature') }}
      </button>
    </div>
    <div class="data-table feature-list">
      <div class="data-table-row table-head">
        <div class="data-table-cell">{{ $t('editing.belongToDataFrame') }}</div>
        <div class="data-table-cell">{{ $t('editing.columnName') }}</div>
        <div class="data-table-cell">{{ $t('editing.action') }}</div>
      </div>
      <div class="data-table-body">
        <div class="data-table-row">
          <div class="data-table-cell">test.csv</div>
          <div class="data-table-cell">test
            <el-tooltip placement="top"
              :content="$t('resultDescription.modelConfidence')"
            >
              <svg-icon icon-class="info" class="info-icon"></svg-icon>
            </el-tooltip>
          </div>
          <div class="data-table-cell">
            <a href="javascript:void(0)" class="action-link link">{{ $t('button.edit') }}</a>
            <a href="javascript:void(0)" class="action-link link">{{ $t('button.delete') }}</a>
          </div>
        </div>
      </div>
    </div>
    <edit-feature-dialog></edit-feature-dialog>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import EditFeatureDialog from './EditFeatureDialog'

export default {
  name: 'CustomFeatureList',
  components: {
    DefaultSelect,
    EditFeatureDialog
  }
}
</script>
<style lang="scss" scoped>
.custom-feature-list {
  .title-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .data-frame-select {
    width: 188px;
    border-bottom: 1px solid #fff;
  }
  .feature-list {
    .data-table-body {
      .data-table-cell {
        color: #ddd;
      }
    }
  }
}
</style>
