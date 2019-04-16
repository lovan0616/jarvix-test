<template>
  <div class="page-index">
    <h1 class="page-title">{{ title }}</h1>
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
      :popup="popup"
      @update:popup="toggle"
    ></popup-guiding>
    <div class="teaching-button"
      @click="toggle"
    >
      <span>观看教学</span>
    </div>
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
      title: 'SyGPS',
      popup: false
    }
  },
  created () {
    this.$store.dispatch('bookmark/init')
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'quickstartWithDefaults'])
  },
  methods: {
    toggle: function () {
      this.popup = !this.popup
    }
  }
}
</script>
<style lang="scss" scoped>
.page-index {
  width: 800px;
  margin: 0 auto;
  text-align: center;

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
    margin-bottom: 60px;
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
    font-weight: 600;
  }
}
</style>
