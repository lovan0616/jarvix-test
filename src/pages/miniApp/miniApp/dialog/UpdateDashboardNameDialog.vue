<template>
  <writing-dialog
    :title="$t('miniApp.updateDashboardName')"
    :button="$t('button.save')"
    :show-both="true"
    @closeDialog="$emit('close')"
    @confirmBtn="updateDashboardName"
  >
    <input-verify
      v-validate="`required|max:${max}`"
      v-model="newDashboardName"
      :placeholder="$t('miniApp.pleaseTypeDashboardName')"
      name="dashboardName"
    />
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'

export default {
  inject: ['$validator'],
  name: 'UpdateDashboardNameDialog',
  components: {
    WritingDialog,
    InputVerify
  },
  props: {
    originalDashboardName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newDashboardName: null
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
  },
  mounted () {
    this.newDashboardName = this.originalDashboardName
  },
  methods: {
    updateDashboardName () {
      this.$validator.validateAll().then(valid => {
        if (!valid) return

        this.$emit('confirm', this.newDashboardName)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>