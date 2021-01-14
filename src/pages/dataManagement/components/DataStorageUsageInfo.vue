<template>
  <div class="info-block">
    <div class="info-block__label">
      {{ displayedDataStorageUsageRate }}
    </div>
    <div class="info-block__detail">
      <dt class="info-block__detail-title">{{ $t('accountInfo.currentDataUsage') }}</dt>
      <dd class="info-block__detail-content">{{ license.currentDataStorageSize }} GB</dd>
      <dt class="info-block__detail-title">{{ $t('accountInfo.dataUsageProvided') }}</dt>
      <dd class="info-block__detail-content">{{ displayedMaxDataStorageSize }}</dd>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DataStorageUsageInfo',
  computed: {
    ...mapState('userManagement', ['license']),
    isMaxStorageSizeUnlimited () {
      return this.license.maxDataStorageSize === -1
    },
    dataStorageUsageRate () {
      return `${Number(this.license.currentDataStorageSize / this.license.maxDataStorageSize * 100).toFixed(2)} %`
    },
    displayedDataStorageUsageRate () {
      return `${this.$t('accountInfo.dataStorageUsageRate')} : ${this.isMaxStorageSizeUnlimited ? this.$t('accountInfo.unlimited') : this.dataStorageUsageRate}`
    },
    displayedMaxDataStorageSize () {
      return this.isMaxStorageSizeUnlimited ? this.$t('accountInfo.unlimited') : `${this.license.maxDataStorageSize} GB`
    }
  }
}
</script>

<style lang="scss" scoped>
.info-block {
  position: relative;
  font-size: 14px;
  font-weight: normal;
  &__label {
    color: #DDD;
    cursor: pointer;
    &:hover {
      & ~ .info-block__detail {
        visibility: visible;
      }
    }
  }
  &__detail {
    position: absolute;
    top: 100%;
    right: 0;
    background: #233131;
    border-radius: 8px;
    padding: 12px;
    width: 212px;
    line-height: 1.5;
    visibility: hidden;
    &-title {
      font-weight: bold;
    }
    &-content {
      margin-left: 0;
      &:not(:last-child) {
        margin-bottom: 6px;
      }
    }
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: -8px;
      right: 32px;
      border-color: transparent transparent #233131 transparent;
      border-style: solid;
      border-width: 0px 10px 10px 10px;
      height: 0px;
      width: 0px;
    }
  }
}
</style>