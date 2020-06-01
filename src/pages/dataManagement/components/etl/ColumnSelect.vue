<template>
  <default-select 
    v-model="selectedValue"
    :placeholder="selectedCount.toString()"
    :option-list="options"
    size="mini"
    multiple
    collapse-tags
  >
    <template #option-content="{ option, index }">
      <label class="checkbox">
        <div class="checkbox-label">
          <input
            :checked="option.active"
            type="checkbox"
            @change="$emit('toggleColumn', index)"
          >
          <div class="checkbox-square"/>
        </div>
        <span>{{ option.name }}</span>
      </label>
    </template>
  </default-select>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'ColumnSelect',
  components: {
    DefaultSelect
  },
  props: {
    currentTableInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selectedValue: []
    }
  },
  computed: {
    options () {
      return this.currentTableInfo.columns.map(column => {
        return {
          value: column.index,
          name: column.primaryAlias,
          active: column.active
        }
      })
    },
    selectedCount () {
      return this.currentTableInfo.columns.reduce((acc, cur) => {
        return acc + (cur.active ? 1 : 0)
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  .checkbox-label {
    margin-right: 16px;
  }
}

// 將原本的 option 藏起來不被點選到
/deep/ .el-select-dropdown {
  .el-select-dropdown__item {
    padding: 0;
    .checkbox {
      padding: 0 20px;
    }
  }
}
</style>
