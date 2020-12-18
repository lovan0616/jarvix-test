<template>
  <writing-dialog
    :title="$t('miniApp.createDashboard')"
    :button="$t('button.create')"
    :show-both="true"
    @closeDialog="$emit('close')"
    @confirmBtn="createDashboard"
  >
    <input-verify
      v-validate="`required|max:${max}`"
      v-model="dashboardName"
      :placeholder="$t('miniApp.pleaseTypeDashboardName')"
      name="dashboardName"
    />
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import { v4 as uuidv4 } from 'uuid'

export default {
  inject: ['$validator'],
  name: 'CreateDashboardDialog',
  components: {
    WritingDialog,
    InputVerify
  },
  data () {
    return {
      dashboardName: null
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  methods: {
    createDashboard () {
      this.$validator.validateAll().then(valid => {
        if (!valid) return

        this.$emit('create', {
          name: this.dashboardName,
          id: uuidv4()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>