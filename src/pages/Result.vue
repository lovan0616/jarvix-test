<template>
  <div class="page-result">
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
          <img src="@/assets/images/synergieslogo.svg">
        </div>
        <el-autocomplete class="search-input"
          ref="autocomplete"
          v-model="app_question"
          :fetch-suggestions="app_querySearch"
          :placeholder="app_question_placeholder"
          @keypress.enter.native="app_onEnterQuestion"
          @select="app_onEnterQuestion"
        ></el-autocomplete>
      </div>
      <div class="result-area">
        <layout v-bind="layout"></layout>
      </div>
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
<style lang="scss" scoped>

.header-root {
  height: 100%;
  display: flex;
  align-items: center;

  & > *:not(.search-input) {
    margin-right: 24px;
  }

  .header-logo {
    height: 32px;
    cursor: pointer;
    img {
      height: 100%;
    }
  }

  .search-input {
    width: 100%;
  }
}

.result-area {
  margin: 20px 0 10px 0;
}
</style>
