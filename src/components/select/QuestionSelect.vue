<template>
  <el-autocomplete class="question-select"
    ref="autocomplete"
    v-model="appQuestion"
    :fetch-suggestions="appQuerySearch"
    :placeholder="appQuestionPlaceholder"
    @keypress.enter.native="enterQuestion"
    @select="enterQuestion"
  >
    <svg-icon
      v-if="icon"
      slot="prefix"
      :icon-class="icon"
      class="search-icon"
    ></svg-icon>
  </el-autocomplete>
</template>
<script>
import { mapGetters } from 'vuex'
import SySelect from '@/components/select/SySelect'

export default {
  name: 'QuestionSelect',
  props: {
    icon: {
      type: String,
      default: null
    }
  },
  components: {
    SySelect
  },
  data () {
    return {
      appQuestionPlaceholder: '请输入问题，例如：价格和成本的相关性'
    }
  },
  methods: {
    enterQuestion (e) {
      this.$refs.autocomplete.close()
      this.$refs.autocomplete.$refs.input.$refs.input.blur()
      this.$store.dispatch('bookmark/updateResultRouter')
    },
    appQuerySearch (queryString, cb) {
      cb(this.suggestions.map(value => ({ value })))
    }
  },
  computed: {
    ...mapGetters('bookmark', ['suggestions']),
    appQuestion: {
      get () {
        return this.$store.getters['bookmark/appQuestion']
      },
      set (value) {
        this.$store.commit('bookmark/setAppQuestion', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.question-select {
  .search-icon {
    font-size: 20px;
    line-height: 40px;
  }
}
</style>
