<template>
  <div class="setting setting--common">
    <div class="setting__header">
      <h2 class="header__title">
        {{ $t('schedule.setting.commonDataSetting') }}
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
        <!-- 鈺齊只需要轉換時間 -->
        <single-common-file
          v-show="!isYKSchedule || file.code === 'transfer_time'"
          :file-data="file"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SingleCommonFile from './SingleCommonFile'
import { fetchDataBoundStatus } from '@/schedule/API/Project'
import { DATA_CATEGORY } from '@/schedule/utils/enum'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CommonDataSetting',
  components: {
    SingleCommonFile
  },
  data () {
    return {
      isLoading: true,
      files: []
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    ...mapGetters('scheduleSetting', ['isYKSchedule'])
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
            if (file.category === DATA_CATEGORY.RAW_DATA) this.files.push(file)
          })
        })
        .catch(() => {})
        .finally(() => this.isLoading = false)
    }
  }
}
</script>
