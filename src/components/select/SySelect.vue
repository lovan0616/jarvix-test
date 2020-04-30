<template>
  <el-select :class="['sy-select', `theme-${theme}`]"
    v-model="value"
    :placeholder="placeholder"
    :no-data-text="$t('message.noData')"
    @change="$emit('update:selected', $event)"
  >
    <el-option
      v-for="item in items"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>

export default {
  name: 'SySelect',
  props: {
    selected: { type: [String, Number], default: undefined },
    items: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    theme: { type: String, default: 'default' }
  },
  data () {
    return {
      value: this.selected
    }
  },
  watch: {
    selected (e) {
      this.value = e
    }
  }
}
</script>
