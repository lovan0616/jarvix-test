<template>
  <custom-dropdown-select
    :data-list="scheduleProjects"
    :selected-id="scheduleProjectId"
    trigger="hover"
    class="project-switcher"
    @select="switchProject($event)"
  >
    <template v-slot:display>
      <div 
        v-if="getCurrentProject" 
        class="project-switcher__label">
        <div class="project-switcher__label-text">{{ getCurrentProject.name }}</div>
        <svg-icon 
          icon-class="dropdown" 
          class="project-switcher__label-icon"/>
      </div>
      <span v-else>Nae</span>
    </template>
  </custom-dropdown-select>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'

export default {
  name: 'ProjectSwitcher',
  components: {
    CustomDropdownSelect
  },
  data: () => {
    return {
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId']),
    ...mapGetters('scheduleSetting', ['getCurrentProject']),
    ...mapState('scheduleSetting', ['scheduleProjectId', 'scheduleProjects']),
  },
  methods: {
    switchProject (projectId) {
      // 切換子專案時，清除前一個子專案的模擬進度
      this.$store.dispatch('simulation/resetSimulationProgress')

      this.$store.commit('updateAppLoadingStatus', true)
      this.$store.commit('scheduleSetting/setCurrentProjectId', projectId)
      this.$router.push({ name: 'ScheduleProject',
        params: {
          'account_id': this.getCurrentAccountId,
          'group_id': this.getCurrentGroupId,
          'schedule_project_id': projectId
        }
      })
      // 因切換專案是同步行為，製造一點過場的感覺
      setTimeout(() => this.$store.commit('updateAppLoadingStatus', false), 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-switcher {
  margin-right: 20px;
  &__label {
    display: flex;
    align-items: center;
    background: rgba(50, 75, 78, 0.6);
    line-height: initial;
    border-radius: 16px;
    padding: 5px 15px;
    color: #2AD2E2;

    &-icon {
      margin-left: 6px;
      width: 8px;
    }

    &-text {
      max-width: 105px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
}
</style>
