<template>
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
</template>
<script>
import { mapGetters } from 'vuex'
import SySelect from '@/components/sy/Sy-select'

export default {
  name: 'QuestionSelect',
  components: {
    SySelect
  },
  data () {
    return {
      app_question: '',
      app_question_placeholder: '请输入想问的问题'
    }
  },
  methods: {
    onBookmarkChange (bookmarkId) {
      this.$store.dispatch('bookmark/changeBookmarkById', bookmarkId)
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks'])
  }
}
</script>
<style lang="scss" scoped>
@import '../../src/styles/common/variables.scss';
@import '../../src/styles/common/composes/texts.scss';

.search-block {
  display: flex;
  .bookmark-select {
    width: 20.625%;
  }
}
.question-input {
  width: 100%;
  padding: 0;
  font-size: $theme-font-size-x-large;
  color: #48666A;

  .el-input, .el-input__inner {
    height: rem(40px);
  }

  .el-input__inner {
    border: 0;
    border-bottom: 1px solid $theme-color-black;
    border-radius: 0;
    background-color: transparent;
    @extend %h3;

    &::placeholder {
      color: #D8D8D8;
    }
  }

  .el-input__icon {
    color: #7D7E7E;
    font-size: $theme-font-size-large;
  }

  .el-input--prefix {
    .el-input__inner {
      padding-left: rem(40px);
    }
  }
}
</style>
