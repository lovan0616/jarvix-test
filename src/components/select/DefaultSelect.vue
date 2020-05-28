<template>
  <el-select 
    v-model="selectedValue"
    :placeholder="placeholder"
    :no-data-text="$t('message.noData')"
    :disabled="isDisabled"
    :popper-append-to-body="false"
    :size="size"
    class="sy-select theme-dark"
    style="text-align:left;"
    @change="$emit('change', $event)"
  >
    <el-option
      v-for="option in optionList"
      :key="option.value"
      :label="option.name"
      :value="option.value"
    />
  </el-select>
</template>

<script>

export default {
  name: 'DefaultSelect',
  props: {
    value: { type: [String, Number, Boolean], default: undefined },
    optionList: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    isDisabled: {type: Boolean, default: false},
    size: { type: String, default: '' }
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
