<template>
  <div class="management-info-page model-detail">
    <bread-crumb :name="modelInfo.name" />
    <div class="page-title-row">
      <div class="title">
        {{ $t('sideNav.modelDetail') }}
      </div>
      <button
        v-if="!isLoading"
        type="button" 
        class="btn-m btn-secondary"
        @click="isShowDeleteDialog = true">
        {{ $t('model.deleteModel') }}
      </button>
    </div>
    <spinner
      v-if="isLoading" 
      :title="$t('editing.loading')"
    />
    <section v-else>
      <!-- 模型名稱 / ID -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('model.modelNameId') }}</div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="info__label">{{ $t('model.name') }}:</div>
            <div class="info__text">{{ modelInfo.name }}</div>
            <div 
              class="link action-link" 
              @click="openRenameDialog">{{ $t('editing.editingName') }}</div>
          </div>
          <div class="info__row">
            <div class="info__label">{{ $t('model.id') }}:</div>
            <div class="info__text">{{ modelInfo.id }}</div>
          </div>
        </div>
      </div>
      <!-- 模型檔案 -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('model.modelFile') }}</div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="info__label">{{ $t('model.lastUpdatedTime') }}:</div>
            <div class="info__text">{{ timeToDateTime(modelInfo.updatedAt) }}</div>
          </div>
          <div class="info__row">
            <div class="info__label">{{ $t('model.fileInfo') }}:</div>
            <div class="info__text">{{ modelInfo.modelNames.join(', ') }}</div>
          </div>
        </div>
      </div>
      <!-- Input 參數 -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('model.inputParameters') }}</div>
        <div class="info-block__content">
          <div class="table-header">
            <div class="info__label info__cell ">{{ $t('model.parameterDataType') }}</div>
            <div class="info__label info__cell ">{{ $t('model.parameterDataName') }}</div>
          </div>
          <div 
            v-for="(item, index) in modelInfo.ioArgs.input"
            :key="index"
            class="table-row">
            <div class="info__text info__cell">{{ item.statsType }}</div>
            <div class="info__text info__cell">{{ item.modelColumnName }}</div>
          </div>
        </div>
      </div>
      <!-- Output 參數 -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('model.outputParameters') }}</div>
        <div class="info-block__content">
          <div class="table-header">
            <div class="info__label info__cell ">{{ $t('model.parameterDataType') }}</div>
            <div class="info__label info__cell ">{{ $t('model.parameterDataName') }}</div>
          </div>
          <div 
            v-for="(item, index) in modelInfo.ioArgs.output"
            :key="index"
            class="table-row">
            <div class="info__text info__cell">{{ item.statsType }}</div>
            <div class="info__text info__cell">{{ item.modelColumnName }}</div>
          </div>
        </div>
      </div>
      <!-- 建立資料 -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('model.createInfo') }}</div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="info__label">{{ $t('model.createdTime') }}:</div>
            <div class="info__text">{{ timeToDateTime(modelInfo.createdAt) }}</div>
          </div>
          <div class="info__row">
            <div class="info__label">{{ $t('model.creator') }}:</div>
            <div class="info__text">{{ modelInfo.createdBy }}</div>
          </div>
        </div>
      </div>
    </section>
    <decide-dialog
      v-if="isShowDeleteDialog"
      :content="$t('model.deleteConfirmText')"
      :type="'delete'"
      class="model-delete-dialog"
      @closeDialog="isShowDeleteDialog = false"
      @confirmBtn="deleteModel"
    />
    <writing-dialog
      v-if="isShowRenameDialog"
      :title="$t('editing.editingName')"
      :button="$t('button.change')"
      :show-both="true"
      @closeDialog="isShowRenameDialog = false"
      @confirmBtn="rename"
    >
      <input-verify
        v-validate="`required`"
        v-model="editedName"
        type="text"
        name="tempEditedModelName"
      />
    </writing-dialog>
  </div>
</template>
<script>
import InputVerify from '@/components/InputVerify'
import BreadCrumb from './components/BreadCrumb.vue'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import { getModelInfo, deleteModelById, modifyModelInfo } from '@/API/Model'
import { Message } from 'element-ui'

export default {
  name: 'ModelDetail',
  inject: ['$validator'],
  components: {
    InputVerify,
    BreadCrumb,
    DecideDialog,
    WritingDialog
  },
  data () {
    return {
      isLoading: false,
      isShowDeleteDialog: false,
      isShowRenameDialog: false,
      editedName: '',
      modelInfo: {}
    }
  },
  computed: {
    modelId () {
      return this.$route.params['model_id']
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getModelInfo(this.modelId)
        .then((response) => {
          this.modelInfo = response
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    openRenameDialog () {
      this.isShowRenameDialog = true
      this.editedName = this.modelInfo.name
    },
    rename () {
      this.$validator.validateAll().then(isValidated => {
        if(!isValidated) return
        if(this.editedName === this.modelInfo.name) return this.isShowRenameDialog = false
        modifyModelInfo(this.modelId, { 
          ...this.modelInfo, name: this.editedName
        }).finally(() => {
          this.isShowRenameDialog = false
          this.fetchData()
        })
      })
    },
    deleteModel () {
      deleteModelById(this.modelId)
        .then(() => {
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.$router.push({name: 'ModelList'})
        }).finally(() => {
          this.isShowDeleteDialog = false 
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.model-delete-dialog {
  >>> .dialog-content-wrapper > .content {
    color: #FFF;
  }
}
</style>