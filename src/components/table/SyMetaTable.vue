<template>
  <div>
    <div class="meta-table-top-area">
      <div class="meta-table-top-area-right">
        {{ rightText }}
      </div>
    </div>
    <sy-table
      v-bind="$props"
    />
  </div>
</template>

<script>
import SyTable from './SyTable'

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
