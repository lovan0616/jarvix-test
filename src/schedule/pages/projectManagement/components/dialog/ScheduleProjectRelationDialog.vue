<template>
  <div class="full-page-dialog relation-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('schedule.project.dataSourceReRelation') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="$emit('close', false)"
        ><svg-icon icon-class="close"/></a>
      </div>
      <div class="relation-container">
        <!-- 管理資料源 -->
        <section class="relation-container__section">
          <div class="section-title">Step1: {{ $t('schedule.project.chooseDataSource') }}</div>
          <div class="section-content">
            <span class="content-title">{{ $t('schedule.project.dataSourceName') }}</span>
            <default-select 
              v-validate.disable="'required'"
              v-model="formData.datasourceId"
              :options="dataSourceOptions"
              name="datasourceId"
            />
          </div>
        </section>
        <!-- 管理資料表 -->
        <spinner 
          v-if="isLoadingFilesInfo"
          title="載入檔案中"
        />
        <section 
          v-else 
          class="relation-container__section">
          <div class="section-title">Step2: {{ $t('schedule.project.chooseDataFrame') }}</div>
          <div
            v-for="file in files.rawdata"
            :key="file.id"
            class="section-content"
          >
            <span class="content-title">{{ file.alias }}</span>
            <spinner 
              v-if="isLoadingDataFrameList" 
              :title="$t('editing.dataDownloading')" 
              size="10"/>
            <default-select
              v-validate="'required'"
              v-else
              v-model="formData[`${snakeToCamel(file.code)}DataframeId`]"
              :options="dataFrameOptions"
              :name="`dataFrameId-${file.id}`"
            />
          </div>
          <div class="section-content">
            <span class="content-title">{{ $t('schedule.project.orderOrJobInfo') }}</span>
            <spinner 
              v-if="isLoadingDataFrameList" 
              :title="$t('editing.dataDownloading')" 
              size="10"/>
            <default-select 
              v-validate="'required'"
              v-else
              v-model="formData.order"
              :options="dataFrameOptions"
              name="dataFrameId-order"
            />
            <default-button
              :disabled="isBindOrderBtnDisabled"
              @click="bindOrder">
              {{ $t('schedule.project.bind') }}
            </default-button>
          </div>
        </section>
      </div>
      <div class="dialog-footer">
        <div class="dialog-button-block">
          <button
            :disabled="isProcessing"
            class="btn btn-outline"
            @click="$emit('close', false)"
          >{{ $t('button.cancel') }}</button>
          <button
            :disabled="isProcessing"
            class="btn btn-default"
            @click="onClickBindRawdata"
          >
            <span v-if="isProcessing"><svg-icon icon-class="spinner"/>{{ $t('button.processing') }}</span>
            <span v-else>{{ $t('button.built') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDataFrameById } from '@/API/DataSource'
import { getUploadFileList } from '@/schedule/API/Setting'
import { checkOrder, checkRawdata } from '@/schedule/API/Bind'

export default {
  inject: ['$validator'],
  name: 'ScheduleProjectRelationDialog',
  props: {
    projectInfo: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data: () => {
    return {
      formData: {
        order: null
      },
      files: {},
      dataFrameList: [],
      isLoadingFilesInfo: false,
      isLoadingDataFrameList: true,
      isProcessing: false
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceList']),
    dataSourceOptions () {
      const options = this.dataSourceList.map(item => ({ value: item.id, label: item.name }))
      options.unshift({ value: null, label: this.$t('editing.defaultOption') })
      return options
    },
    dataFrameOptions () {
      const options = this.dataFrameList.map(item => ({ value: item.id, label: item.primaryAlias }))
      options.unshift({ value: null, label: this.$t('editing.defaultOption') })
      return options
    },
    isBindOrderBtnDisabled () {
      return this.formData.order === null
    }
  },
  watch: {
    'formData.datasourceId' (dataSourceId) {
      if (dataSourceId) {
        this.isLoadingDataFrameList = true
        getDataFrameById(dataSourceId)
          .then(res => {
            this.dataFrameList = res
            this.resetDataFrameSelectors()
            this.isLoadingDataFrameList = false
          })
          .catch(() => this.isLoadingDataFrameList = false)
      } else {
        this.dataFrameList = []
        this.resetDataFrameSelectors()
      }
    }
  },
  created () {
    this.$set(this.formData, 'datasourceId', this.projectInfo.datasourceId)
    this.fetchFiles()
  },
  methods: {
    fetchFiles () {
      this.isLoadingFilesInfo = true
      getUploadFileList()
        .then(res => {
          this.files = res
          res.rawdata.forEach(item => this.$set(this.formData, `${this.snakeToCamel(item.code)}DataframeId`, null))
          this.isLoadingFilesInfo = false
        })
        .catch(() => this.isLoadingFilesInfo = false)
    },
    onClickBindRawdata () {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return

        this.bindRawdata()
      })
    },
    bindOrder () {
      const requestBody = {
        dataframeId: this.formData.order,
        projectId: this.projectInfo.id
      }

      checkOrder(requestBody)
        .then(res => console.log(res))
    },
    bindRawdata () {
      const requestBody = {
        ...this.formData,
        projectId: this.projectInfo.id
      }
      delete requestBody.order
      delete requestBody.datasourceId

      checkRawdata(requestBody)
        .then(res => console.log(res))
    },
    resetDataFrameSelectors () {
      Object.keys(this.formData)
        .filter(key => key !== 'datasourceId')
        .forEach(key => this.formData[key] = null)
    },
    snakeToCamel (variable) {
      return variable.replace(/(\w)(_)(\w)/g, (match, $1, $2, $3) => `${$1}${$3.toUpperCase()}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.relation-dialog {
  .relation-container {
    &__section {
      padding: 24px;
      background: rgba(50, 58, 58, 0.95);
      border-radius: 5px;
      margin-bottom: 12px;
      .section {
        &-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        &-content {
          display: flex;
          align-items: flex-start;
          .content-title {
            font-size: 14px;
            line-height: 40px;
            flex-basis: 200px;
            margin-right: 24px;
            text-align: right;
          }
          /deep/ .default-select {
            padding-bottom: 10px;
            .el-input .el-input__inner {
              color: #CCC;
            }
          }
        }
      }
    }
  }
}

/deep/ .spinner-block {
  width: 188px;
  height: 50px;
  padding: 0;
  .spinner-container {
    display: flex;
    align-items: center;
    .spinner-circle {
      margin-right: 16px;
    }
    .spinner-title {
      margin-top: 0;
    }
  }
}
</style>