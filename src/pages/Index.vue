<template>
  <div class="page-index">
    <div class="bg"></div>
    <main class="container center">
      <img class="logo" src="@/assets/images/synergies_logo.svg" alt="Synergies" />
      <h1 class="title">{{ title }}</h1>
      <div class="select-bookmark-area">
        <span>我想在</span>
        <sy-select
          :selected="bookmarkId"
          :items="bookmarks"
          placeholder="请选择bookmark"
          @update:selected="onBookmarkChange"
        ></sy-select>
        <span>询问问题</span>
      </div>
      <span v-show="bookmarkId">
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
          :items="quickstartWithDefaults"
          @clickItem="app_setAndEnterQuestion"
        >
        </quick-starts>
      </span>
      <page-guiding :popup="popup"></page-guiding>
      <div @click="toggle"
       class="teaching-button">
        <span>觀看教學</span>
      </div>
    </main>
  </div>
</template>

<script>
import appHandleQuestion from '../mixins/app-handle-question.js'
import SySelect from '../components/sy/Sy-select'
import QuickStarts from '../components/Quick-starts'
import { mapGetters } from 'vuex'
import PageGuiding from '../components/Page-guiding'

export default {
  name: 'PageIndex',
  mixins: [
    appHandleQuestion
  ],
  components: {
    PageGuiding,
    SySelect,
    QuickStarts
  },
  data () {
    return {
      title: 'SyGPS',
      popup: false
    }
  },
  created () {
    this.$store.dispatch('bookmark/init')
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks', 'quickstartWithDefaults'])
  },
  methods: {
    toggle: function () {
      this.popup = !this.popup
    },
    onBookmarkChange (bookmarkId) {
      this.$store.dispatch('bookmark/changeBookmarkById', bookmarkId)
    }
  }
}
</script>
