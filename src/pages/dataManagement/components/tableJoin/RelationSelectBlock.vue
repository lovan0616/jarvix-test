<template>
  <div class="select-block">
    <div class="select-block-item">
      <svg-icon icon-class="table" class="type-icon" />
      <custom-select
        :key="'top-select'"
        :default-msg="$t('editing.selectForeign')"
        :option-list="dataFrameList"
        :value="dataFrameId"
        @input="onUpdateDataFrame"
      ></custom-select>
    </div>
    <div class="select-block-item">
      <svg-icon icon-class="column" class="type-icon" />
      <custom-select
        :key="'bottom-select'"
        :default-msg="$t('editing.selectColumn')"
        :option-list="columnList"
        :value="dataColumn.id"
        @input="onUpdateDataColumn"
      ></custom-select>
    </div>
  </div>
</template>

<script>
import CustomSelect from '../CustomSelect'
import { getDataFrameColumnInfoById } from '@/API/DataSource'

export default {
  name: 'RelationSelectBlock',
  props: {
    dataFrameList: {
      type: Array
    },
    initialDataFrameId: {
      type: Number
    },
    dataColumn: {
      type: Object
    }
  },
  components: {
    CustomSelect
  },
  data () {
    return {
      columnList: [],
      dataFrameId: this.initialDataFrameId
    }
  },
  mounted () {
    if (this.dataFrameId) this.fetchDataColumnList(this.dataFrameId)
  },
  methods: {
    fetchDataColumnList (dataFrameId) {
      getDataFrameColumnInfoById(dataFrameId).then(response => {
        this.columnList = response.map(column => ({
          ...column,
          name: `${column.primaryAlias || column.name}（${column.dataType}）`
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
}
</style>
