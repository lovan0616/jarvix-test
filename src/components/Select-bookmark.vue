<template>
  <el-select
    v-model="selectedBookmarkId"
    placeholder="请选择bookmark"
    @change="onBookmarkChange"
  >
    <el-option
      v-for="item in bookmarks"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'
import co from 'co'

export default {
  name: 'SelectBookmark',
  created () {
    // this.$store.dispatch('bookmark/setBookmarkById', 1)
    this.$store.dispatch('bookmark/init').then(() => {
      if (this.bookmark) this.selectedBookmarkId = this.bookmark.id
    })
  },
  data () {
    return {
      selectedBookmarkId: undefined
    }
  },
  computed: {
    ...mapGetters('bookmark', [
      'bookmark', 'bookmarks', 'suggestions'
    ])
  },
  methods: {
    onBookmarkChange (bookmarkId) {
      let self = this
      co(function* () {
        yield self.$store.dispatch('bookmark/setBookmarkById', bookmarkId)
        yield self.$store.dispatch('bookmark/getSuggestions')
        self.$emit('change')
      })
    }
  }
}
</script>
