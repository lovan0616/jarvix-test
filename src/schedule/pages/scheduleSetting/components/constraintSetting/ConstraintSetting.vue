<template>
  <div class="setting setting--constraint">
    <div class="setting__header">
      <h2 class="header__title">
        {{ $t('schedule.setting.extraConstraintSetting') }}
      </h2>
    </div>
    <div class="setting__body">
      <spinner v-if="isLoading" />
      <div
        v-for="file in files"
        v-else
        :key="file.code"
        class="file"
      >
        <single-constraint-file :file-data="file" />
      </div>
    </div>
  </div>
</template>

<script>
import SingleConstraintFile from './SingleConstraintFile'
import { fetchDataBoundStatus } from '@/schedule/API/Project'
import { DATA_CATEGORY } from '@/schedule/utils/enum'
import { mapState } from 'vuex'

export default {
  name: 'ConstraintSetting',
  components: {
    SingleConstraintFile
  },
  data () {
    return {
      isLoading: true,
      files: []
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId'])
  },
  mounted () {
    this.fetchFiles()
  },
  methods: {
    fetchFiles () {
      this.isLoading = true
      fetchDataBoundStatus(this.scheduleProjectId)
        .then(files => {
          files.forEach(file => {
            if (file.category === DATA_CATEGORY.CONSTRAINT) this.files.push(file)
          })
        })
        .catch(() => {})
        .finally(() => this.isLoading = false)
    }
  }
}
</script>
