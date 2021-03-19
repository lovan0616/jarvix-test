<template>
  <div class="app-layout admin-layout">
    <header class="admin-header">
      <img
        src="@/assets/images/logo-text.svg" 
        alt="logo" 
        class="page-logo-img">
      <a 
        href="/login" 
        class="link">
        <svg-icon 
          icon-class="arrow-left" 
          class="icon" />{{ $t('link.backToLogin') }}
      </a>
    </header>
    <div class="wrapper">
      
      <main class="main">
        <div class="bg"/>
        <slot/>
      </main>
      <div 
        class="language-setting" 
        @click="showChangeLanguageDialog">
        <svg-icon icon-class="language" />
        <span>{{ $t('editing.languageSetting') }}</span>
      </div>
      <change-language-dialog
        v-show="isShowLanguage"
        @closeDialog="isShowLanguage = false"
      />
    </div>
  </div>
</template>
<script>
import ChangeLanguageDialog from '@/components/dialog/ChangeLanguageDialog';

export default {
  name: 'AdminLayout',
  components: {
    ChangeLanguageDialog
  },
  data () {
    return {
      isShowLanguage: false
    }
  },
  methods: {
    showChangeLanguageDialog () {
      this.isShowLanguage = true
    }
  }
}
</script>
<style lang="scss" scoped>
.admin-layout {
  .admin-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    height: $header-height;
    z-index: $header-z-index;
    box-shadow: $header-shadow;
    background-color: #171717;
    border-bottom: 1px solid #04262B;
    display: flex;
    align-items: center;
    padding: 8px;

    .icon {
      margin-right: 4px;
    }
  }
  .page-logo-img {
    height: 32px;
    margin-right: 16px;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .main {
    text-align: center;
    flex: 1;
  }
  .language-setting {
    align-self: flex-start;
    padding: 30px 20px;
    cursor: pointer;
  }
}
</style>
