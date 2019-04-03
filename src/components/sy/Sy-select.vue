<template>
  <el-select :class="['sy-select', `theme-${theme}`]"
    v-model="value"
    :placeholder="placeholder"
    @change="$emit('update:selected', $event)"
  >
    <el-option
      v-for="item in items"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>

export default {
  name: 'SySelect',
  props: {
    selected: { type: [String, Number], default: undefined },
    items: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    theme: { type: String, default: 'default' }
  },
  data () {
    return {
      value: this.selected
    }
  },
  watch: {
    selected (e) {
      this.value = e
    }
  }
}
</script>
<style lang="scss">
.el-select-dropdown {
  border: none !important;

  &.el-popper[x-placement^="bottom"] {
    margin-top: -1px;

    .popper__arrow {
      display: none;
    }
  }
  &.el-popper[x-placement^="top"] {
    margin-bottom: 0;

    .popper__arrow {
      display: none;
    }
  }

  .el-select-dropdown__wrap {
    background-color: #D1E3E5;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .el-select-dropdown__item {
    color: #444;

    &.hover, &:hover, &.selected {
      background-color: #78A5A9;
    }

    &.selected {
      color: #fff;
    }
  }
}
</style>
