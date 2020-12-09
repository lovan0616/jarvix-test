<template>
  <writing-dialog
    :title="$t('miniApp.createRelation')"
    :button="$t('button.create')"
    :show-both="true"
    @closeDialog="$emit('close')"
    @confirmBtn="createComponentRelation"
  >
    <default-select
      v-model="selectedDashboardId"
      :option-list="dashboardOptions"
      :placeholder="$t('miniApp.selectDashboard')"
      class="dialog-select"
    />
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'CreateComponentRelationDialog',
  components: {
    WritingDialog,
    DefaultSelect
  },
  props: {
    dashboardList: {
      type: Array,
      default: () => []
    },
    dashboardId: {
      type: String,
      default: '',
      required: true
    },
    relatedDashboard: {
      type: Object,
      default: null,
      required: true
    }
  },
  data () {
    return {
      selectedDashboardId: null
    }
  },
  computed: {
    dashboardOptions () {
      return this.dashboardList
        .filter(item => item.id !== this.dashboardId)
        .map(item => ({
          value: item.id,
          name: item.name
        }))
    },
    selectedDashboardName () {
      const option = this.dashboardOptions.find(item => item.value === this.selectedDashboardId)
      return option ? option.name : null
    }
  },
  mounted () {
    this.selectedDashboardId = this.relatedDashboard.id
  },
  methods: {
    createComponentRelation () {
      this.$emit('create', {
        id: this.selectedDashboardId,
        name: this.selectedDashboardName
      })
    }
  }
}
</script>
