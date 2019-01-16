<template>
  <div class="page-index">
    <div class="bg"></div>
    <main class="container center">
      <img class="logo" src="@/assets/images/synergies_logo.svg" alt="Synergies" />
      <h1 class="title">{{ title }}</h1>
      <div class="select-bookmark-area">
        <span>我想在</span>
        <select-bookmark></select-bookmark>
        <span>询问问题</span>
      </div>
      <el-autocomplete class="question-input"
        v-show="app_bookmark"
        ref="autocomplete"
        v-model="app_question"
        :fetch-suggestions="app_querySearch"
        :placeholder="app_question_placeholder"
        @keypress.enter.native="app_onEnterQuestion"
        @select="app_onEnterQuestion"
        prefix-icon="el-icon-search"
      ></el-autocomplete>
    </main>
  </div>
</template>

<script>
import appHandleQuestion from '../mixins/app-handle-question.js'
import SelectBookmark from '../components/Select-bookmark'
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  mixins: [
    appHandleQuestion
  ],
  components: {
    SelectBookmark
  },
  data () {
    return {
      title: 'SyGPS'
    }
  },
  computed: {
    ...mapGetters('bookmark', {
      app_bookmark: 'bookmark'
    })
  }
}
</script>
