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
      <span v-show="app_bookmark">
        <el-autocomplete class="question-input"
          ref="autocomplete"
          v-model="app_question"
          :fetch-suggestions="app_querySearch"
          :placeholder="app_question_placeholder"
          @keypress.enter.native="app_onEnterQuestion"
          @select="app_onEnterQuestion"
          prefix-icon="el-icon-search"
        ></el-autocomplete>
        <h2 class="sub-title">Quick Start</h2>
        <quick-starts
          :items="app_quickstartWithDefaults"
          @clickItem="app_setAndEnterQuestion"
        >
        </quick-starts>
      </span>
    </main>
  </div>
</template>

<script>
import appHandleQuestion from '../mixins/app-handle-question.js'
import SelectBookmark from '../components/Select-bookmark'
import QuickStarts from '../components/Quick-starts'
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  mixins: [
    appHandleQuestion
  ],
  components: {
    SelectBookmark,
    QuickStarts
  },
  data () {
    return {
      title: 'SyGPS'
    }
  },
  computed: {
    ...mapGetters('bookmark', {
      app_bookmark: 'bookmark',
      app_quickstartWithDefaults: 'quickstartWithDefaults'
    })
  }
}
</script>
