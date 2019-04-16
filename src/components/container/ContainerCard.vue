<template>
  <div :class="['container-card', { 'is-full-height': fullHeight, 'is-bg': bg }]">
    <div :class="['card-title', `align-${titleAlign}`]" v-if="title !== undefined">
      {{ title }}
    </div>
    <slot></slot>
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
