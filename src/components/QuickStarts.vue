<template>
  <div class="quick-starts">
    <div class="quick-starts-item"
      v-for="(item, index) in items"
      :key="index"
      :class="{'is-default': hasDefault && index === 0}"
      @click="onItemClick($event, item)"
    >
      <svg-icon
        v-if="hasDefault && index === 0"
        icon-class="folder"
        class="folder-icon"
      ></svg-icon>{{item}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'QuickStarts',
  props: {
    items: { type: Array, default: () => [] },
    hasDefault: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onItemClick (e, item) {
      this.$store.commit('dataSource/setAppQuestion', item)
      this.$store.dispatch('dataSource/updateResultRouter', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.quick-starts {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 0 rem(-16px);

  .quick-starts-item {
    flex: 1;
    min-width: rem(220px);
    margin: rem(16px);
    padding: rem(16px);
    cursor: pointer;
    text-align: left;
    border-top: 4px solid $theme-color-primary;
    border-radius: $theme-border-radius-base;
    background: $theme-color-white;
    box-shadow: $theme-box-shadow-m;

    &.is-default {
      color: $theme-color-primary;
    }
  }

  .folder-icon {
    margin-right: 10px;
  }
}
</style>
