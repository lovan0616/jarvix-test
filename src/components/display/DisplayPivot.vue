<template>
  <div class="display-pivot-table">
    <pivot v-bind="$props">
      <!-- Optional slots can be used for formatting table headers and values, see documentation below -->
      <template slot="value" slot-scope="{ value }">
        <div class="empty-content" v-if="value == 0">--</div>
        <div class="td-content" v-else v-html="value"></div>
      </template>
    </pivot>
  </div>
</template>
<script>
import Pivot from '@marketconnect/vue-pivot-table'

export default {
  name: 'DisplayPivot',
  components: { Pivot },
  props: Pivot.props
}
</script>
<style lang="scss">
.display-pivot-table {
  .table-responsive {
    overflow: auto;

    table {
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid rgba(#fff, 0.3);
    }

    th {
      text-align: left;
      padding: 4px 8px;
    }

    td.font-weight-bold {
      font-weight: bold;
      padding: 0 12px;
    }

    td.text-right {
      min-width: 116px;
      padding: 8px;

      .empty-content {
        min-width: auto;
      }

      .td-content {
      }
    }
  }

  .btn-outline-primary {
    display: none;
    color: #65cfd9;
    background-color: rgba(255, 255, 255, .16);
    padding: 15px 12px;
    border-radius: 4px;
    border: 0;
    margin-bottom: 6px;
  }
}
</style>
