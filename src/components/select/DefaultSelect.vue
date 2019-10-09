<template>
  <el-select class="sy-select"
    v-model="selectedValue"
    :placeholder="placeholder"
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
  name: 'DefaultSelect',
  props: {
    value: { type: [String, Number], default: undefined },
    optionList: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' }
  },
  computed: {
    selectedValue: {
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
