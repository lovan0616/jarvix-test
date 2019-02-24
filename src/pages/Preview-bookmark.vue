<template>
  <div class="page-preview-bookmark">
    <span v-show="bookmark">
      <quick-starts
        :items="quickstartWithoutDefaults"
        @clickItem="app_setAndEnterQuestion"
      >
      </quick-starts>
      <h2>资料集介绍</h2>
      <container-card>
        <sy-select
          :selected="bookmarkTableId"
          :items="bookmarkTables"
          placeholder="请选择bookmark"
          @update:selected="onBookmarkTableChange"
        ></sy-select>
        <br>
        <sy-table :data="bookmarkTableData && bookmarkTableData.dataset"></sy-table>
      </container-card>
    </span>
    <span v-show="!bookmark">bookmark no set yet</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import appHandleQuestion from '../mixins/app-handle-question.js'
import QuickStarts from '../components/Quick-starts'
import SySelect from '../components/sy/Sy-select'

export default {
  name: 'PagePreviewBookmark',
  mixins: [
    appHandleQuestion
  ],
  components: {
    SySelect,
    QuickStarts
  },
  created () {
    this.$store.dispatch('previewBookmark/init')
      .catch(err => err)
  },
  computed: {
    ...mapGetters('bookmark', ['bookmark', 'quickstartWithoutDefaults']),
    ...mapGetters('previewBookmark', ['bookmarkTableId', 'bookmarkTables', 'bookmarkTableData'])
  },
  methods: {
    onBookmarkTableChange (id) {
      this.$store.dispatch('previewBookmark/changeBookmarkTableById', id)
        .catch(err => err)
    }
  }
}
</script>
