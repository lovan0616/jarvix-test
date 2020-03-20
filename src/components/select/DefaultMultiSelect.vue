<template>
  <el-select class="sy-multi-select theme-dark"
    v-model="values"
    :placeholder="placeholder"
    multiple
  >
    <el-option
      v-for="option in optionList"
      :key="option.value"
      :label="option.name"
      :value="option.value"
    ></el-option>
  </el-select>
</template>

<script>

export default {
  name: 'DefaultMultiSelect',
  props: {
    values: { type: Array, default: [] },
    optionList: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' }
  }
  // computed: {
  //   selectedValue: {
  //     get () {
  //       return this.value
  //     },
  //     set (value) {
  //       this.$emit('input', value)
  //     }
  //   }
  // }
}
</script>
<style lang="scss">
.sy-multi-select.theme-dark {
  width: 240px !important;
  .el-input__inner {
    border: 0;
    border-radius: 0;
    color: #ffffff;
    background: transparent;

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

  .el-input--suffix .el-input__inner {
    padding-right: 0;
  }

  .el-tag {
    background: transparent;
    border-color: #979797;
    color: #979797;
    margin: 0 6px 0 0;
    padding: 0 10px;
  }
  .el-tag__close.el-icon-close {
    background-color: #979797;
    color: #fff;
  }
}

.el-select-dropdown__item.selected {
  background-color: #979797 !important;
  color: #fff !important;
}
</style>
