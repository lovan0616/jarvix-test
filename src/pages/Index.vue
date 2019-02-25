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
      <page-guiding :popup="popup"></page-guiding>
      <div @click="toggle"
       class="teaching-button">
        <span>觀看教學</span>
      </div>
      <h2 class="sub-title">Quick Start</h2>
      <quick-starts
        :items="app_quickstartWithDefaults"
        @clickItem="app_setAndEnterQuestion"
      >
      </quick-starts>
    </main>
  </div>
</template>

<script>
import appHandleQuestion from '../mixins/app-handle-question.js'
import SelectBookmark from '../components/Select-bookmark'
import PageGuiding from '../components/Page-guiding'
import QuickStarts from '../components/Quick-starts'
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  mixins: [
    appHandleQuestion
  ],
  components: {
    SelectBookmark,
    PageGuiding,
    QuickStarts
  },
  data () {
    return {
      title: 'SyGPS',
      popup: false
    }
  },
  computed: {
    ...mapGetters('bookmark', {
      app_bookmark: 'bookmark',
      app_quickstartWithDefaults: 'quickstartWithDefaults'
    })
  },
  methods: {
    toggle: function () {
      this.popup = !this.popup
    }
  }
}
</script>
