<template>
  <div class="display-index-number">
    <p class="index-numbers-label">
      {{ label }}
    </p>
    <p class="index-numbers-value">
      {{ value }}
    </p>
  </div>
</template>

<script>

export default {
  name: 'DisplayIndexNumber',
  props: {
    label: { type: [String, Number], default: '' },
    value: { type: [String, Number], default: '' }
  }
}
</script>
