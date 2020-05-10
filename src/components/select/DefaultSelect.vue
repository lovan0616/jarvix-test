<template>
  <el-select class="sy-select theme-dark"
    v-model="selectedValue"
    :placeholder="placeholder"
    :no-data-text="$t('message.noData')"
    @change="$emit('change', $event)"
    :disabled="isDisabled"
    :popper-append-to-body="false"
    style="text-align:left;"
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
    placeholder: { type: String, default: '' },
    isDisabled: {type: Boolean, default: false}
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
