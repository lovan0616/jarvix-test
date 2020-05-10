<template>
  <div slot="content" class="tooltip-content">
    <p class="content-title">[{{ $t('userManagement.accountRoleDesc') }}]</p>
    <div class="content-item">
      <p class="item-label">{{ $t('userManagement.accountOwner') + ':' }}</p>
      <p class="item-description">{{ $t('userManagement.accountOwnerDesc') }}</p>
    </div>
    <div class="content-item">
      <p class="item-label">{{ $t('userManagement.accountMaintainer') + ':' }}</p>
      <p class="item-description">{{ $t('userManagement.accountMaintainerDesc') }}</p>
    </div>
    <div class="content-item">
      <p class="item-label">{{ $t('userManagement.accountViewer') + ':' }}</p>
      <p class="item-description">{{ $t('userManagement.accountViewerDesc') }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tooltip-content {
  .content-title {
    font-size: 12px;
    margin: 0 0 15px 0;
    color: $theme-color-primary;
    font-weight: 600;
  }
  .content-item {
    line-height: 14px;
    &:not(:last-of-type) {
      margin-bottom: 15px;
    }

    .item-label,
    .item-description {
      font-size: 12px;
      margin: 0;
      line-height: 16px;
    }
    .item-label {
      font-weight: 600;
      color: #ffffff;
    }
    .item-description {
      color: #DDDDDD;
    }
  }
}
</style>
