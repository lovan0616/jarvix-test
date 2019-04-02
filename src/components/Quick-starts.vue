<template>
  <div class="quick-starts">
    <div class="quick-starts-item"
      v-for="(item, index) in items"
      :key="index"
      @click="onItemClick($event, item)"
    >
      {{item}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'QuickStarts',
  props: {
    items: { type: Array, default: () => [] }
  },
  methods: {
    onItemClick (e, item) {
      this.$store.dispatch('bookmark/updateResultRouter', item)
    }
  }
}
</script>
