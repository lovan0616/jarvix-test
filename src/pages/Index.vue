<template>
  <div class="page-index">
    <img src="../assets/images/sygps_logo.png" alt="sygps-logo" class="index-logo">
    <div class="bookmark-select-region">
      我想在<bookmark-select class="index-bookmark-select"></bookmark-select>询问问题
    </div>
    <question-select class="index-question-select-block"
      icon="search"
    >
    </question-select>
    <div class="quick-start-block"
      v-show="bookmarkId"
    >
      <h2 class="sub-title">Quick Start</h2>
      <quick-starts
        :items="quickstartWithDefaults"
        hasDefault
      >
      </quick-starts>
    </div>
    <popup-guiding
      v-if="isDisplayGuide"
      @update="toggle"
    ></popup-guiding>
    <a class="teaching-button" href="javascript:void(0)"
      @click="toggle"
    >
      观看教学
    </a>
  </div>
</template>

<script>
import BookmarkSelect from '@/components/select/BookmarkSelect'
import QuestionSelect from '@/components/select/QuestionSelect'
import QuickStarts from '@/components/QuickStarts'
import PopupGuiding from '@/components/dialog/PopupGuiding'
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  components: {
    PopupGuiding,
    QuickStarts,
    QuestionSelect,
    BookmarkSelect
  },
  data () {
    return {
      isDisplayGuide: false
    }
  },
  created () {
    this.$store.dispatch('bookmark/init')
    // 因為 result page 會 keep-alive，所以才會在這邊做清除資料的動作
    this.$store.commit('bookmark/setAppQuestion', '')
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'quickstartWithDefaults'])
  },
  methods: {
    toggle () {
      this.isDisplayGuide = !this.isDisplayGuide
    }
  }
}
</script>
<style lang="scss" scoped>
.page-index {
  width: 800px;
  margin: 0 auto;
  text-align: center;

  .index-logo {
    width: 220px;
    height: auto;
    margin: 138px 0 64px;
  }

  .page-title {
    margin: 121px 0 130px;
  }

  .bookmark-select-region {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 64px;
  }

  .index-bookmark-select {
    margin: 0 16px;
  }

  .index-question-select-block {
    margin-bottom: 40px;
  }

  .teaching-button {
    position: fixed;
    z-index: 1;
    bottom: 30px;
    right: 30px;
    color: $theme-text-color;
  }
  .sub-title {
    margin-top: 0;
    line-height: 40px;
    font-weight: 600;
  }
}
</style>
