<template>
  <div class="schedule-index-page">
    <router-view :key="scheduleProjectId" />
    <schedule-helper v-if="isShowScheduleHelper"/>
  </div>
</template>

<script>
import { fetchProjectList } from '@/schedule/API/Project'
import { Message } from 'element-ui'
import ScheduleHelper from '@/schedule/components/schedule-helper/ScheduleHelper'
import { mapState, mapGetters } from 'vuex'
import store from '@/store'
import i18n from '@/lang/index.js'

export default {
  name: 'Index',
  components: {
    ScheduleHelper
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId']),
    ...mapState('scheduleSetting', ['scheduleProjects', 'scheduleProjectId', 'isShowScheduleHelper'])
  },
  destroyed () {
    this.$store.commit('scheduleSetting/setCurrentProjectId', null)
  },
  beforeRouteEnter (to, from, next) {
    // 進入子專案前，先確保真的有這個 project id
    const account_id = store.getters['userManagement/getCurrentAccountId']
    const group_id = store.getters['userManagement/getCurrentGroupId']
    const schedule_project_id = Number(to.params.schedule_project_id)
    
    const isProjectExist = store.state.scheduleSetting.scheduleProjects.some(item => item.id === schedule_project_id)
    if (isProjectExist) {
      store.commit('scheduleSetting/setCurrentProjectId', schedule_project_id)
      next()
    } else {
      fetchProjectList(to.params.group_id)
        .then(list => {
          if (list.length === 0 || !list.some(item => item.id === schedule_project_id)) {
            Message({
              message: i18n.t('schedule.project.projectNotExist'),
              type: 'warning',
              duration: 3 * 1000,
              showClose: true
            })
            return next({ name: 'ScheduleProjectList', params: { account_id, group_id } })
          }
          store.commit('scheduleSetting/setCurrentProjectId', schedule_project_id)
          store.commit('scheduleSetting/setProjects', list)
          next({ name: 'CurrentSimulation', params: { account_id, group_id, schedule_project_id } })
        })
        .catch(() => next({ name: 'ScheduleProjectList', params: { account_id, group_id } }))
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-index-page {
  height: 100%;
}
</style>