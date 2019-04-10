<template>
  <div class="question-search-block">
    <div class="bookmark-select-block">
      <svg-icon icon-class="folder" class="bookmark-select-icon"></svg-icon>
      <sy-select class="bookmark-select"
        :selected="bookmarkId"
        :items="bookmarks"
        placeholder="请选择bookmark"
        @update:selected="onBookmarkChange"
      ></sy-select>
    </div>
    <el-autocomplete class="question-input"
      ref="autocomplete"
      v-model="appQuestion"
      :fetch-suggestions="appQuerySearch"
      :placeholder="appQuestionPlaceholder"
      @keypress.enter.native="enterQuestion"
      @select="enterQuestion"
    ></el-autocomplete>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SySelect from '@/components/sy/SySelect'

export default {
  name: 'QuestionSelect',
  components: {
    SySelect
  },
  data () {
    return {
      appQuestionPlaceholder: '请输入想问的问题'
    }
  },
  methods: {
    onBookmarkChange (bookmarkId) {
      this.$store.dispatch('bookmark/changeBookmarkById', bookmarkId)
    },
    enterQuestion (e) {
      this.$refs.autocomplete.close()
      this.$refs.autocomplete.$refs.input.$refs.input.blur()
      this.$store.dispatch('bookmark/updateResultRouter')
    },
    appQuerySearch (queryString, cb) {
      cb(this.suggestions.map(value => ({ value })))
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks', 'suggestions']),
    appQuestion: {
      get () {
        return this.$store.getters['bookmark/appQuestion']
      },
      set (value) {
        this.$store.commit('bookmark/setAppQuestion', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.question-search-block {
  display: flex;

  .bookmark-select-block {
    width: 25%;
    position: relative;

    .bookmark-select-icon {
      position: absolute;
      top: 12px;
      left: 4px;
    }

    .bookmark-select {
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
.question-input {
  flex: 1;
  padding: 0;
  font-size: $theme-font-size-x-large;
  color: #006464;

  .el-input, .el-input__inner {
    height: rem(40px);
  }

  .el-input__inner {
    border: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 0;
    background-color: transparent;
    font-size: 20px;
    letter-spacing: 2px;

    &::placeholder {
      color: $theme-placeholder-color;
    }
  }

  .el-input--prefix {
    .el-input__inner {
      padding-left: rem(40px);
    }
  }
}
</style>
