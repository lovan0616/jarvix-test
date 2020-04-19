<template>
  <el-tooltip popper-class="role-desc-tooltip">
    <svg-icon icon-class="information-circle" class="tooltip-thumbnail"></svg-icon>
    <div slot="content" class="tooltip-content">
      <p class="content-title">[{{ $t('userManagement.accountRoleDesc') }}]</p>
      <div class="content-item">
        <p class="item-label">{{ $t('userManagement.accountOwner') }}</p>
        <p class="item-description">{{ $t('userManagement.accountOwnerDesc') }}</p>
      </div>
      <div class="content-item">
        <p class="item-label">{{ $t('userManagement.accountMaintainer') }}</p>
        <p class="item-description">{{ $t('userManagement.accountMaintainerDesc') }}</p>
      </div>
      <div class="content-item">
        <p class="item-label">{{ $t('userManagement.accountViewer') }}</p>
        <p class="item-description">{{ $t('userManagement.accountViewerDesc') }}</p>
      </div>
    </div>
  </el-tooltip>
</template>

<style lang="scss">
.role-desc-tooltip {
  padding: 0;
  width: 212px;
  background-color: #233131;
  box-shadow: 0px 4px 12px rgba(73, 128, 132, 0.48), 0px -4px 12px rgba(73, 128, 132, 0.48);
  border-radius: 8px;
  padding: 10px 12px;
  .tooltip-content {
    .content-title {
      font-size: 12px;
      margin: 0 0 10px 0;
      color: $theme-color-primary;
    }
    .content-item {
      line-height: 14px;
      &+.content-item {
        margin-top: 10px;
      }
      .item-label, .item-description {
        font-size: 12px;
        margin: 0;
        line-height: 16px;
      }
      .item-label {
        font-weight: 600;
      }
    }
  }
}
</style>
