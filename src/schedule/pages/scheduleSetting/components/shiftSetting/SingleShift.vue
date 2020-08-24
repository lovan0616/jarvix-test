<template>
  <div class="single-shift">
    <i class="el-icon-time" />
    <el-time-select
      v-model="startTime"
      :placeholder="$t('schedule.base.startTime')"
      :clearable="false"
      :picker-options="{
        start: '00:00',
        step: '00:30',
        end: '24:00'
      }"
      prefix-icon="null"
      @change="changeTime"
    />
    <span class="conjunction">{{ $t('schedule.base.to') }}</span>
    <el-time-select
      v-model="endTime"
      :placeholder="$t('schedule.base.endTime')"
      :clearable="false"
      :picker-options="{
        start: '00:00',
        step: '00:30',
        end: '24:00',
        minTime: startTime
      }"
      prefix-icon="null"
      @change="changeTime"
    />
    <i
      class="el-icon-remove-outline"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
export default {
  name: 'SingleShift',
  props: {
    time: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      startTime: this.time.startTime,
      endTime: this.time.endTime
    }
  },
  methods: {
    changeTime () {
      this.$emit('update:time', {
        startTime: this.startTime,
        endTime: this.endTime
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.single-shift {
  display: inline-block;
  border-bottom: 1px solid #dedede;
  padding-left: 5px;
  padding-right: 5px;

  .conjunction {
    color: var(--color-text);
  }
  [class^="el-icon"] {
    font-size: 16px;
  }
  .el-icon-time {
    color: var(--color-text);
  }
  .el-icon-remove-outline {
    cursor: pointer;
    color: #bcbcbc;
  }
}
/deep/ .el-date-editor {
  width: 120px;
  &+.el-date-editor {
    margin-left: 8px;
  }
  .el-input__inner {
    color: var(--color-text-gray);
    text-align: center;
    background-color: transparent;
    border-radius: 0;
    border: none;
  }
}
</style>
