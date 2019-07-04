<template>
  <div class="page-index">
    <img src="../assets/images/sygps_logo.png" alt="sygps-logo" class="index-logo">
    <div class="question-select-block">
      <bookmark-select></bookmark-select>
      <question-select></question-select>
    </div>
    <div class="quick-start-block"
      v-show="bookmarkId"
    >
      <h2 class="sub-title">推荐语句</h2>
      <div class="quick-start-question-block">
        <preview-result-board class="result-board"
          v-for="(questionInfo, index) in quickstartWithDefaults"
          :key="bookmarkId + '-' + index"
          :question-info="questionInfo"
        ></preview-result-board>
      </div>
    </div>
    <popup-guiding
      v-if="isDisplayGuide"
      @update="toggle"
    ></popup-guiding>
    <a class="teaching-button" href="javascript:void(0)"
      @click="toggle"
    >
      ?
    </a>
  </div>
</template>

<script>
import BookmarkSelect from '@/components/select/BookmarkSelect'
import QuestionSelect from '@/components/select/QuestionSelect'
import PreviewResultBoard from '@/components/PreviewResultBoard'
import PopupGuiding from '@/components/dialog/PopupGuiding'
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  components: {
    PopupGuiding,
    QuestionSelect,
    BookmarkSelect,
    PreviewResultBoard
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
  margin: 0 auto;
  text-align: center;

  .index-logo {
    width: 220px;
    height: auto;
    margin: 66px 0 64px;
  }

  .page-title {
    margin: 121px 0 130px;
  }

  .question-select-block {
    display: flex;
    align-items: center;
    margin-bottom: 140px;
  }

  .teaching-button {
    position: fixed;
    z-index: 20;
    bottom: 30px;
    right: 30px;
    color: #0F9696;
    background: #FFFFFF;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.12);
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 50%;
    font-size: 36px;
  }
  .sub-title {
    margin-top: 0;
    line-height: 40px;
    font-weight: 600;
    text-align: left;
  }
  .quick-start-question-block {
    display: flex;
    justify-content: space-between;

    .result-board {
      width: 31.34%;
    }
  }
}
</style>
