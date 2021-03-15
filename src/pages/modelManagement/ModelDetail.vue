<template>
  <div class="management-info-page model-detail">
    <bread-crumb :name="modelInfo.name" />
    <div class="page-title-row">
      <div class="title">
        {{ $t('sideNav.modelDetail') }}
      </div>
      <button 
        type="button" 
        class="btn-m btn-secondary"
        @click="isShowDeleteDialog = true">
        {{ $t('model.deleteModel') }}
      </button>
    </div>
    <section>
      <!-- 模型名稱 / ID -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('model.modelNameId') }}</div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="link action-link">{{ $t('editing.editingName') }}</div>
            <div class="info__label">{{ $t('model.name') }}:</div>
            <div class="info__text">{{ modelInfo.name }}</div>
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
            <div class="info__text">{{ modelInfo.models.join(', ') }}</div>
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
            v-for="(item, index) in modelInfo.ioArgsDo.input"
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
            v-for="(item, index) in modelInfo.ioArgsDo.output"
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
  </div>
</template>
<script>
import BreadCrumb from './components/BreadCrumb.vue'
import DecideDialog from '@/components/dialog/DecideDialog'
import { deleteModelById } from '@/API/Model'
import { Message } from 'element-ui'

export default {
  name: 'ModelDetail',
  components: {
    BreadCrumb,
    DecideDialog
  },
  data () {
    return {
      isShowDeleteDialog: false,
      modelInfo: {
        createdAt: "2019.02.03",
        createdBy: "youtuber",
        id: 0,
        ioArgsDo: {
          input: [
            {
              modelColumnName: "時間",
              statsType: "DATETIME"
            },
            {
              modelColumnName: "成本",
              statsType: "Numeric"
            }
          ],
          output: [
            {
              modelColumnName: "成本",
              statsType: "Numeric"
            },
            {
              modelColumnName: "數量",
              statsType: "Numeric"
            }
          ]
        },
        models: [
          "model1", "model2"
        ],
        name: "modelName",
        updatedAt: "2019.02.03"
      }
    }
  },
  methods: {
    deleteModel () {
      deleteModelById(this.modelInfo.id)
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