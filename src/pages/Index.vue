<template>
  <div class="page-index">
    <h1 class="page-title">{{ title }}</h1>
    <div class="page-sub-title">请选择资料集开始询问</div>
    <question-select class="index-question-select-block"
    ></question-select>
    <div class="quick-start-block"
      v-show="bookmarkId"
    >
      <h2 class="sub-title">Quick Start</h2>
      <quick-starts
        :items="quickstartWithDefaults"
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
import QuestionSelect from '@/components/QuestionSelect'
import QuickStarts from '../components/QuickStarts'
import { mapGetters } from 'vuex'
import PopupGuiding from '../components/PopupGuiding'

export default {
  name: 'PageIndex',
  components: {
    PopupGuiding,
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

  .page-sub-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    color: #1F2D3D;
    margin-bottom: 70px;
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
  }
}
</style>
