<template>
  <div class="input-verify">
    <input
      v-model.trim="inputValue"
      :class="{'error': errors.has(name)}"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      class="input-verify-text"
    >
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
  inject: ['$validator'],
  name: 'DataInputVerify',
  props: {
    name: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
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
.input-verify {
  position: relative;

  .input-verify-text {
    width: 100%;
    height: 32px;
    font-size: 14px;
    color: $theme-text-color;
    background-color: transparent;
    border: 0px;
    border-bottom: 1px solid $theme-text-color;
    transition: all .2s linear;

    &:focus {
      outline: none;
    }

    &.error {
      border-bottom-color: $theme-color-danger;
      margin-bottom: 8px;
    }
  }

  .input-error {
    position: absolute;
    top: 36px;
    text-align: left;
  }
}
</style>
