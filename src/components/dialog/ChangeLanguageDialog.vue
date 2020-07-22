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
      :items="selectItems"
      class="dialog-select"
      @update:selected="langOnSelected"
    />
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import SySelect from '@/components/select/SySelect';
import { updateLocale } from '@/API/User'
import { mapState } from 'vuex'

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
    ...mapState('setting', ['locale', 'languages']),
    ...mapState('userManagement', ['userId']),
    selectItems () {
      return Object.keys(this.languages).map(key => ({
        id: key,
        name: this.languages[key]
      }))
    },
  },
  mounted () {
    this.selectedLanguage = this.locale
  },
  methods: {
    changeLang () {
      if (this.selectedLanguage === this.locale) {
        this.$emit('closeDialog')
        return
      }
      // 在登入、註冊頁面修改語言
      if (!this.userId) {
        this.$store.commit('setting/setLocale', this.selectedLanguage)
        this.$store.commit('setting/isChangeLangBeforeLogin', true)
        this.$emit('closeDialog')
        return
      }
      this.isLoading = true
      updateLocale(this.selectedLanguage)
        .then(() => {
          this.$store.commit('setting/setLocale', this.selectedLanguage)
          this.$store.commit('chatBot/clearConversation')
          this.$store.dispatch('chatBot/updateChatConversation')
        })
        .catch(() => {})
        .finally(() => {
          this.$emit('closeDialog')
          this.isLoading = false
        })
    },
    langOnSelected (item) {
      this.selectedLanguage = item
    },
  }
}
</script>