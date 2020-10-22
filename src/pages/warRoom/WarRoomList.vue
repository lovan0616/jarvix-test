<template>
  <div class="war-room-list-page list-page">
    <h1 class="list-page__title">{{ $t('warRoom.warRoom') }}</h1>
    <div class="list-page__action-container">
      <button
        v-if="hasPermission('group_create_data')"
        class="btn-m btn-default btn-has-icon add-btn" 
        @click="showAdd">
        <svg-icon 
          icon-class="plus" 
          class="icon"/>
        {{ $t('button.AddNewWarRoom') }}
      </button>
      <div
        v-if="!isLoading && warRoomList.length > 0"
        class="list-page__filter-select-wrapper"
      >
        <div class="list-page__filter-select-label">{{ $t('warRoom.displaySetting') }}</div>
        <default-select
          v-model="selectedFilterOption"
          :option-list="filterOptions"
          class="list-page__filter-select"
        />
      </div>
    </div>
    <spinner
      v-if="isLoading" 
      :title="$t('editing.loading')"
    />
    <div v-else>
      <div 
        v-if="warRoomList.length > 0" 
        class="war-room-list">
        <single-war-room
          v-for="warRoomInfo in displayedFilterList"
          :key="warRoomInfo.id"
          :war-room-info="warRoomInfo"
          @publish="publish"
          @unpublish="unpublish"
          @showEdit="showEditDialog(warRoomInfo)"
          @showDelete="showDeleteDialog(warRoomInfo)"
          @showShare="showShareDialog(warRoomInfo)"
        />
      </div>
      <empty-info-block
        v-else
        :msg="$t('editing.emptyPinboard')"
      />
    </div>
    <writing-dialog
      v-if="isShowAdd"
      :title="$t('warRoom.addWarRoom')"
      :button="$t('button.create')"
      :show-both="true"
      :is-loading="isProcessing"
      @closeDialog="closeAdd"
      @confirmBtn="addNewWarRoom"
    >
      <input-verify
        v-validate="`required|max:${max}`"
        v-model="newWarRoomName"
        :placeholder="$t('editing.pleaseEnterName')"
        type="text"
        name="newWarRoomName"
      />
    </writing-dialog>

    <writing-dialog
      v-if="isShowEdit"
      :is-loading="isProcessing"
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
      :is-processing="isProcessing"
      :title="`${confirmDeleteText} ${tempEditInfo.name}？`"
      :type="'delete'"
      @closeDialog="closeDelete"
      @confirmBtn="confirmDelete"
    />
    <writing-dialog
      v-if="isShowShare"
      :title="$t('warRoom.getPublishedUrl')"
      :button="$t('button.copy')"
      :show-both="false"
      @closeDialog="closeShare"
      @confirmBtn="confirmShare"
    >
      <input 
        ref="shareInput" 
        v-model="shareLink" 
        type="text" 
        class="input name-input">
    </writing-dialog>
  </div>
</template>
<script>
import SingleWarRoom from './components/SingleWarRoom'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import InputVerify from '@/components/InputVerify'
import DefaultSelect from '@/components/select/DefaultSelect'
import { 
  createWarRoom, 
  deleteWarRoom, 
  getWarRoomList, 
  updateWarRoomName,
  publishWarRoom,
  unpublishWarRoom } from '@/API/WarRoom'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'WarRoomList',
  inject: ['$validator'],
  components: {
    SingleWarRoom,
    DecideDialog,
    WritingDialog,
    EmptyInfoBlock,
    InputVerify,
    DefaultSelect
  },
  data () {
    return {
      isLoading: true,
      newWarRoomName: null,
      warRoomList: [],
      isShowAdd: false,
      isShowEdit: false,
      isShowDelete: false,
      isShowShare: false,
      shareLink: '',
      tempEditInfo: {
        id: null,
        name: null,
        isPublishing: false,
        urlIdentifier: null
      },
      confirmDeleteText: this.$t('editing.confirmDelete'),
      isProcessing: false,
      filterOptions: [
        {
          name: this.$t('warRoom.all'),
          value: 'all'
        },
        {
          name: this.$t('warRoom.hasPublished'),
          value: 'published'
        },
        {
          name: this.$t('warRoom.notPublished'),
          value: 'not-published'
        }
      ],
      selectedFilterOption: 'all'
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    groupId () {
      return this.$route.params.group_id
    },
    displayedFilterList () {
      if (this.selectedFilterOption === 'all') return this.warRoomList
      return this.warRoomList.filter(warRoom => warRoom.isPublishing === (this.selectedFilterOption === 'published'))
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getWarRoomList(this.groupId).then(res => {
        this.warRoomList = res
      }).finally(() => {
        this.isLoading = false
      })
    },
    publish(id) {
      publishWarRoom(id).then(() => {
        Message({
          message: this.$t('message.publishSuccessfully'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        this.fetchData()
      })
    },
    unpublish (id) {
      unpublishWarRoom(id).then(() => {
        Message({
          message: this.$t('message.unPublishSuccessfully'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        this.fetchData()
      })
    },
    addNewWarRoom () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.isProcessing = true
        createWarRoom({ name: this.newWarRoomName, groupId: this.groupId })
          .then(response => {
            Message({
              message: this.$t('message.createdSuccessfully'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.fetchData()
            this.isShowAdd = false
            this.$nextTick(() => {
              this.newWarRoomName = null
            })
          })
          .finally(() => { this.isProcessing = false })
      })
    },
    holdWarRoomInfo (warRoomInfo) {
      this.tempEditInfo = JSON.parse(JSON.stringify(warRoomInfo))
    },
    showEditDialog (warRoomInfo) {
      this.holdWarRoomInfo(warRoomInfo)
      this.isShowEdit = true
    },
    showDeleteDialog (warRoomInfo) {
      this.holdWarRoomInfo(warRoomInfo)
      this.isShowDelete = true
    },
    showShareDialog (warRoomInfo) {
      this.holdWarRoomInfo(warRoomInfo)
      this.isShowShare = true
      this.shareLink = `${window.location.origin}/war-room?id=${warRoomInfo.urlIdentifier}`
    },
    showAdd () {
      this.isShowAdd = true
    },
    confirmEdit () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.isProcessing = true
        updateWarRoomName(this.tempEditInfo.id, { name: this.tempEditInfo.name })
          .then(() => {
            Message({
              message: this.$t('message.editNameSuccess'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.isShowEdit = false
            this.fetchData()
          })
          .finally(() => { this.isProcessing = false })
      })
    },
    confirmDelete () {
      this.isProcessing = true
      deleteWarRoom(this.tempEditInfo.id).then(() => {
        Message({
          message: this.$t('message.deleteSuccess'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        this.isShowDelete = false
        this.fetchData()
      })
      .finally(() => { this.isProcessing = false })
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
    closeAdd () {
      this.isShowAdd = false
      this.$nextTick(() => {
        this.newWarRoomName = null
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
  },
}
</script>
<style lang="scss" scoped>
.list-page {
  padding: 40px 24px;

  &__title {
    margin-top: 0;
    margin-bottom: 8px;
  }

  &__action-container {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }

  &__filter-select-wrapper {
    display: flex;
    align-items: center;
  }

  &__filter-select-label {
    font-size: 14px;
    color: #CCCCCC;
    margin-right: 8px;
  }

  &__filter-select {
    width: 120px;
    border-bottom: 1px solid #fff;
    [lang="en"] & {
      width: 160px;
    }
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
  }

  .war-room-list {
    display: flex;
    flex-wrap: wrap;
  }

  .name-input {
    margin: 24px 0px;
    padding-bottom: 8px;
  }
}

</style>
