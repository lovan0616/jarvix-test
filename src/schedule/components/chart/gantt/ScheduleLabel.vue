<template>
  <div
    :style="{height: cellHeight + 'px', lineHeight: cellHeight + 'px'}"
    class="schedule-label"
  >
    <span 
      v-if="info.operation" 
      class="schedule-label__name">{{ info.operation }}</span>
    <span 
      v-else 
      class="schedule-label__name">{{ $t(`schedule.setting.${info.reason}`) }}</span>
    <span class="schedule-label__name">{{ info.equipment }}</span>
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
.schedule-label {
  display: flex;
  &__name {
    flex: 1;
    text-align: center;
  }
}
</style>
