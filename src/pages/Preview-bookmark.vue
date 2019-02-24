<template>
  <div class="page-preview-bookmark">
    <span v-show="app_bookmark">
      <quick-starts
        :items="app_quickstartWithoutDefaults"
        @clickItem="app_setAndEnterQuestion"
      >
      </quick-starts>
      <h2>资料集介绍</h2>
      <container-card>
        <el-select
          v-model="selectedBookmarkTableId"
          placeholder="请选择table"
          @change="onBookmarkTableChange"
        >
          <el-option
            v-for="item in bookmarkTables"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <br>
        <sy-table :data="bookmarkTableData && bookmarkTableData.dataset"></sy-table>
      </container-card>
    </span>
    <span v-show="!app_bookmark">bookmark no set yet</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import appHandleQuestion from '../mixins/app-handle-question.js'
import QuickStarts from '../components/Quick-starts'

export default {
  name: 'PagePreviewBookmark',
  mixins: [
    appHandleQuestion
  ],
  components: {
    QuickStarts
  },
  data () {
    return {
      selectedBookmarkTableId: undefined
    }
  },
  created () {
    this.$store.dispatch('previewBookmark/init').then(({ bookmarkTable, bookmarkTables }) => {
      if (bookmarkTable && bookmarkTables.length) this.selectedBookmarkTableId = bookmarkTable.id
    }).catch(err => err)
  },
  computed: {
    ...mapGetters('bookmark', {
      app_bookmark: 'bookmark',
      app_quickstartWithoutDefaults: 'quickstartWithoutDefaults'
    }),
    ...mapGetters('previewBookmark', ['bookmarkTables', 'bookmarkTableData'])
  },
  methods: {
    onBookmarkTableChange (id) {
      this.$store.dispatch('previewBookmark/changeBookmarkTableById', id)
        .catch(err => err)
    }
  }
}
</script>
