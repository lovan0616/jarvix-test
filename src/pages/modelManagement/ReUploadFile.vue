<template>
  <div class="management-info-page model-reupload">
    <bread-crumb :name="currentModelInfo.name" />
    <div class="page-title-row">
      <div class="title">
        {{ $t('sideNav.reUploadFile') }}
      </div>
      <div class="warning">
        <svg-icon icon-class="data-explanation" />
        {{ $t('model.reUploadReminder', {mainScriptName}) }}
      </div>
    </div>
    <file-upload
      class="file-upload-block"
    />
  </div>
</template>
<script>
import BreadCrumb from './components/BreadCrumb.vue'
import FileUpload from './scriptExecution/fileUpload/FileUpload'
import { mapState } from 'vuex'

export default {
  name: 'ReUploadFile',
  components: {
    BreadCrumb,
    FileUpload
  },
  data () {
    return {
      mainScriptName: 'main.py'
    }
  },
  computed: {
    ...mapState('modelManagement', ['currentModelInfo'])
  }
}
</script>
<style lang="scss" scoped>
.model-reupload {
  .page-title-row {
    justify-content: unset;
  }

  .file-upload-block {
    margin-bottom: 0;
    >>> .dialog-body {
      margin-bottom: 16px;

      .upload-block {
        border-radius: 5px;
      }

      .file-list-container {
        margin-top: 0;
      }
    }

    >>> .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .dialog-button-block {
        display: flex;
        justify-content: flex-end;
        flex: 1;

        .btn {
          &-cancel {
            display: none;
          }

          &:not(:last-child) {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
