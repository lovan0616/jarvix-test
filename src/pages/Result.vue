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
      <layout v-bind="layout"></layout>
    </sy-holy-grail>
  </div>
</template>

<script>
import axios from 'axios'
import appHandleQuestion from '../mixins/app-handle-question.js'

export default {
  name: 'PageResult',
  mixins: [
    appHandleQuestion
  ],
  data () {
    return {
      layout: undefined
    }
  },
  watch: {
    '$route.query': function ({ question }) {
      this.fetchApiAsk({ question })
    }
  },
  created () {
    let question = this.$route.query.question
    if (question) {
      this.app_setQuestion(question)
      this.fetchApiAsk({ question })
    }
  },
  methods: {
    onLogoClick () {
      this.$router.push('/')
    },
    fetchApiAsk (data) {
      this.layout = undefined
      const path = window.env.API_ROOT_URL + 'api/ask'
      axios.post(path, data)
        .then(res => {
          this.layout = res.data.data
        })
    }
  }
}
</script>
