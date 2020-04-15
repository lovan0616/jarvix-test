<template>
  <el-select class="sy-select theme-dark"
    v-model="selectedValue"
    :placeholder="placeholder"
    @change="$emit('change', $event)"
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
    value: { type: [String, Number, Boolean], default: undefined },
    optionList: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' }
  },
  computed: {
    selectedValue: {
      get () {
        return this.value
      },
      set (value) {
        // 選取前後值一致則不更新
        if (value === this.value) return
        this.$emit('input', value)
      }
    }
  }
}
</script>
