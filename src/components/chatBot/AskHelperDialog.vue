<template>
  <div class="ask-helper-dialog">
    <div class="title-block">
      <div class="dialog-title">{{ $t('askHelper.title') }}</div>
      <a href="javascript:void(0)" class="close-btn">
        <svg-icon icon-class="close"></svg-icon>
      </a>
    </div>
    
    
  </div>
</template>
<script>
export default {
  name: 'AskHelperDialog'
}
</script>
<style lang="scss" scoped>
.ask-helper-dialog {
  position: absolute;
  bottom: 110px;
  left: 0;
  width: 100%;
  height: calc(100vh - 110px);
  background-color: rgba(35, 61, 64, 0.97);
  padding: 24px 32px;

  .title-block {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .dialog-title {
      font-size: 20px;
      line-height: 36px;
    }

    .close-btn {
      color: #fff;
    }
  }
}
</style>
