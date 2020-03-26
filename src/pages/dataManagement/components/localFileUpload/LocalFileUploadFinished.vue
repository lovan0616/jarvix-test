<template>
  <div class="file-upload-finished">
    <div class="dialog-title">
      <span v-if="uploadFileList.length === successList.length">{{ $t('editing.uploadSuccess') }}</span>
      <span v-else-if="uploadFileList.length === failList.length">{{ $t('editing.uploadFailure') }}</span>
      <span v-else>{{ $t('editing.uploadFinish') }}</span>
    </div>
    <div class="finished-img-block">
      <img v-if="uploadFileList.length === successList.length" src="../../../../assets/images/success.gif" :alt="$t('editing.uploadSuccess')" class="finished-img">
      <img v-if="uploadFileList.length === failList.length" src="../../../../assets/images/error.gif" :alt="$t('editing.uploadFailure')" class="finished-img">
      <div class="finished-file-info">
        {{ $t('editing.uploadStatus', {total: uploadFileList.length, success: successList.length, pedding: failList.length}) }}
      </div>
    </div>
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
          @click="buildBookmark"
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
import FileListBlock from './FileListBlock'

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
  methods: {
    buildBookmark () {
      if (this.$route.name === 'PageDataSourceList') {
        this.$store.dispatch('dataSource/getDataSourceList')
      } else {
        this.$store.commit('dataManagement/updateFileUploadSuccess', true)
      }
      // close fileUploadDialog
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
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
