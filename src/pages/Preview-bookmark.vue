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
        selector
        <br>
        table
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
    }
  },
  computed: {
    ...mapGetters('bookmark', {
      app_bookmark: 'bookmark',
      app_quickstartWithoutDefaults: 'quickstartWithoutDefaults'
    })
  }
}
</script>
