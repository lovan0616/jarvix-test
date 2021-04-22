<template>
  <el-select
    ref="input"
    v-model="selectedValue"
    :placeholder="placeholder"
    :no-data-text="$t('message.noData')"
    :no-match-text="$t('message.noMatchData')"
    :disabled="isDisabled"
    :popper-append-to-body="popperAppendToBody"
    :size="size"
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
      :key="option.value"
      :label="option.name"
      :value="option.value"
    >
      <slot 
        :option="option"
        :index="index"
        name="option-content"
      />
    </el-option>
    <observer
      v-if="enableLazyLoading"
      :options="observerOptions"
      @intersect="$emit('intersect')"
    />
  </el-select>
</template>

<script>
import Observer from '@/components/Observer'

export default {
  name: 'DefaultSelect',
  components: {
    Observer
  },
  props: {
    value: { type: [String, Number, Boolean, Array], default: undefined },
    optionList: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    isDisabled: {type: Boolean, default: false},
    size: { type: String, default: '' },
    multiple: {type: Boolean, default: false},
    collapseTags: {type: Boolean, default: false},
    filterable: {type: Boolean, default: false},
    filterMethod: {type: Boolean, default: false},
    enableLazyLoading: {type: Boolean, default: false},
    popperAppendToBody: {type: Boolean, default: false},
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
    },
    observerOptions () {
      return {
        rootClassName: '.el-select-dropdown__wrap',
        rootMargin: 0,
        threshold: 0,
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
