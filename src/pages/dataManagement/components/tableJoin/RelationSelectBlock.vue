<template>
  <div class="select-block">
    <div class="select-block-item">
      <svg-icon 
        icon-class="table" 
        class="type-icon" />
      <default-select
        v-validate="'required'"
        :key="'top-select'"
        :placeholder="$t('editing.selectForeign')"
        :option-list="dataFrameSelectList"
        :value="dataFrameId"
        class="default-select"
        @input="onUpdateDataFrame"
      />
    </div>
    <div class="select-block-item">
      <svg-icon 
        icon-class="column" 
        class="type-icon" />
      <default-select
        v-validate="'required'"
        :key="'bottom-select'"
        :placeholder="$t('editing.selectColumn')"
        :option-list="columnList"
        :value="dataColumn.id"
        class="default-select"
        filterable
        @input="onUpdateDataColumn"
      />
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import { getDataFrameColumnInfoById } from '@/API/DataSource'

export default {
  name: 'RelationSelectBlock',
  components: {
    DefaultSelect
  },
  props: {
    dataFrameList: {
      type: Array,
      default: () => []
    },
    initialDataFrameId: {
      type: Number,
      default: null
    },
    dataColumn: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      columnList: [],
      dataFrameId: this.initialDataFrameId
    }
  },
  computed: {
    dataFrameSelectList() {
      return this.dataFrameList.map(element=> ({
        ...element,
        value : element.id
      }))
    }   
  },
  mounted () {
    if (this.dataFrameId) this.fetchDataColumnList(this.dataFrameId)
    
  },
  methods: {
    fetchDataColumnList (dataFrameId) {
      const hasFeatureColumn = false
      getDataFrameColumnInfoById(dataFrameId, hasFeatureColumn).then(response => {
        this.columnList = response.map(column => ({
          ...column,
          name: `${column.primaryAlias || column.name}（${column.dataType}）`,
          value: column.id
        }))
      })
    },
    onUpdateDataFrame (newDataFrameId) {
      this.dataFrameId = newDataFrameId
      this.dataColumn.id = null
      this.dataColumn.dataType = null
      this.fetchDataColumnList(this.dataFrameId)
      this.$emit('update:initialDataFrameId', newDataFrameId)
    },
    onUpdateDataColumn (newDataColumnId) {
      this.dataColumn.id = newDataColumnId
      this.dataColumn.dataType = this.columnList.find(column => column.id === newDataColumnId).dataType
    }
  }
}
</script>

<style lang="scss" scoped>
.select-block {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(72, 84, 84, 0.95);
  .select-block-item {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    .type-icon {
      margin-right: 12px;
      color: $theme-color-primary;
      font-size: 22px;
    }
  }

  & >>> .custom-select-block {
    width: 100%;
  }

  .join-icon {
    font-size: 24px;
  }

  & >>> .default-select {
    width: 100%;
    border-bottom: 1px solid #fff;

    .el-input__inner {
      line-height: 24px;
      font-size: 14px;
      padding-left: 0;
    }

    .el-select-dropdown {
      background-color: #303435;
      border-radius: 4px;
      overflow: auto;
    }
  }
}
</style>
