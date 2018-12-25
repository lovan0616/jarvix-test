<template>
  <div class="display-index-number-diff">
    <div class="row-label">
      <p class="label">{{ label }}</p>
      <p class="value">{{ value }}</p>
    </div>
    <div :class="['row-diff', `is-${diffType}`]" v-if="diff !== undefined">
      <p class="value">{{ diff }}</p>
      <p class="icon" v-if="diffType">
        <i v-if="diffType === 'increase'" class="el-icon-caret-top" />
        <i v-if="diffType === 'decrease'" class="el-icon-caret-bottom" />
        <i v-if="diffType === 'unchanged'" class="icon-dash"></i>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DisplayIndexNumberDiff',
  props: {
    label: { type: [String, Number], default: '' },
    value: { type: [String, Number], default: '' },
    diff: { type: [String, Number], default: '' },
    diffType: { type: String, default: '' }
  }
}
</script>
