<template>
  <div class="page-index">
    <h1 class="page-title">{{ title }}</h1>
    <div class="page-sub-title">請選擇資料集開始詢問</div>
    <div class="search-block">
      <sy-select class="bookmark-select"
        :selected="bookmarkId"
        :items="bookmarks"
        placeholder="请选择bookmark"
        @update:selected="onBookmarkChange"
      ></sy-select>
      <el-autocomplete class="question-input"
        ref="autocomplete"
        v-model="app_question"
        :fetch-suggestions="app_querySearch"
        :placeholder="app_question_placeholder"
        @keypress.enter.native="app_onEnterQuestion"
        @select="app_onEnterQuestion"
      ></el-autocomplete>
    </div>
    <div class="quick-start-block"
      v-show="bookmarkId"
    >
      <h2 class="sub-title">Quick Start</h2>
      <quick-starts
        :items="quickstartWithDefaults"
        @clickItem="app_setAndEnterQuestion"
      >
      </quick-starts>
    </div>
    <popup-guiding :popup="popup" @update:popup="toggle"></popup-guiding>
    <div @click="toggle"
      class="teaching-button">
      <span>觀看教學</span>
    </div>
  </div>
</template>

<script>
import appHandleQuestion from '../mixins/app-handle-question.js'
import SySelect from '../components/sy/Sy-select'
import QuestionSelect from '@/components/QuestionSelect'
import QuickStarts from '../components/Quick-starts'
import { mapGetters } from 'vuex'
import PopupGuiding from '../components/Popup-guiding'

export default {
  name: 'PageIndex',
  mixins: [
    appHandleQuestion
  ],
  components: {
    PopupGuiding,
    SySelect,
    QuickStarts,
    QuestionSelect
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
<style lang="scss" scoped>
.page-index {
  text-align: center;

  .page-title {
    margin: 121px 0 130px;
  }

  .page-sub-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    color: #1F2D3D;
    margin-bottom: 70px;
  }

  .teaching-button {
    position: fixed;
    z-index: 1;
    bottom: 30px;
    right: 30px;
    cursor: pointer;
  }
  .sub-title {
    margin-top: rem(44px);
  }
}
</style>
