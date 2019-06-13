<template>
  <div class="input-block"
    :class="{'has-error': errors.has(name)}"
  >
    <input class="input"
      :class="{valid: inputValue !== null && inputValue !== '' }"
      :type="type"
      :name="name"
      v-model.trim="inputValue"
    >
    <label class="placeholder" :for="name">{{ label }}</label>
    <div class="error-text"
      v-show="errors.has(name)"
    >{{ errors.first(name) }}</div>
  </div>
</template>
<script>
export default {
  inject: ['$validator'],
  name: 'InputBlock',
  props: {
    name: {
      type: String
    },
    label: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: null
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
