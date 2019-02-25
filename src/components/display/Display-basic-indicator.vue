<template>
  <div class="display-basic-indicator">
    <div v-if="value !== ''" class="indicator-sub-title">{{subTitle}}</div>
    <div v-if="value !== ''" class="indicator-value">{{value}}</div>
    <div v-if="title !== ''" class="indicator-title">{{title}}</div>
  </div>
</template>

<script>

export default {
  name: 'DisplayBasicIndicator',
  props: {
    title: { type: [String, Number], default: '' },
    value: { type: [String, Number], default: '' },
    subTitle: { type: [String, Number], default: '' }
  }
}
</script>
