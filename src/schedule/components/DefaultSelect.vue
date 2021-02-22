<template>
  <div class="default-select">
    <el-select
      v-model="selectedValue"
      :placeholder="$t('schedule.base.pleaseSelect')"
      :filterable="filterable"
      popper-class="ss-select"
    >
      <el-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
    <div
      v-show="errors.has(name)"
      class="input-error error-text"
    >
      {{ errors.first(name) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefaultSelect',
  inject: ['$validator'],
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number],
      default: ''
    },
    filterable: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
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
.default-select {
  padding-bottom: 20px;
  position: relative;
  .input-error {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
