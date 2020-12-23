<template>
  <el-select
    ref="input"
    v-model="selectedValue"
    :placeholder="placeholder"
    :no-data-text="$t('message.noData')"
    :no-match-text="$t('message.noMatchData')"
    :disabled="isDisabled"
    :popper-append-to-body="false"
    :size="size"
    :remote="remote"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :filterable="filterable"
    v-bind="filterMethod ? {filterMethod: categoryFilter} : ''"
    class="sy-select theme-dark"
    style="text-align:left;"
    @change="$emit('change', $event)"
  >
    <el-option
      v-for="(option, index) in optionList"
      :key="index"
      :label="option.name"
      :value="option.value"
    >
      <slot 
        :option="option"
        :index="index"
        name="option-content"
      />
    </el-option>
  </el-select>
</template>

<script>

export default {
  name: 'DefaultSelect',
  props: {
    value: { type: [String, Number, Boolean, Array], default: undefined },
    optionList: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    isDisabled: {type: Boolean, default: false},
    size: { type: String, default: '' },
    remote: { type: Boolean, default: false },
    multiple: {type: Boolean, default: false},
    collapseTags: {type: Boolean, default: false},
    filterable: {type: Boolean, default: false},
    filterMethod: {type: Boolean, default: false}
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
  },
  methods: {
    categoryFilter (query) {
      this.$emit('filter', query)
    },
    focusInput () {
      this.$refs.input.focus()
    }
  }
}
</script>
