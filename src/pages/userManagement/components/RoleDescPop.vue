<template>
  <div 
    slot="content" 
    class="tooltip-content">
    <p class="content-title">[{{ $t(`userManagement.accountRoleDesc`) }}]</p>
    <div class="content-item">
      <p class="item-label">{{ $t(`userManagement.${manageType}Owner`) + ':' }}</p>
      <p class="item-description">{{ $t(`userManagement.${manageType}OwnerDesc`) }}</p>
    </div>
    <div
      v-if="manageType !== 'group'"
      class="content-item"
    >
      <p class="item-label">{{ $t(`userManagement.${manageType}Maintainer`) + ':' }}</p>
      <p class="item-description">{{ $t(`userManagement.${manageType}MaintainerDesc`) }}</p>
    </div>
    <div class="content-item">
      <p class="item-label">{{ $t(`userManagement.${manageType}Viewer`) + ':' }}</p>
      <p class="item-description">{{ $t(`userManagement.${manageType}ViewerDesc`) }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RoleDescPop',
  props: {
    manageType: {
      type: String,
      default: 'account'
    }
  }
}
</script>

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
