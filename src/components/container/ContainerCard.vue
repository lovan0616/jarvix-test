<template>
  <div :class="['container-card', { 'is-full-height': fullHeight, 'is-bg': bg }]">
    <div 
      v-if="title !== undefined" 
      :class="['card-title', `align-${titleAlign}`]">
      {{ title }}
    </div>
    <slot/>
  </div>
</template>

<script>

export default {
  name: 'ContainerCard',
  props: {
    fullHeight: { type: Boolean, default: false },
    title: { type: [String, Number], default: undefined },
    titleAlign: { type: String, default: 'left' },
    bg: { type: Boolean, default: true }
  }
}
</script>
