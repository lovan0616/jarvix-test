<template>
  <div class="file-upload-finished">
    <div class="dialog-title">
      <span v-if="uploadFileList.length === successList.length">{{ $t('editing.uploadSuccess') }}</span>
      <span v-else-if="uploadFileList.length === failList.length">{{ $t('editing.uploadFailure') }}</span>
      <span v-else>{{ $t('editing.uploadFinish') }}</span>
    </div>
    <div class="finished-img-block">
      <img 
        v-if="uploadFileList.length === successList.length" 
        :alt="$t('editing.uploadSuccess')" 
        src="../../../../assets/images/success.gif" 
        class="finished-img">
      <img 
        v-if="uploadFileList.length === failList.length" 
        :alt="$t('editing.uploadFailure')" 
        src="../../../../assets/images/error.gif" 
        class="finished-img">
      <div class="finished-file-info">
        {{ $t('editing.uploadStatus', {total: uploadFileList.length, success: successList.length, pending: failList.length}) }}
      </div>
    </div>
    <div class="dialog-body">
      <file-list-block
        v-if="successList.length > 0"
        :title="$t('editing.uploaded')"
        :file-list="successList"
      >
        <div 
          slot="fileListTitle" 
          class="uploaded-data-info">
          {{ $t('editing.dataSourceInfo', {type: currentUploadInfo.type, dataSourceName: currentUploadInfo.name}) }}
        </div>
      </file-list-block>
      <file-list-block
        v-if="failList.length > 0"
        :title="$t('editing.unuploaded')"
        :file-list="failList"
        type="fail"
      />
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="buildDataFrame"
        >{{ $t('button.finish') }}</button>
        <!-- <button class="btn btn-default"
          @click="toSetJoinTable"
        >{{ $t('button.toForeignTable') }}</button> -->
      </div>
    </div>
  </div>
</template>
<script>
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileListBlock from './fileUpload/FileListBlock'

export default {
  name: 'LocalFileUploadFinished',
  components: {
    FileListBlock
  },
  data () {
    return {
      uploadStatus
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
  },
  methods: {
    buildDataFrame () {
      if (this.$route.name === 'DataSourceList') {
        this.$store.dispatch('dataSource/getDataSourceList', {})
      } else {
        this.$store.commit('dataManagement/updateFileUploadSuccess', true)
      }
      // close fileUploadDialog
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
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
