<template>
  <div class="file-upload-finished">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="2"
    ></upload-process-block>
    <div class="dialog-body">
      <file-list-block
        v-if="successList.length > 0"
        :title="$t('editing.uploaded')"
        :file-list="successList"
      >
        <div class="uploaded-data-info" slot="fileListTitle">
          {{ $t('editing.dataSourceInfo', {type: currentUploadInfo.type, dataSourceName: currentUploadInfo.name}) }}
        </div>
      </file-list-block>
      <file-list-block
        v-if="failList.length > 0"
        :title="$t('editing.unuploaded')"
        type="fail"
        :file-list="failList"
      ></file-list-block>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-outline" type="button"
          @click="prev"
        >{{ $t('button.chooseFileUpload') }}</button>
        <button class="btn btn-default"
          @click="next"
        >{{ $t('button.nextStep') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileListBlock from './FileListBlock'
import UploadProcessBlock from './UploadProcessBlock'

export default {
  name: 'LocalFileUploadStatus',
  components: {
    FileListBlock,
    UploadProcessBlock
  },
  data () {
    return {
      uploadStatus
    }
  },
  methods: {
    cancel () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    next () {
      this.$emit('next')
    },
    prev () {
      // 清空上傳檔案
      this.$store.commit('dataManagement/updateUploadFileList', [])
      // 清空 etl table list
      this.$store.commit('dataManagement/clearEtlTableList')
      this.$emit('prev')
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadInfo', 'uploadFileList']),
    successList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.success
      })
    },
    failList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.fail
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-finished {
  .dialog-title {
    margin-bottom: 16px;
  }
  .finished-img-block {
    text-align: center;
    margin-bottom: 44px;
  }
  .finished-img {
    width: 70px;
    margin-bottom: 32px;
  }
  .finished-file-info {
    line-height: 20px;
  }
  .uploaded-data-info {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
}
</style>
