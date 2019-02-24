<template>
  <div class="page-result">
    <div class="bg"></div>
    <sy-holy-grail
      :header="{ type: 'fixed' }"
      :footer="{ active: false }"
      :asideLeft="{ active: false }"
      :asideRight="{ active: false }"
    >
      <div slot="header" class="header-root">
        <div class="header-logo"
          @click="onLogoClick"
        >
          <img src="@/assets/images/synergies_logo_white.svg">
        </div>
        <sy-select class="header-right"
          theme="dark"
          :selected="app_bookmarkId"
          :items="app_bookmarks"
          placeholder="请选择bookmark"
          @update:selected="onBookmarkChange"
        ></sy-select>
      </div>
      <div class="top-area">
        <el-autocomplete class="question-input"
          ref="autocomplete"
          v-model="app_question"
          :fetch-suggestions="app_querySearch"
          :placeholder="app_question_placeholder"
          @keypress.enter.native="app_onEnterQuestion"
          @select="app_onEnterQuestion"
          prefix-icon="el-icon-search"
        ></el-autocomplete>
      </div>
      <layout v-if="showLayout" v-bind="layout"></layout>
    </sy-holy-grail>
  </div>
</template>

<script>
import axios from 'axios'
import appHandleQuestion from '../mixins/app-handle-question.js'
import SySelect from '../components/sy/Sy-select'
import { mapGetters } from 'vuex'

export default {
  name: 'PageResult',
  mixins: [
    appHandleQuestion
  ],
  components: {
    SySelect
  },
  data () {
    return {
      layout: undefined,
      showLayout: true
    }
  },
  watch: {
    '$route.query': function ({ question }) {
      this.fetchApiAsk({ question })
    }
  },
  created () {
    this.$store.dispatch('bookmark/init').then(state => {
      this.start()
    })
  },
  computed: {
    ...mapGetters('bookmark', {
      app_bookmarkId: 'bookmarkId',
      app_bookmarks: 'bookmarks'
    })
  },
  methods: {
    start () {
      let question = this.$route.query.question
      if (question) {
        this.app_setQuestion(question)
        this.fetchApiAsk({ question })
      }
    },
    clearLayout () {
      this.layout = undefined
    },
    onLogoClick () {
      this.$router.push('/')
    },
    fetchApiAsk (data) {
      this.showLayout = true
      this.clearLayout()
      const path = window.env.API_ROOT_URL + 'api/ask'
      axios.post(path, data)
        .then(res => {
          this.layout = res.data.data
        })
    },
    onBookmarkChange (bookmarkId) {
      this.$store.dispatch('bookmark/changeBookmarkById', bookmarkId).then(state => {
        this.clearLayout()
        this.app_setQuestion('')
        this.showLayout = false
      })
    }
  }
}
</script>
