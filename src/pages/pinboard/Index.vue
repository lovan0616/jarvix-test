<template>
  <div class="page-pinboard">
    <h1 class="page-title">{{ $t('editing.pinboard') }}</h1>

    <div class="page-category">{{ $t('editing.allCategory') }}</div>
    <div @click="showAdd" class="page-add-category">
      <svg-icon icon-class="add" class="icon"></svg-icon>
      {{ $t('button.addNewCategory') }}
      </div>
    <div class="pinboard-list">
      <single-pinboard
        v-if="pinboardList.length > 0"
        v-for="boardInfo in pinboardList"
        :key="boardInfo.id"
        :board-info="boardInfo"
        @showEdit="showEditDialog(boardInfo)"
        @showDelete="showDeleteDialog(boardInfo)"
        @showShare="showShareDialog(boardInfo)"
      >
      </single-pinboard>
    </div>

    <writing-dialog
      v-if="isShowAdd"
      :title="$t('button.addNewCategory')"
      :button="$t('button.change')"
      @closeDialog="closeAdd"
      @confirmBtn="addCategory"
      :showBoth="true"
    >
      <input v-model="newBoardName" type="text" class="input pinboard-name-input" :placeholder="$t('editing.inputCategoryName')">
    </writing-dialog>

    <writing-dialog
      v-if="isShowEdit"
      :title="$t('editing.editingName')"
      :button="$t('button.change')"
      @closeDialog="closeEdit"
      @confirmBtn="confirmEdit"
      :showBoth="true"
    >
      <input type="text" class="input pinboard-name-input" v-model="tempEditInfo.name">
    </writing-dialog>
    <decide-dialog
      v-if="isShowDelete"
      :title="`${confirmDeleteText} ${tempEditInfo.name}？`"
      :type="'delete'"
      @closeDialog="closeDelete"
      @confirmBtn="confirmDelete"
    >
    </decide-dialog>
    <writing-dialog
      v-if="isShowShare"
      :title="$t('button.shareLink')"
      :button="$t('button.copy')"
      @closeDialog="closeShare"
      @confirmBtn="confirmShare"
      :showBoth="false"
    >
      <input type="text" class="input pinboard-name-input" v-model="shareLink" ref="shareInput">
    </writing-dialog>
  </div>
</template>
<script>
import SinglePinboard from './components/SinglePinboard'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import { Message } from 'element-ui'

export default {
  name: 'PagePinboardList',
  components: {
    DecideDialog,
    WritingDialog,
    SinglePinboard
  },
  data () {
    return {
      isEdit: false,
      newBoardName: null,
      isShowAdd: false,
      isShowEdit: false,
      isShowDelete: false,
      isShowShare: false,
      editName: '',
      shareLink: '',
      tempEditInfo: {
        name: null,
        id: null
      },
      confirmDeleteText: this.$t('editing.confirmDelete')
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
    addCategory () {
      this.$store.dispatch('pinboard/createPinboard', this.newBoardName).then(response => {
        this.getPinboardInfo()
        this.isShowAdd = false
      })
    },
    insertBoardData (boardInfo) {
      this.tempEditInfo = JSON.parse(JSON.stringify(boardInfo))
    },
    showEditDialog (boardInfo) {
      this.insertBoardData(boardInfo)
      this.isShowEdit = true
    },
    showDeleteDialog (boardInfo) {
      this.insertBoardData(boardInfo)
      this.isShowDelete = true
    },
    showShareDialog (boardInfo) {
      this.insertBoardData(boardInfo)
      this.isShowShare = true
      this.shareLink = `${window.location.origin}/pinboard/${boardInfo.id}`
    },
    confirmEdit () {
      this.$store.dispatch('pinboard/updatePinboardName', this.tempEditInfo).then(() => {
        this.isShowEdit = false
      })
    },
    confirmDelete () {
      this.$store.dispatch('pinboard/deletePinboard', this.tempEditInfo.id).then(() => {
        this.isShowDelete = false
      })
    },
    confirmShare () {
      let input = this.$refs.shareInput
      input.select()
      /* For mobile devices */
      input.setSelectionRange(0, 99999)
      document.execCommand('copy')

      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000
      })
      this.$nextTick(() => {
        this.isShowShare = false
      })
    },
    showAdd () {
      this.isShowAdd = true
    },
    closeAdd () {
      this.isShowAdd = false
    },
    closeEdit () {
      this.isShowEdit = false
    },
    closeDelete () {
      this.isShowDelete = false
    },
    closeShare () {
      this.isShowShare = false
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
  .page-category {
    margin-bottom: 16px;
    color: #DDDDDD;
  }
  .page-add-category {
    width: 105px;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background: #1EB8C7;
    border-radius: 5px;
    margin-bottom: 16px;
    cursor: pointer;
  }
  .pinboard-list {
    display: flex;
    flex-wrap: wrap;
  }
}

</style>
