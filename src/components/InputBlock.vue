<template>
  <div 
    :class="{'has-error': errors.has(name)}"
    class="input-block"
  >
    <input 
      :class="{valid: inputValue !== null && inputValue !== '' }"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      v-model.trim="inputValue"
      :disabled="disabled"
      class="input"
    >
    <label 
      :for="name" 
      class="placeholder">{{ label }}</label>
    <div 
      v-show="errors.has(name)"
      class="error-text"
    >{{ errors.first(name) }}</div>
  </div>
</template>
<script>
export default {
  inject: ['$validator'],
  name: 'InputBlock',
  props: {
    name: {
      type: String,
      default: ''
    },
    label: {
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
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
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
