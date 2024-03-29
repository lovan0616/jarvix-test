<template>
  <writing-dialog
    :title="$t('editing.languageSetting')"
    :button="$t('button.change')"
    :is-loading="isLoading"
    :show-both="true"
    @closeDialog="$emit('closeDialog')"
    @confirmBtn="changeLang"
  >
    <sy-select
      :placeholder="$t('nav.languagePlaceholder')"
      :selected="locale"
      :items="langOptions"
      class="dialog-select"
      @update:selected="langOnSelected"
    />
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import SySelect from '@/components/select/SySelect'
import { updateLocale } from '@/API/User'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ChangeLanguageDialog',
  components: {
    WritingDialog,
    SySelect
  },
  data () {
    return {
      isLoading: false,
      selectedLanguage: null
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission']),
    ...mapState('setting', ['locale', 'languages']),
    ...mapState('userManagement', ['userId']),
    beforeLoginPage () {
      return this.$route.name === 'PageLogin' || this.$route.name === 'PageForgetPassword' || this.$route.name === 'PageResetPassword' || this.$route.name === 'PageAdmin'
    },
    selectItems () {
      return Object.keys(this.languages).map(key => ({
        id: key,
        name: this.languages[key]
      }))
    },
    langOptions () {
      return this.hasPermission('english_ui') || this.beforeLoginPage
        ? this.selectItems
        : this.selectItems.filter(item => item.name !== 'English')
    }
  },
  mounted () {
    this.selectedLanguage = this.locale
  },
  methods: {
    async changeLang () {
      if (this.selectedLanguage === this.locale) {
        this.$emit('closeDialog')
        return
      }
      // 在登入、註冊頁面修改語言 或是在 pinboard 分享頁面
      if (!this.userId || this.$route.name === 'ShareResult') {
        this.$store.commit('setting/setLocale', this.selectedLanguage)
        this.$store.commit('setting/isChangeLangBeforeLogin', true)
        this.$emit('closeDialog')
        return
      }
      this.isLoading = true
      try {
        await updateLocale(this.selectedLanguage)
        this.$store.commit('setting/setLocale', this.selectedLanguage)
        this.$store.dispatch('userManagement/getUserGroupList')
      } finally {
        this.isLoading = false
        this.$emit('submit')
      }
    },
    langOnSelected (item) {
      this.selectedLanguage = item
    }
  }
}
</script>
