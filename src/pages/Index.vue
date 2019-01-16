<template>
  <div class="page-index">
    <div class="bg"></div>
    <main class="container center">
      <img class="logo" src="@/assets/images/synergies_logo.svg" alt="Synergies" />
      <h1 class="title">{{ title }}</h1>
      <select-bookmark></select-bookmark>
      <el-autocomplete v-show="app_bookmark" class="question-input"
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
