<template>
  <div class="sy-meta-table">
    <div class="meta-table-top-area">
      <div class="meta-table-top-area-right">{{rightText}}</div>
    </div>
    <sy-table
      v-bind="$props"
    ></sy-table>
  </div>
</template>

<script>
import SyTable from './Sy-table'

export default {
  name: 'SyMetaTable',
  components: {
    SyTable
  },
  props: {
    ...SyTable.props,
    rightText: { type: String, default: '' }
  }
}
</script>
