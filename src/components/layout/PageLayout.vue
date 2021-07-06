<template>
  <div class="app-layout page-layout">
    <div class="wrapper">
      <img
        v-if="logoType === 'SyGPS'"
        src="@/assets/images/logo_white.svg" 
        alt="logo" 
        class="page-logo-img">
      <img
        v-else-if="logoType === 'ASE'"
        src="@/assets/images/ase-logo.png" 
        alt="logo"
        class="page-logo-img">
      <img
        v-else
        src="@/assets/images/logo-text.svg" 
        alt="logo" 
        class="page-logo-img">
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
        @submit="isShowLanguage = false"
      />
    </div>
  </div>
</template>
<script>
import AppHeader from './AppHeader'
import ChangeLanguageDialog from '@/components/dialog/ChangeLanguageDialog';

export default {
  name: 'PageLayout',
  components: {
    AppHeader,
    ChangeLanguageDialog
  },
  data () {
    return {
      isShowLanguage: false
    }
  },
  computed: {
    logoType () {
      return localStorage.getItem('currentLogo')
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
.page-layout {
  .page-logo-img {
    width: 200px;
    margin: 60px 0 55px;
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
