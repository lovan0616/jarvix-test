<template>
  <el-collapse v-model="activeCollapseItems">
    <el-collapse-item
      v-for="(shifts, day, dayIndex) in worktimes"
      :key="`${dayIndex}-${shifts.length}`"
      :title="$t('schedule.setting.weekdayShift', { weekday: $t(`schedule.base.${day}`) })"
      :name="dayIndex"
    >
      <single-shift
        v-for="(shift, shiftIndex) in shifts"
        :key="`${day}-${shiftIndex}`"
        :time.sync="worktimes[day][shiftIndex]"
        @delete="deleteShift(day, shiftIndex)"
      />
      <default-button
        type="secondary"
        @click="addShift(day)"
      >
        <i class="el-icon-plus" />
        {{ $t('schedule.setting.addPeriod') }}
      </default-button>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import moment from 'moment'
import SingleShift from './SingleShift'

export default {
  name: 'ShiftSetting',
  components: {
    SingleShift
  },
  props: {
    worktimes: {
      type: Object,
      default: () => {}
    },
    collapseAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      allItems: [0, 1, 2, 3, 4, 5, 6],
      activeCollapseItems: [0, 1, 2, 3, 4, 5, 6]
    }
  },
  watch: {
    collapseAll: {
      immediate: true,
      handler (value) {
        this.activeCollapseItems = value ? [] : this.allItems
      }
    }
  },
  methods: {
    addShift (dayIndex) {
      this.worktimes[dayIndex].push({
        startTime: moment().startOf('day').format('HH:mm'),
        endTime: moment().startOf('day').format('HH:mm')
      })
    },
    deleteShift (day, shiftIndex) {
      this.worktimes[day].splice(shiftIndex, 1)
    }
  }
}
</script>

<style lang="scss" scoped>

.single-shift {
  margin-right: 24px;
  margin-bottom: 8px;
}
.default-button {
  display: block;
  margin-top: 8px;
}

</style>
