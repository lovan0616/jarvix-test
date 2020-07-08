<template>
  <div class="input-verify">
    <input
      v-model.trim="inputValue"
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
    <slot name="action"/>
  </div>
</template>
<script>
export default {
  inject: ['$validator'],
  name: 'InputVerify',
  props: {
    name: {
      type: String,
      default: ''
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
      type: [Number, String],
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
    height: 40px;
    font-size: 16px;
    color: #aaa;
    margin-bottom: 36px;
    background-color: transparent;
    border: 0px;
    border-bottom: 1px solid #fff;

    &:focus {
      outline: none;
    }
  }

  .input-error {
    position: absolute;
    bottom: 12px;
    text-align: left;
  }
}

</style>
