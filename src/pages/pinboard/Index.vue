<template>
  <div class="page-pinboard">
    <h1 class="page-title">个人钉板</h1>
    <div class="pinboard-list">
      <div class="single-pinboard-preview default">
        <div class="action-block add"
          v-if="!isEdit"
          @click="editBoard"
        >+</div>
        <div class="action-block edit"
          v-else
        >
          <input type="text" class="input board-name-input"
            v-model="newBoardName"
          >
          <div class="button-block">
            <button class="btn btn-outline"
              @click="cancelCreate"
            >取消</button>
            <button class="btn btn-default"
              @click="createBoard"
              :disabled="!newBoardName"
            >确认</button>
          </div>
        </div>
      </div>
      <pinboard-preview
        v-if="pinboardList.length > 0"
        v-for="boardInfo in pinboardList"
        :key="boardInfo.id"
        :board-info="boardInfo"
      ></pinboard-preview>
    </div>
  </div>
</template>
<script>
import PinboardPreview from './components/PinboardPreview'
export default {
  name: 'PagePinboardList',
  components: {
    PinboardPreview
  },
  data () {
    return {
      isEdit: false,
      newBoardName: null
    }
  },
  mounted () {
    this.getPinboardInfo()
  },
  beforeDestroy () {
    this.$store.commit('pinboard/setPinboardList', [])
  },
  methods: {
    getPinboardInfo () {
      this.$store.dispatch('pinboard/getPinboardList')
    },
    editBoard () {
      this.isEdit = true
    },
    cancelCreate () {
      this.newBoardName = null
      this.isEdit = false
    },
    createBoard () {
      this.$store.dispatch('pinboard/createPinboard', this.newBoardName).then(response => {
        this.getPinboardInfo()
        this.cancelCreate()
      })
    }
  },
  computed: {
    pinboardList () {
      return this.$store.state.pinboard.pinboardList
    }
  }
}
</script>
<style lang="scss" scoped>
.page-pinboard {
  .page-title {
    margin-top: 0;
  }
  .pinboard-list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
