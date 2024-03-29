<template>
  <div class="page-pinboard">
    <h1 class="page-title">
      {{ isPersonalPinboard ? $t('editing.pinboard') : $t('editing.projectPinboard') }}
    </h1>
    <div class="page-category">
      {{ $t('editing.allCategory') }}
    </div>
    <button
      class="btn-m btn-default btn-has-icon add-btn"
      @click="showAdd"
    >
      <svg-icon
        icon-class="plus"
        class="icon"
      />
      {{ $t('button.addNewCategory') }}
    </button>
    <spinner
      v-if="isLoading"
      :title="$t('editing.loading')"
    />
    <div v-else>
      <div
        v-if="pinboardList.length > 0"
        class="pinboard-list"
      >
        <single-pinboard
          v-for="boardInfo in pinboardList"
          :key="boardInfo.id"
          :board-info="boardInfo"
          :is-personal-pinboard="isPersonalPinboard"
          @showEdit="showEditDialog(boardInfo)"
          @showDelete="showDeleteDialog(boardInfo)"
          @showShare="showShareDialog(boardInfo)"
        />
      </div>
      <empty-info-block
        v-else
        :msg="$t('editing.emptyPinboard')"
      />
    </div>
    <writing-dialog
      v-if="isShowAdd"
      :title="$t('button.addNewCategory')"
      :button="$t('button.create')"
      :show-both="true"
      @closeDialog="closeAdd"
      @confirmBtn="addCategory"
    >
      <input-verify
        v-validate="`required|max:${max}`"
        v-model="newBoardName"
        :placeholder="$t('editing.inputCategoryName')"
        type="text"
        name="newBoardName"
      />
    </writing-dialog>

    <writing-dialog
      v-if="isShowEdit"
      :title="$t('editing.editingName')"
      :button="$t('button.change')"
      :show-both="true"
      @closeDialog="closeEdit"
      @confirmBtn="confirmEdit"
    >
      <input-verify
        v-validate="`required|max:${max}`"
        v-model="tempEditInfo.name"
        type="text"
        name="tempEditInfoName"
      />
    </writing-dialog>
    <decide-dialog
      v-if="isShowDelete"
      :title="`${confirmDeleteText} ${tempEditInfo.name}？`"
      :type="'delete'"
      @closeDialog="closeDelete"
      @confirmBtn="confirmDelete"
    />
    <writing-dialog
      v-if="isShowShare"
      :title="$t('button.shareLink')"
      :button="$t('button.copy')"
      :show-both="false"
      @closeDialog="closeShare"
      @confirmBtn="confirmShare"
    >
      <input
        ref="shareInput"
        v-model="shareLink"
        type="text"
        class="input pinboard-name-input"
      >
    </writing-dialog>
  </div>
</template>
<script>
import SinglePinboard from './components/SinglePinboard'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import InputVerify from '@/components/InputVerify'
import { mapState } from 'vuex'
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
  computed: {
    ...mapState('userManagement', ['userId']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    pinboardList () {
      return this.isPersonalPinboard
        ? this.$store.state.pinboard.pinboardList
        : this.$store.state.pinboard.groupPinboardList
    },
    userId () {
      return this.$store.state.userManagement.userId
    },
    accountId () {
      return this.$route.params.account_id
    },
    groupId () {
      return this.$route.params.group_id
    },
    isPersonalPinboard () {
      return this.$route.name === 'PersonalPagePinboardList'
    }
  },
  mounted () {
    this.getPinboardInfo()
  },
  beforeDestroy () {
    this.$store.commit('pinboard/setPinboardList', [])
    this.$store.commit('pinboard/setGroupPinboardList', [])
  },
  methods: {
    getPinboardInfo () {
      if (this.isPersonalPinboard) {
        this.$store.dispatch('pinboard/getPinboardList').then(() => {
          this.isLoading = false
        })
      } else {
        this.$store.dispatch('pinboard/getGroupPinboardList', this.groupId).then(() => {
          this.isLoading = false
        })
      }
    },
    addCategory () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        let promise
        if (this.isPersonalPinboard) {
          promise = this.$store.dispatch('pinboard/createPinboard', this.newBoardName)
        } else {
          promise = this.$store.dispatch('pinboard/createGroupPinboard', { name: this.newBoardName, groupId: this.groupId })
        }
        promise.then(response => {
          this.getPinboardInfo()
          this.isShowAdd = false
          this.$nextTick(() => {
            this.newBoardName = null
          })
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
      if (this.isPersonalPinboard) { this.shareLink = `${window.location.origin}/account/${this.accountId}/pinboard/${boardInfo.id}` } else { this.shareLink = `${window.location.origin}/account/${this.accountId}/group/${this.groupId}/pinboard/${boardInfo.id}` }
    },
    confirmEdit () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        let promise
        if (this.isPersonalPinboard) {
          this.tempEditInfo.userId = this.userId
          promise = this.$store.dispatch('pinboard/updatePinboardName', this.tempEditInfo)
        } else {
          this.tempEditInfo.groupId = this.groupId
          promise = this.$store.dispatch('pinboard/updateGroupPinboardName', this.tempEditInfo)
        }
        promise.then(() => {
          this.isShowEdit = false
        })
          .catch(() => {})
      })
    },
    confirmDelete () {
      if (this.isPersonalPinboard) {
        this.$store.dispatch('pinboard/deletePinboard', { userId: this.userId, id: this.tempEditInfo.id }).then(() => {
          this.isShowDelete = false
        })
      } else {
        this.$store.dispatch('pinboard/deleteGroupPinboard', { groupId: this.groupId, id: this.tempEditInfo.id }).then(() => {
          this.isShowDelete = false
        })
      }
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
        duration: 3 * 1000,
        showClose: true
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
      this.$nextTick(() => {
        this.newBoardName = null
      })
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
