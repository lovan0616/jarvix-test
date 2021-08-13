<template>
  <button
    v-if="noTooltip"
    class="filter-status-badge"
    :class="{ active: active }"
  >
    {{ badgeText }}
  </button>
  <el-tooltip
    v-else
    placement="bottom"
    popper-class="filter-status-popper"
  >
    <slot
      slot="content"
      name="content"
    />
    <button
      class="filter-status-badge"
      :class="{ active: active }"
    >
      {{ badgeText }}
    </button>
  </el-tooltip>
</template>

<script>
export default {
  name: 'FilterStatusBadge',
  props: {
    active: {
      type: Boolean,
      default: () => false
    },
    noTooltip: {
      type: Boolean,
      default: () => false
    },
    badgeText: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-status-badge {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: #ddd;
  font-size: 12px;
  padding: 4px 12px;
  transition: all 0.3s;

  &.active {
    border-color: #2ad2e2;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>

<style lang="scss">
.filter-status-popper {
  background-color: #233131 !important;
  color: #ddd !important;

  .popper__arrow,
  .popper__arrow::after {
    border-bottom-color: #233131 !important;
  }
}
</style>
