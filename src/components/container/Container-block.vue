<template>
  <div
    :class="[
      'container-block',
      `flex-direct-${flexDirection}`,
        {
          'is-flexible': flexible,
          'is-full-height': fullHeight,
          'is-no-padding': noPadding,
          'is-bg': bg,
          'is-inner-bg': innerBg,
          'is-inner-padding': innerPadding,
          'has-header': title,
          'is-no-header-padding': noHeaderPadding,
          'is-bg-dark': bgDark,
          'is-body-flexible': bodyFlexible,
          'is-flow-reverse': flowReverse,
          'is-outspread': outspread,
          'is-same-height': sameHeight
        }
    ]"
    :style="rootStyle"
  >
    <div v-if="title" :class="['block-header', `align-${titleAlign}`]">
      <div v-if="title" class="block-title">{{title}}</div>
      <div v-if="rightTitle" class="block-right-title">{{rightTitle}}</div>
    </div>
    <div :class="['block-body', `flex-direct-${bodyFlexDirection}`]">
      <div v-if="flexible" class="block-row">
        <slot></slot>
      </div>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ContainerBlock',
  props: {
    title: { type: String, default: '' },
    size: { type: Number, default: 100 },
    flexible: { type: Boolean, default: false },
    fullHeight: { type: Boolean, default: false },
    height: { type: String, default: 'auto' },
    minHeight: { type: String, default: 'auto' },
    noPadding: { type: Boolean, default: false },
    bg: { type: Boolean, default: false },
    innerBg: { type: Boolean, default: false },
    innerPadding: { type: Boolean, default: false },
    noHeaderPadding: { type: Boolean, default: false },
    titleAlign: { type: String, default: 'left' },
    bgDark: { type: Boolean, default: false },
    bodyFlexible: { type: Boolean, default: false },
    bodyFlexDirection: { type: String, default: 'row' },
    flowReverse: { type: Boolean, default: false },
    rightTitle: { type: String, default: '' },
    flexDirection: { type: String, default: 'column' },
    outspread: { type: Boolean, default: false },
    sameHeight: { type: Boolean, default: false }
  },
  computed: {
    rootStyle () {
      return {
        width: (this.size) ? `${this.size}%` : '',
        height: this.height,
        minHeight: this.minHeight
      }
    }
  }
}
</script>
