<template>
  <div>
    <router-view />
    <schedule-helper v-if="isShowScheduleHelper"/>
  </div>
</template>

<script>
import ScheduleHelper from '@/schedule/components/schedule-helper/ScheduleHelper'
import { mapState } from 'vuex'

export default {
  name: 'Index',
  components: {
    ScheduleHelper
  },
  computed: {
    ...mapState('scheduleSetting', ['isShowScheduleHelper'])
  }
}
</script>