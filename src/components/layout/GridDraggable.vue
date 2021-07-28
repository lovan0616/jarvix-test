<template>
  <draggable
    :list="components"
    :move="logDraggingMovement"
    :disabled="disable"
    class="custom-draggable-grid"
    ghost-class="dragging-ghost"
    @end="handleDragEnd()"
    :style="settingStyles"
  >
    <slot />
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  props: {
    components: {
      type: Array,
      default: null
    },
    finishNotice: {
      type: String,
      default: null
    },
    disable: {
      type: Boolean,
      default: false
    },
    rowHeight: {
      type: Number,
      default: 30
    },
    gap: {
      type: [Array, Number],
      default: 10
    }
  },
  computed: {
    settingStyles () {
      const gap = typeof this.gap === 'number' ? [this.gap, this.gap] : this.gap
      return {
        '--row-height': `${this.rowHeight}px`,
        '--gap-x': `${gap[0]}px`,
        '--gap-y': `${gap[1]}px`
      }
    }
  },
  components: {
    draggable
  },
  methods: {
    logDraggingMovement (e) {
      const { index, futureIndex } = e.draggedContext
      this.draggedContext = { index, futureIndex }
    },
    handleDragEnd () {
      if (this.finishNotice) {
        this.updateComponentOrder(this.finishNotice)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dragging-ghost {
  background: #192323;
  opacity: 0.5;
}

.custom-draggable-grid {
  display: grid;
  gap: var(--gap-x) var(--gap-y);
  grid-auto-flow: dense;
  grid-auto-rows: var(--row-height);
  grid-template-columns: repeat(12, 1fr);

  @for $i from 1 through 12 {
    ::v-deep>.col-#{$i} {
      grid-column-end: span #{$i};
      width: auto;
    }
    ::v-deep>.row-#{$i} {
      grid-row-end: span #{$i};
      height: auto;
    }
  }
}
</style>
