<template>
  <div class="war-room-list-page list-page">
    <h1 class="list-page__title">{{ $t('warRoom.warRoom') }}</h1>
    <button 
      class="btn-m btn-default btn-has-icon add-btn" 
      @click="showAdd">
      <svg-icon 
        icon-class="plus" 
        class="icon"/>
      {{ $t('button.AddNewWarRoom') }}
    </button>
    <spinner
      v-if="isLoading" 
      :title="$t('editing.loading')"
    />
    <div v-else>
      <div 
        v-if="warRoomList.length > 0" 
        class="war-room-list">
        <single-war-room
          v-for="warRoomInfo in warRoomList"
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
      :title="$t('warRoom.add') + $t('warRoom.warRoom')"
      :button="$t('button.create')"
      :show-both="true"
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
import { 
  createWarRoom, 
  deleteWarRoom, 
  getWarRoomList, 
  updateWarRoomName,
  publishWarRoom,
  unpublishWarRoom } from '@/API/WarRoom'
import { Message } from 'element-ui'

export default {
  name: 'WarRoomList',
  inject: ['$validator'],
  components: {
    SingleWarRoom,
    DecideDialog,
    WritingDialog,
    EmptyInfoBlock,
    InputVerify
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
      confirmDeleteText: this.$t('editing.confirmDelete')
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    groupId () {
      return this.$route.params.group_id
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      getWarRoomList(this.groupId).then(res => {
        res = [
          {
            "isPublishing": true,
            "name": "0A0",
            "urlIdentifier": "string",
            "id": 0
          },{
            "isPublishing": false,
            "name": "OAO",
            "urlIdentifier": "string",
            "id": 1
          },{
            "isPublishing": true,
            "name": ">A<",
            "urlIdentifier": "string",
            "id": 2
          }
        ]
        this.warRoomList = res
        this.isLoading = false
      })
    },
    publish(id) {
      publishWarRoom(id).then(() => {
        this.fetchData()
      })
    },
    unpublish (id) {
      unpublishWarRoom(id).then(() => {
        this.fetchData()
      })
    },
    addNewWarRoom () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        createWarRoom({ name: this.newWarRoomName, groupId: this.groupId })
          .then(response => {
            this.fetchData()
            this.isShowAdd = false
            this.$nextTick(() => {
              this.newWarRoomName = null
            })
          }).catch(() => {})
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
      //TODO: live board router + urlIdentifier
      this.shareLink = warRoomInfo.urlIdentifier
    },
    showAdd () {
      this.isShowAdd = true
    },
    confirmEdit () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        updateWarRoomName(this.tempEditInfo.id, this.tempEditInfo.name)
          .then(() => {
            this.isShowEdit = false
            this.fetchData()
          })
      })
    },
    confirmDelete () {
      deleteWarRoom(this.tempEditInfo.id).then(() => {
        this.isShowDelete = false
        this.fetchData()
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
  }

  .add-btn {
    margin-bottom: 16px;
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
