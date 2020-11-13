<template>
  <div class="mini-app-list-page list-page wrapper">
    <h1 class="list-page__title">{{ $t('miniApp.application') }}</h1>
    <div class="list-page__action-container">
      <button
        class="btn-m btn-default btn-has-icon add-btn" 
        @click="showAdd">
        <svg-icon 
          icon-class="plus" 
          class="icon"/>
        {{ $t('miniApp.createNewApplication') }}
      </button>
    </div>
    <spinner
      v-if="isLoading" 
      :title="$t('editing.loading')"
    />
    <div v-else>
      <div 
        v-if="miniAppList.length > 0" 
        class="mini-app-list">
        <single-mini-app-card
          v-for="miniAppInfo in miniAppList"
          :key="miniAppInfo.id"
          :mini-app-info="miniAppInfo"
          @showEdit="showEditDialog(miniAppInfo)"
          @showDelete="showDeleteDialog(miniAppInfo)"
          @showShare="showShareDialog(miniAppInfo)"
        />
      </div>
      <empty-info-block
        v-else
        :msg="$t('miniApp.emptyApplication')"
      />
    </div>
    <writing-dialog
      v-if="isShowEdit"
      :title="tempEditInfo.id ? $t('miniApp.editApp') : $t('miniApp.createNewApplication')"
      :button="tempEditInfo.id ? $t('button.change') : $t('button.create')"
      :show-both="true"
      :is-loading="isProcessing"
      @closeDialog="closeEdit"
      @confirmBtn="tempEditInfo.id ? confirmEdit() : createMiniApp()"
    >
      <div class="dialog__input-block">
        <label class="dialog__label">
          {{ $t('miniApp.miniAppName') }}
          <input-verify
            v-validate="`required|max:${max}`"
            v-model="tempEditInfo.name"
            :placeholder="$t('miniApp.pleaseEnterName')"
            type="text"
            name="tempEditInfoName"
          />
        </label>
      </div>
      <div class="dialog__input-block">
        <label class="dialog__label">
          {{ $t('miniApp.description') }}
          <input-verify
            v-validate="`required|max:${max}`"
            v-model="tempEditInfo.description"
            :placeholder="$t('miniApp.pleaseEnterDescription')"
            type="text"
            name="tempEditInfoDescription"
          />
        </label>
      </div>
      <div class="dialog__icons-block">
        <label class="dialog__label">
          {{ $t('miniApp.chooseIcon') }}
        </label>
        <div class="dialog__icons-wrapper">
          <label
            v-for="(icon, index) in iconList"
            :key="index"
            :class="{ 'active': tempEditInfo.icon === icon }"
            class="dialog__icon-box"
            @click="selectIcon(icon)"
          >
            <input
              v-validate="index === 0 ? getValidationRules(iconList.length) : null"
              :value="index"
              name="icon_group"
              type="radio"
            >
            <svg-icon 
              :icon-class="icon" 
              class="icon"/>
          </label>
        </div>
        <div
          v-show="errors.has('icon_group')"
          class="input-error error-text"
        >
          {{ $t('miniApp.pleaseSelectAnIcon') }}
        </div>
      </div>
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
      :title="$t('miniApp.getAppUrl')"
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
import SingleMiniAppCard from './components/SingleMiniAppCard'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import InputVerify from '@/components/InputVerify'
import { Message } from 'element-ui'
import { 
  getMiniAppList,
  createApp,
  updateAppSetting,
  deleteMiniApp
} from '@/API/MiniApp'

const dummyAppList = [
  {
    id: 1,
    name: '營運分析',
    description: '營運分析應用程式',
    icon: 'icon 1'
  },
  {
    id: 2,
    name: '會計報表',
    description: '會計報表應用程式',
    icon: 'icon 2'
  }
]

export default {
  name: 'MiniAppList',
  inject: ['$validator'],
  components: {
    SingleMiniAppCard,
    DecideDialog,
    WritingDialog,
    EmptyInfoBlock,
    InputVerify
  },
  data () {
    return {
      isLoading: true,
      miniAppList: [],
      isShowAdd: false,
      isShowEdit: false,
      isShowDelete: false,
      isShowShare: false,
      shareLink: '',
      tempEditInfo: {
        id: null,
        name: null,
        icon: null,
        description: null
      },
      miniAppInfoTemplate: {
        id: null,
        name: null,
        icon: null,
        description: null
      },
      confirmDeleteText: this.$t('editing.confirmDelete'),
      isProcessing: false,
      iconList: [
        'jarvix-app',
        'jarvix-app',
        'jarvix-app',
        'jarvix-app',
        'jarvix-app',
        'jarvix-app',
        'jarvix-app',
        'jarvix-app',
        'jarvix-app',
        'jarvix-app'
      ]
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    groupId () {
      return this.$route.params.group_id
    },
    accountId () {
      return this.$route.params.account_id
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getMiniAppList(this.groupId)
        .then(res => this.miniAppList = dummyAppList)
        .finally(() => this.isLoading = false)
    },
    createMiniApp () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.isProcessing = true
        createApp({
          settings: {},
          name: this.tempEditInfo.name,
          description: this.tempEditInfo.description,
          icon: this.tempEditInfo.icon,
          groupId: this.groupId
        })
          .then(response => {
            Message({
              message: this.$t('message.createdSuccessfully'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.fetchData()
            this.isShowEdit = false
          })
          .finally(() => { this.isProcessing = false })
      })
    },
    holdMiniAppInfo (miniAppInfo) {
      this.tempEditInfo = JSON.parse(JSON.stringify(miniAppInfo))
    },
    showEditDialog (miniAppInfo) {
      this.holdMiniAppInfo(miniAppInfo)
      this.isShowEdit = true
    },
    showDeleteDialog (miniAppInfo) {
      this.holdMiniAppInfo(miniAppInfo)
      this.isShowDelete = true
    },
    showShareDialog (miniAppInfo) {
      this.holdMiniAppInfo(miniAppInfo)
      this.isShowShare = true
      this.shareLink = `${window.location.origin}/account/${this.accountId}/group/${this.groupId}/mini-apps/${miniAppInfo.id}?mode=view`
    },
    showAdd () {
      this.holdMiniAppInfo(this.miniAppInfoTemplate)
      this.isShowEdit = true
    },
    confirmEdit () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.isProcessing = true
        updateAppSetting(this.tempEditInfo.id, {
          settings: this.tempEditInfo.settings,
          description: this.tempEditInfo.description,
          icon: this.tempEditInfo.icon,
          name: this.tempEditInfo.name
        })
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
      deleteMiniApp(this.tempEditInfo.id)
        .then(() => {
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
    closeEdit () {
      this.isShowEdit = false
    },
    closeDelete () {
      this.isShowDelete = false
    },
    closeShare () {
      this.isShowShare = false
    },
    selectIcon(icon) {
      this.tempEditInfo.icon = icon
    },
    getValidationRules (listLength) {
      return`required|included:${[...Array(listLength).keys()].join()}`
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

  .mini-app-list {
    display: flex;
    flex-wrap: wrap;
  }

  .name-input {
    margin: 24px 0px;
    padding-bottom: 8px;
  }

  /deep/ .dialog-inner-box {
    .dialog-select-text {
      margin-bottom: 24px;
    }
    .input-verify-text {
      margin-bottom: 26px;
    }

    .input-error {
      bottom: 9px;
    }
  }

  .dialog {
    &__input-block,
    &__icons-block {
      text-align: left;
    }

    &__label {
      color: #CCCCCC;
      font-weight: 600;
      font-size: 14px;
    }

    &__icons-wrapper {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &__icons-block {
      margin-bottom: 15px;
    }

    &__icon-box {
      width: 84px;
      height: 75px;
      border: 2px solid #485454;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all .1s linear;
      font-size: 32px;
      color: #CCCCCC;

      &.active,
      &:hover {
        background: #485454;
        border: 2px solid #2AD2E2;
        color: #FFFFFF;
      }
    }
  }
}

</style>
