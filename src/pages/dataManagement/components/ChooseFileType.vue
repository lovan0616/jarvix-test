<template>
  <div class="choose-file-type">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block></upload-process-block>
    <div class="dialog-body">
      <div class="input-block-container">
        <div class="input-block file-type-select-block"
          :class="{'has-error': errors.has('fileTypeSelect')}"
        >
          <sy-select class="file-type-select"
            name="fileTypeSelect"
            :selected="bookmarkInfo.type"
            :items="fileTypeList"
            :placeholder="$t('editing.selectDataType')"
            @update:selected="bookmarkTypeChange"
            v-validate="'required'"
          ></sy-select>
          <div class="error-text">{{ $t('editing.choiceDataTypeFirst') }}</div>
        </div>
        <input-block class="file-info-input-block"
          v-if="!currentDataSourceInfo"
          :label="$t('editing.dataSourceName')"
          name="dataSourceName"
          v-model="bookmarkInfo.name"
          v-validate="'required'"
        ></input-block>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-default"
          @click="nextStep"
        >{{ $t('button.nextStep') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import InputBlock from '@/components/InputBlock'
import UploadProcessBlock from './UploadProcessBlock'
import { createBookmark } from '@/API/Bookmark'
import { createDataSource } from '@/API/DataSource'

export default {
  inject: ['$validator'],
  name: 'ChooseFileType',
  components: {
    SySelect,
    InputBlock,
    UploadProcessBlock
  },
  data () {
    return {
      bookmarkInfo: {
        name: null,
        type: null
      },
      typeList: [
        {
          name: 'CSV',
          id: 'CSV'
        }
        // {
        //   name: 'MySQL',
        //   id: 'mysql'
        // }
      ]
    }
  },
  watch: {
    'bookmarkInfo.type' (value) {
      this.$validator.validate('fileTypeSelect', value)
    }
  },
  methods: {
    bookmarkTypeChange (id) {
      this.bookmarkInfo.type = id
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    nextStep () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let promise
          if (this.currentDataSourceInfo) {
            // 將 name 塞進去
            this.bookmarkInfo.name = this.currentDataSourceInfo.name
          } else {
            /**
             * 新增bookmark
             * 這邊得這樣處理是因為，後端 MySQL 跟 SQLITE 在這邊送一樣的值，但是在後面連線的時候又要區分開來
             **/
            promise = createBookmark({
              name: this.bookmarkInfo.name
            })
          }

          promise.then(res => {
            this.$store.commit('dataManagement/updateCurrentUploadInfo', {
              dataSourceId: res.bookmark.id,
              fileCount: res.bookmark.config ? Object.keys(res.bookmark.config.tables).length : 0,
              ...this.bookmarkInfo
            })
          })
        }
      })
    }
  },
  computed: {
    currentDataSourceInfo () {
      return this.$store.state.dataManagement.currentDataSourceInfo
    },
    fileTypeList () {
      if (this.currentDataSourceInfo) {
        return this.typeList.filter(element => {
          return element.id === this.currentDataSourceInfo.type
        })
      } else {
        return this.typeList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-file-type {
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    margin-bottom: 16px;
  }

  .input-block-container {
    width: 53.41%;
    margin: 0 auto;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .input-block {
      &:not(:last-child) {
        margin-bottom: 92px;
      }
    }
  }

  .file-type-select-block {
    position: relative;
  }

  .file-type-select {
    width: 100%;
    border-bottom: 1px solid #979797;
  }

  .file-info-input-block {
    position: relative;

    .file-source-input {
      height: 40px;
    }
  }

  .upload-input-label {
    position: absolute;
    top: -21px;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.5px;
    color: #979797;
  }
}
</style>
