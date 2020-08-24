<template>
  <el-select
    v-model="selectedValue"
    :placeholder="$t('schedule.base.pleaseSelect')"
    class="default-select"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'DefaultSelect',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    selectedValue: {
      get () {
        return this.value
      },
      set (value) {
        if (value === this.value) return
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input {
  .el-input__inner {
    height: 40px;
    line-height: 40px;
    border: 0;
    border-bottom: 1px solid var(--color-text);
    border-radius: 0;
    color: #ffffff;
    background: transparent;
    padding-left: 0;

    &::placeholder {
      color: #ffffff;
    }
  }
  &.el-select .el-input .el-select__caret {
    color: #ffffff;
  }

  &.el-select:hover .el-input__inner,
  &.el-select .el-input__inner:focus,
  &.el-select .el-input.is-focus .el-input__inner {
    border-color: #ffffff;
  }
}
</style>
