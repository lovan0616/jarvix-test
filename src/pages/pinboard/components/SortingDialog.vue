<template>
  <div class="sorting-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">{{ $t('editing.sortSetting') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
      </div>
      <hint-info-block
        :msg-list="[$t('editing.dragAndSort')]"
        inline
      />
    </div>
  </div>
</template>

<script>
import HintInfoBlock from '@/components/display/HintInfoBlock'

export default {
	name: 'SortingDialog',
	components: {
		HintInfoBlock
	},
	methods: {
		closeDialog () {
      this.$emit('close')
    },
	}
}
</script>
<style lang="scss" scoped>
.sorting-dialog {
  
}
</style>
