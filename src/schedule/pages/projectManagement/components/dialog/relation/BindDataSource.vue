<template>
  <section class="relation-container__section">
    <div class="relation-container__section-title">
      Step1: {{ $t('schedule.project.chooseDataSource') }}
    </div>
    <div class="form">
      <div class="form-fields">
        <div class="form-field">
          <div class="field-label">
            *{{ $t('schedule.project.dataSourceName') }}
          </div>
          <spinner
            v-if="isLoadingDataSources"
            :title="$t('editing.dataDownloading')"
            class="datasource-loading-spinner"
            size="10"
          />
          <default-select
            v-else
            v-model="selectedDatasource"
            :options="dataSourceOptions"
          />
          <button
            :disabled="isRebinding"
            class="btn btn-default btn-rebind-ds"
            @click="rebindDataSource"
          >
            <spinner
              v-show="isRebinding"
              size="10"
            />
            {{ $t('schedule.binding.rebind') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getDataSourceList } from '@/API/DataSource'
import { rebindDataSource } from '@/schedule/API/Project'
import { Message } from 'element-ui'

export default {
  name: 'BindDataSource',
  components: {
  },
  props: {
    projectInfo: {
      type: Object,
      default: () => {}
    },
    datasourceId: {
      type: Number,
      default: null
    }
  },
  data: () => {
    return {
      isLoadingDataSources: true,
      isRebinding: false,
      dataSourceList: []
    }
  },
  computed: {
    selectedDatasource: {
      get () {
        return this.datasourceId
      },
      set (value) {
        this.$emit('update:datasourceId', value)
      }
    },
    dataSourceOptions () {
      return this.dataSourceList.map(item => ({ value: item.id, label: item.name }))
    }
  },
  mounted () {
    getDataSourceList()
      .then(dataSourceList => this.dataSourceList = dataSourceList)
      .catch(() => {})
      .finally(() => this.isLoadingDataSources = false)
  },
  methods: {
    rebindDataSource () {
      // 並未改變資料源
      if (this.selectedDatasource === this.projectInfo.datasourceId) {
        Message({
          message: this.$t('schedule.binding.alreadyBoundToCertainDataSource', { datasource: this.projectInfo.datasourceName }),
          type: 'info',
          duration: 10 * 1000,
          showClose: true
        })
        return
      }

      this.isRebinding = true
      rebindDataSource({
        datasourceId: this.selectedDatasource,
        id: this.projectInfo.id
      })
        .then(() => {
          const datasource = this.dataSourceOptions.find(item => item.value === this.datasourceId)
          Message({
            message: this.$t('schedule.binding.successfullyRebindDataSource', { datasource: datasource.label }),
            type: 'info',
            duration: 10 * 1000,
            showClose: true
          })
          this.$emit('rebound')
        })
        .catch(() => {})
        .finally(() => this.isRebinding = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-rebind-ds {
  margin-left: auto;
}
</style>
