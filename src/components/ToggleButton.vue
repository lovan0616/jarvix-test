<template>
  <label class="toggle-button">
    <input 
      v-model="inputValue"
      type="checkbox"
      name
    >
    <div class="slider"/>
  </label>
</template>
<script>
export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>