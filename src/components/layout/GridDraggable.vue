<template>
  <draggable
    :list="components"
    :move="logDraggingMovement"
    :disabled="disable"
    class="custom-draggable-grid"
    ghost-class="dragging-ghost"
    @end="handleDragEnd()"
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
  gap: 10px;
  grid-auto-flow: dense;
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
