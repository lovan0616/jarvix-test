<template>
  <div>
    <router-view />
    <schedule-helper v-if="isShowScheduleHelper"/>
  </div>
</template>

<script>
import { fetchProjectList } from '@/schedule/API/Project'
import { Message } from 'element-ui'
import ScheduleHelper from '@/schedule/components/schedule-helper/ScheduleHelper'
import { mapState, mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'Index',
  components: {
    ScheduleHelper
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    ...mapState('scheduleSetting', ['scheduleProjects', 'scheduleProjectId', 'isShowScheduleHelper']),
  },
  destroyed () {
    this.$store.commit('scheduleSetting/setCurrentProjectId', null)
    this.$store.commit('scheduleSetting/setProjects', [])
  },
  beforeRouteEnter (to, from, next) {
    // 進入子專案前，先確保真的有這個 project id
    const projectId = to.params.schedule_project_id
    const isProjectExist = store.state.scheduleSetting.scheduleProjects.some(item => item.id === projectId)

    if (isProjectExist) {
      store.commit('scheduleSetting/setCurrentProjectId', projectId)
      next()
    } else {
      fetchProjectList(to.params.group_id)
        .then(list => {
          if (list.length === 0 || !list.some(item => item.id === projectId)) {
            Message({
              message: '不存在此排程專案',
              type: 'warning',
              duration: 3 * 1000,
              showClose: true
            })
            next({ name: 'ScheduleProjectList' })
          }
          store.commit('scheduleSetting/setCurrentProjectId', projectId)
          this.$store.commit('scheduleSetting/setProjects', list)
          next()
        })
        .catch(() => next({ name: 'ScheduleProjectList' }))
    }
  }
}
</script>