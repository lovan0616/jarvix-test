<template>
  <div class="page-pinboard">
    <h1 class="page-title">{{ $t('editing.pinboard') }}</h1>
    <div class="page-category">{{ $t('editing.allCategory') }}</div>
    <button @click="showAdd" class="btn-m btn-default btn-has-icon add-btn">
      <svg-icon icon-class="plus" class="icon"></svg-icon>
      {{ $t('button.addNewCategory') }}
      </button>
    <spinner
      :title="$t('editing.loading')" v-if="isLoading"
    ></spinner>
    <div v-else>
      <div class="pinboard-list" v-if="pinboardList.length > 0">
        <single-pinboard
          v-for="boardInfo in pinboardList"
          :key="boardInfo.id"
          :board-info="boardInfo"
          @showEdit="showEditDialog(boardInfo)"
          @showDelete="showDeleteDialog(boardInfo)"
          @showShare="showShareDialog(boardInfo)"
        >
        </single-pinboard>
      </div>
      <empty-info-block
        v-else
        :msg="$t('editing.emptyPinboard')"
      ></empty-info-block>
    </div>
    <writing-dialog
      v-if="isShowAdd"
      :title="$t('button.addNewCategory')"
      :button="$t('button.create')"
      @closeDialog="closeAdd"
      @confirmBtn="addCategory"
      :showBoth="true"
    >
      <input-verify
        v-model="newBoardName"
        type="text"
        :placeholder="$t('editing.inputCategoryName')"
        name="newBoardName"
        v-validate="`required|max:${max}`"
      ></input-verify>
    </writing-dialog>

    <writing-dialog
      v-if="isShowEdit"
      :title="$t('editing.editingName')"
      :button="$t('button.change')"
      @closeDialog="closeEdit"
      @confirmBtn="confirmEdit"
      :showBoth="true"
    >
      <input-verify
        v-model="tempEditInfo.name"
        type="text"
        name="tempEditInfoName"
        v-validate="`required|max:${max}`"
      ></input-verify>
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
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import InputVerify from '@/components/InputVerify'
import { Message } from 'element-ui'

export default {
  name: 'PagePinboardList',
  inject: ['$validator'],
  components: {
    DecideDialog,
    WritingDialog,
    SinglePinboard,
    EmptyInfoBlock,
    InputVerify
  },
  data () {
    return {
      isLoading: true,
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
      this.$store.dispatch('pinboard/getPinboardList').then(() => {
        this.isLoading = false
      })
    },
    addCategory () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.$store.dispatch('pinboard/createPinboard', this.newBoardName)
          .then(response => {
            this.getPinboardInfo()
            this.isShowAdd = false
          })
          .catch(() => {})
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
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.$store.dispatch('pinboard/updatePinboardName', this.tempEditInfo)
          .then(() => {
            this.isShowEdit = false
          })
          .catch(() => {})
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
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    },
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
  .add-btn {
    margin-bottom: 16px;
  }
  .pinboard-list {
    display: flex;
    flex-wrap: wrap;
  }
}

</style>
