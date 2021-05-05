<template>
  <div class="default-input">
    <el-input
      v-model.trim="inputValue"
      :placeholder="placeholder"
      :type="type"
      size="small"
    >
      <template slot="prepend">
        <slot name="prepend" />
      </template>
      <template slot="append">
        <slot name="append" />
      </template>
    </el-input>
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
  name: 'DefaultInput',
  inject: ['$validator'],
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  color: var(--color-text-gray);
  border: 0;
  border-bottom: 1px solid var(--color-text);
  background-color: transparent;
  border-radius: 0;
  padding-left: 0;
}

/deep/ .el-input-group__prepend {
  padding: 0;
  color: var(--color-text);
  border: 0;
  background-color: transparent;
}

/deep/ .el-input-group__append {
  color: var(--color-text);
  border: 0;
  background-color: transparent;
}
.default-input {
  position: relative;
  .input-error {
    position: absolute;
    left: 0;
    top: calc(100% + 2px);
  }
}
</style>
