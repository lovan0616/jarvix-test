<template>
  <div class="file__item">
    <div class="file__item-info">
      <div class="file__item-title">
        {{ $t(`schedule.setting.extraConstraint${snakeToPascal(fileData.code)}`) }}
      </div>
      <div class="file__item-description">
        <div 
          :class="isEmpty(fileData.name)"
          class="file__item-name" >
          {{ $t('schedule.setting.fileName') }}：{{ fileData.name || $t('schedule.setting.noFileSelected') }}
        </div>
        <div 
          :class="isEmpty(fileData.updateDate)"
          class="file__item-date"
        >
          {{ $t('schedule.setting.updatedDate') }}：{{ fileData.updateDate | convertTimeStamp }}
        </div>
      </div>
    </div>
    <div class="file__item-button-block">
      <a
        :href="require(`@/schedule/files/${fileData.code}.csv`)"
        :download="`${fileData.code}.csv`"
        class="file__item-button btn btn-secondary"
      >
        {{ $t('schedule.button.templateFileDownload') }}
      </a>
    </div>
  </div>
</template>

<script>
import { snakeToPascal } from '@/schedule/utils/mixins'

export default {
  name: 'SingleConstraintFile',
  props: {
    fileData: {
      type: Object,
      required: true
    }
  },
  methods: {
    isEmpty (value) {
      return value ? '' : 'is-empty'
    },
    snakeToPascal
  }
}
</script>

<style lang="scss" scoped>
.file__item {
  &-button {
    display: flex;
    align-items: center;
  }
}
.spinner-block {
  height: 32px;
  width: 100px;
  padding: 2px 0;
}
</style>
