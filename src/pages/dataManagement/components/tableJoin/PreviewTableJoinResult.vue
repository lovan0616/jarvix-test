<template>
  <section class="preview-result">
    <h3 class="title">{{ $t('editing.resultPreview') }}</h3>
    <div class="data-table">
      <div class="data-table-row table-head">
        <div class="data-table-cell">{{ $t('editing.dataColumnAmount') }}</div>
        <div class="data-table-cell">{{ $t('editing.dataRowAmount') }}</div>
        <div class="data-table-cell">
          {{ $t('editing.matchedKey') }}
          <span class="nav-item nav-function tooltip-container">
            <svg-icon 
              icon-class="information-circle" 
              class="icon" />
            <div class="tooltip">{{ $t('editing.previewKeyRemind') }}</div>
          </span>
        </div>
      </div>
      <div class="data-table-body">
        <div class="data-table-row">
          <div class="data-table-cell">{{ result.columnCount | formatZeroData }}</div>
          <div class="data-table-cell">{{ result.rowCount | formatZeroData }}</div>
          <div class="data-table-cell value-list">
            <span v-if="!result.valueList.length">{{ $t('editing.emptyKey') }}</span>
            <span
              v-for="value in result.valueList"
              v-else
              :key="value"
            >{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PreviewTableJoinResult',
  filters: {
    formatZeroData: function (value) {
      if (value <= 0) return 0
      return value
    }
  },
  props: {
    result: {
      type: Object,
      required: true
    }
  },
}
</script>

<style lang="scss" scoped>
.preview-result {
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(72, 84, 84, 0.95);
  margin-top: 17px;

  .title {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 1rem;
  }

  .data-table-body {
    .data-table-row {
      height: 100px;
    }

    .data-table-cell {
      height: 100%;
      overflow: auto;
    }

    .value-list {
      display: flex;
      flex-direction: column;
    }
  }

  .tooltip-container {
    .icon {
      color: $theme-color-warning;
    }
  }
}
</style>
