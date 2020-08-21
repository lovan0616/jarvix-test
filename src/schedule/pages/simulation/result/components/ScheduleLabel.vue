<template>
  <div
    class="eqip-name"
    :style="{height: cellHeight + 'px', lineHeight: cellHeight + 'px'}"
  >
    {{ info.name }}
  </div>
</template>
<script>
export default {
  name: 'ScheduleLabel',
  props: {
    info: {
      type: Object,
      required: true
    },
    cellHeight: {
      type: Number,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.eqip-name {
  text-align: center;
}
</style>
