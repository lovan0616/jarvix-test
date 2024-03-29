<template>
  <div class="edit-column-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.dataColumn') }}
        <a
          href="javascript:void(0)"
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close" /></a>
      </div>
      <div class="dialog-header-block">
        <el-tooltip
          :content="tableInfo.primaryAlias"
          placement="bottom"
        >
          <div class="data-frame-name">
            {{ $t('editing.dataFrame') }}：{{ tableInfo.primaryAlias }}
          </div>
        </el-tooltip>
      </div>
      <div class="edit-table-block">
        <div class="data-template-block">
          <el-tooltip :content="$t('editing.downloadDisplayNameTemplate')">
            <button
              :disabled="isLoadingPrimaryAliasTemplate"
              class="btn btn-secondary"
              @click="getPrimaryAliasTemplate"
            >
              <svg-icon
                v-show="isLoadingPrimaryAliasTemplate"
                icon-class="spinner"
              />
              {{ $t('editing.downloadAliasTemplate') }}
            </button>
          </el-tooltip>
          <el-popover
            v-model="isUploadPopoverVisible"
            trigger="click"
            popper-class="el-popover--value-alias-template-uploader"
          >
            <label
              for="primaryAliasTemplateInput"
              class="data-template-block__input-label"
            >
              <span class="file-name">{{ primaryAliasTemplateInput ? primaryAliasTemplateInput.name : $t('editing.chooseFile') }}</span>
              <input
                id="primaryAliasTemplateInput"
                :key="primaryAliasTemplateInput ? primaryAliasTemplateInput.name : 'empty'"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                type="file"
                hidden
                @change="onInputPrimaryAliasTemplate($event.target.files)"
              >
            </label>
            <div
              v-show="primaryAliasTemplateInput"
              class="button-block"
            >
              <a
                href="javascript:void(0);"
                class="link btn-cancel"
                @click="onCancelUploadPrimaryAliasTemplate"
              >{{ $t('button.cancel') }}</a>
              <a
                :disabled="isUploadingPrimaryAliasTemplate"
                href="javascript:void(0);"
                class="link btn-confirm"
                @click="updatePrimaryAliasTemplate"
              >
                <svg-icon
                  v-show="isUploadingPrimaryAliasTemplate"
                  icon-class="spinner"
                />
                {{ $t('button.upload') }}
              </a>
            </div>
            <el-tooltip
              slot="reference"
              :content="$t('editing.uploadDisplayNameTemplate')"
            >
              <button
                class="btn btn-secondary"
              >
                {{ $t('editing.uploadAliasTemplate') }}
              </button>
            </el-tooltip>
          </el-popover>
          <div
            v-if="userEditInfo.userEditedColumnInputList.length > 0"
            class="button-block"
          >
            <span class="remark-text">{{ $t('editing.rebuildRemark') }}</span>
            <button
              :disabled="isProcessing"
              class="btn-m btn-default"
              @click="buildAlias"
            >
              {{ $t('button.build') }}
            </button>
          </div>
        </div>
        <div class="data-table">
          <div class="data-table-head is-scrolling">
            <div class="data-table-row table-head">
              <div class="data-table-cell name">
                {{ $t('editing.columnDisplayName') }}
              </div>
              <div
                v-if="isJoinTable"
                class="data-table-cell source"
              >
                {{ $t('editing.columnSource') }}
                <span class="nav-item nav-function tooltip-container">
                  <svg-icon
                    icon-class="information-circle"
                    class="icon"
                  />
                  <div class="tooltip">{{ $t('editing.columnSourceRemind') }}</div>
                </span>
              </div>
              <div class="data-table-cell alias">
                {{ $t('editing.alias') }}
              </div>
              <div class="data-table-cell tag">
                {{ $t('editing.columnTag') }}
              </div>
              <div class="data-table-cell created-method">
                {{ $t('editing.createdMethod') }}
              </div>
              <div class="data-table-cell action">
                {{ $t('editing.action') }}
              </div>
            </div>
          </div>
          <div
            ref="dataTableBody"
            class="data-table-body"
          >
            <spinner v-if="isLoading" />
            <div
              v-for="(column, index) in columnList"
              v-else
              :key="column.id"
              class="data-table-row"
            >
              <div class="data-table-cell name">
                <el-tooltip
                  v-show="!isEditing(column.id)"
                  :disabled="column.originalName === column.name.primaryAlias"
                  placement="bottom-start"
                >
                  <template #content>
                    {{ $t('editing.originalName') }}：{{ column.originalName }}
                  </template>
                  <span :class="{'is-modified': column.name.isModified}">
                    {{ column.name.primaryAlias }}
                    <svg-icon
                      v-show="column.originalName && column.originalName !== column.name.primaryAlias"
                      icon-class="information-circle"
                      class="name-info-icon"
                    />
                  </span>
                </el-tooltip>
                <input-verify
                  v-validate="`letterSpace|max:${max}`"
                  v-show="isEditing(column.id)"
                  v-model="tempRowInfo.primaryAlias"
                  :name="'name-' + column.id"
                  class="edit-alias-input-block"
                />
              </div>
              <div
                v-if="isJoinTable"
                class="data-table-cell source"
              >
                {{ column.parentDataFrameAlias || '-' }}
              </div>
              <div class="data-table-cell alias">
                <span v-show="!isEditing(column.id) && column.aliasList.length === 0"> - </span>
                <div
                  v-for="(singleAlias, aliasIndex) in column.aliasList"
                  v-show="!isEditing(column.id)"
                  :class="{'is-modified': singleAlias.isModified}"
                  :key="column.id + '-' + aliasIndex"
                  class="alias__item"
                >
                  {{ singleAlias.name }}<span v-show="aliasIndex !== column.aliasList.length - 1">, </span>
                </div>
                <!-- 不使用v-if因為從DOM中拔除時validator會報錯(validate unexisting field) -->
                <div
                  v-show="isEditing(column.id)"
                  class="edit-block"
                >
                  <div
                    v-for="(singleAlias, aliasIndex) in tempRowInfo.aliasList"
                    :key="column.id + '-' + aliasIndex"
                    class="edit-alias-input-list"
                  >
                    <input-verify
                      v-validate="`max:${max}`"
                      v-model="tempRowInfo.aliasList[aliasIndex].name"
                      :name="'alias' + '-' + column.id + '-' + aliasIndex"
                      :placeholder="$t('editing.dataFrameColumnAliasInputPlaceholder')"
                      class="edit-alias-input-block"
                    />
                    <div
                      class="link"
                      @click="removeAlias(aliasIndex)"
                    >
                      <svg-icon
                        icon-class="ban"
                      />
                    </div>
                  </div>
                  <button
                    class="btn-m btn-secondary btn-add"
                    @click="addAlias"
                  >
                    <svg-icon
                      icon-class="plus"
                      class="icon icon-plus"
                    />{{ $t('button.add') }}
                  </button>
                </div>
              </div>
              <div class="data-table-cell tag">
                <template v-if="tempRowInfo.dataColumnId === column.id">
                  <default-select
                    v-if="!column.isClustering"
                    v-model="tempRowInfo.columnStatsType"
                    :option-list="typeOptionList(column.statsTypeOptionList)"
                    :is-disabled="isTableGeneratedByFlow"
                    class="tag-select input"
                  />
                  <default-select
                    v-if="tempRowInfo.columnStatsType === 'NUMERIC'"
                    v-model="tempRowInfo.isOrdinal"
                    :option-list="ordinalOptionList"
                    class="tag-select input"
                  />
                </template>
                <span
                  v-else
                >{{ column.statsType + getColumnOrdinalState(column) }}</span>
              </div>
              <div class="data-table-cell created-method">
                <span>{{ column.createdMethod }}</span>
              </div>
              <div class="data-table-cell action">
                <template v-if="tempRowInfo.dataColumnId !== column.id">
                  <a
                    class="link action-link"
                    href="javascript:void(0)"
                    @click="edit(column)"
                  >{{ $t('button.edit') }}</a>
                  <!--分群欄位才可刪除-->
                  <a
                    v-if="column.isClustering"
                    class="link action-link"
                    href="javascript:void(0)"
                    @click="confirmDelete(column)"
                  >{{ $t('button.delete') }}</a>
                </template>
                <template v-else>
                  <el-tooltip
                    :enterable="false"
                    :visible-arrow="false"
                    :content="$t('button.save')"
                    placement="bottom"
                  >
                    <div
                      class="svg-wrapper"
                      @click="saveAlias(index)"
                    >
                      <svg-icon
                        icon-class="save"
                      />
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    :enterable="false"
                    :visible-arrow="false"
                    :content="$t('button.cancel')"
                    placement="bottom"
                  >
                    <div
                      class="svg-wrapper"
                      @click="cancel"
                    >
                      <svg-icon
                        icon-class="close"
                        class="icon-close"
                      />
                    </div>
                  </el-tooltip>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <decide-dialog
        v-if="showConfirmDeleteDialog"
        :title="$t('editing.confirmDeleteColumnText')"
        :type="'delete'"
        :is-processing="isProcessing"
        @closeDialog="closeDeleteDialog"
        @confirmBtn="deleteColumn"
      />
    </div>
  </div>
</template>
<script>
import { patchColumnAlias } from '@/API/Alias'
import {
  getDataFrameColumnInfoById,
  updateDataFrameAlias,
  patchDataColumnPrimaryAlias,
  deleteDataColumnById,
  updateColumnOrdinality
} from '@/API/DataSource'
import DefaultSelect from '@/components/select/DefaultSelect'
import DecideDialog from '@/components/dialog/DecideDialog'
import { Message } from 'element-ui'
import { fetchPrimaryAliasTemplate, updatePrimaryAliasTemplate } from '@/API/AutomationScript'
import InputVerify from '@/components/InputVerify'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'EditColumnDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputVerify,
    DecideDialog
  },
  props: {
    tableInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      columnList: [],
      tableId: this.tableInfo.id,
      // 目前選定的欄位
      currentSelectColumn: null,
      // 目前編輯的欄位資訊
      tempRowInfo: {
        primaryAlias: null,
        dataColumnId: null,
        aliasList: [],
        columnStatsType: null,
        isClustering: null,
        isOrdinal: false
      },
      userEditInfo: {
        dataFrameId: this.tableInfo.id,
        dataSourceId: this.tableInfo.dataSourceId,
        userEditedColumnInputList: []
      },
      isLoading: false,
      isLoadingPrimaryAliasTemplate: false,
      isUploadingPrimaryAliasTemplate: false,
      isProcessing: false,
      showConfirmDeleteDialog: false,
      primaryAliasTemplateInput: null,
      isUploadPopoverVisible: false
    }
  },
  computed: {
    ...mapGetters('dataSource', ['currentDataFrameId']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    ...mapState('dataFrameAdvanceSetting', ['isInit']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    isJoinTable () {
      return this.columnList.some(element => element.parentDataFrameAlias)
    },
    ordinalOptionList () {
      const isOrdinalOptions = [true, false]
      return isOrdinalOptions.map(isOrdinal => ({
        name: isOrdinal ? this.$t('editing.isOrdinal') : this.$t('editing.isNotOrdinal'),
        value: isOrdinal
      }))
    },
    isTableGeneratedByFlow () {
      // script 產生的表，不允許改變欄位型別
      return this.tableInfo.name.startsWith('sc_')
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getDataFrameColumnInfoById(this.tableId, true, false).then(response => {
        response.forEach((element, index) => {
          element.aliasList = element.aliasList.map(alias => {
            return {
              name: alias,
              isModified: false
            }
          })
          element.name = {
            primaryAlias: element.name,
            isModified: false
          }

          if (element.isClustering) {
            element.createdMethod = this.$t('editing.tagColumn')
          } else if (element.isFeature) {
            element.createdMethod = this.$t('editing.featureColumn')
          } else {
            element.createdMethod = this.$t('editing.originalField')
          }
        })
        this.columnList = response
      }).finally(() => { this.isLoading = false })
    },
    // 依據 type 決定選單選項
    typeOptionList (optionList) {
      return optionList.map(option => {
        return {
          name: option,
          value: option
        }
      })
    },
    closeDialog () {
      this.$emit('close')
    },
    edit (columnInfo) {
      this.tempRowInfo.primaryAlias = columnInfo.name.primaryAlias
      this.tempRowInfo.dataColumnId = columnInfo.id
      this.tempRowInfo.aliasList = JSON.parse(JSON.stringify(columnInfo.aliasList))
      this.tempRowInfo.columnStatsType = JSON.parse(JSON.stringify(columnInfo.statsType))
      this.tempRowInfo.isClustering = columnInfo.isClustering
      this.tempRowInfo.isOrdinal = columnInfo.isOrdinal
    },
    buildAlias () {
      this.isProcessing = true
      let filterList = this.columnList.map(element => {
        return {
          dataColumnId: element.id,
          dataValue: element.name.primaryAlias,
          alias: element.aliasList.map(dataValue => dataValue.name)
        }
      })
      const modifiedPrimaryAliases = this.columnList
        .filter(column => column.name.isModified)
        .map(column => ({ id: column.id, primaryAlias: column.name.primaryAlias }))

      const aliasPromise = patchColumnAlias(filterList)
      const promises = [aliasPromise]
      // 更新標籤時，需要排除分群欄位
      const filteredUserEditInfo = {
        ...this.userEditInfo,
        userEditedColumnInputList: this.userEditInfo.userEditedColumnInputList.filter(column => !column.isClustering)
      }
      if (filteredUserEditInfo.userEditedColumnInputList.length > 0) {
        promises.push(updateDataFrameAlias(filteredUserEditInfo))

        // Numeric 欄位設定時序
        const numericColumnList = filteredUserEditInfo.userEditedColumnInputList.filter(column => column.columnStatsType === 'NUMERIC')
        numericColumnList.length > 0 && promises.push(updateColumnOrdinality(numericColumnList.map(column => ({
          id: column.dataColumnId,
          isOrdinal: column.isOrdinal
        }))))
      }

      if (modifiedPrimaryAliases.length > 0) {
        promises.push(patchDataColumnPrimaryAlias(modifiedPrimaryAliases))
      }
      Promise.all(promises)
        .then(() => {
          this.closeDialog()
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        }).catch(() => {
          this.cancel()
        })
    },
    saveAlias (index) {
      this.$validator.validateAll().then((isValidate) => {
        if (!isValidate) return

        if (this.isProcessing) return

        if (this.tempRowInfo.primaryAlias !== this.columnList[index].name.primaryAlias) {
          this.columnList[index].name.isModified = true
          this.columnList[index].name.primaryAlias = this.tempRowInfo.primaryAlias
        }

        this.tempRowInfo.aliasList = this.tempRowInfo.aliasList.reduce((result, element) => {
          // 過濾掉空字串
          if (element.name === null || element.name === '') return result
          if (element.isModified) return result.concat(element)
          // 比較編輯前後是否有差異
          return result.concat({
            ...element,
            isModified: this.columnList[index].aliasList.findIndex(item => item.name === element.name) < 0
          })
        }, [])

        // 將 temp 資料塞回去
        this.columnList[index].aliasList = this.tempRowInfo.aliasList
        this.columnList[index].statsType = this.tempRowInfo.columnStatsType
        this.columnList[index].isOrdinal = this.tempRowInfo.isOrdinal

        // 目前的 id 是否已經存在
        let hasId = false
        this.userEditInfo.userEditedColumnInputList.forEach(element => {
          if (element.dataColumnId === this.tempRowInfo.dataColumnId) {
            element.columnStatsType = this.tempRowInfo.columnStatsType
            hasId = true
          }
        })
        if (!hasId) {
          this.userEditInfo.userEditedColumnInputList.push(this.tempRowInfo)
        }

        this.cancel()
      })
    },
    cancel () {
      this.tempRowInfo = {
        primaryAlias: null,
        dataColumnId: null,
        aliasList: null,
        columnStatsType: null,
        isClustering: null,
        isOrdinal: false
      }
      this.isProcessing = false
    },
    isEditing (id) {
      return this.tempRowInfo.dataColumnId === id
    },
    addAlias () {
      this.tempRowInfo.aliasList.push({
        name: null,
        isModified: true
      })
    },
    removeAlias (index) {
      this.tempRowInfo.aliasList.splice(index, 1)
    },
    confirmDelete (column) {
      this.currentSelectColumn = column
      this.showConfirmDeleteDialog = true
    },
    closeDeleteDialog () {
      this.currentSelectColumn = null
      this.showConfirmDeleteDialog = false
    },
    deleteColumn () {
      this.isProcessing = true
      deleteDataColumnById(this.currentSelectColumn.id)
        .then(() => {
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.closeDeleteDialog()
          this.fetchData()
          // 若基表設定已儲存同張表的欄位，要重新init以取得新欄位列表
          if (this.currentDataFrameId === this.tableId && this.isInit) {
            this.$store.commit('dataFrameAdvanceSetting/toggleIsInit', false)
            this.$store.commit('dataFrameAdvanceSetting/setShouldAdvanceDataFrameSettingRefetchDataColumn', true)
          }
        })
        .finally(() => { this.isProcessing = false })
    },
    getPrimaryAliasTemplate () {
      this.isLoadingPrimaryAliasTemplate = true
      fetchPrimaryAliasTemplate(this.tableId)
        .then(({ data }) => {
          const blob = new Blob([data], { type: 'application/vnd.ms-excel;' })
          if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, this.tableInfo.primaryAlias)
          } else {
            const link = document.createElement('a')
            if (link.download !== undefined) {
              // Browsers that support HTML5 download attribute
              const url = URL.createObjectURL(blob)
              link.setAttribute('href', url)
              link.setAttribute('download', `${this.tableInfo.primaryAlias}_${this.$t('editing.columnAliasTemplate')}.xlsx`)
              link.style.visibility = 'hidden'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }
          }
        })
        .catch(error => {})
        .finally(() => {
          this.isLoadingPrimaryAliasTemplate = false
        })
    },
    onInputPrimaryAliasTemplate (file) {
      if (file) this.primaryAliasTemplateInput = file[0]
    },
    updatePrimaryAliasTemplate () {
      if (!this.primaryAliasTemplateInput) return

      this.isUploadingPrimaryAliasTemplate = true
      let formData = new FormData()
      formData.append('file', this.primaryAliasTemplateInput)
      formData.append('groupId', this.getCurrentGroupId)
      updatePrimaryAliasTemplate(formData, this.tableId)
        .then(res => {
          Message({
            message: this.$t('editing.uploadSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.fetchData()
        })
        .catch(() => {})
        .finally(() => {
          this.primaryAliasTemplateInput = null
          this.isUploadingPrimaryAliasTemplate = false
          this.isUploadPopoverVisible = false
        })
    },
    onCancelUploadPrimaryAliasTemplate () {
      this.isUploadPopoverVisible = false
      this.primaryAliasTemplateInput = null
    },
    getColumnOrdinalState (column) {
      if (column.statsType !== 'NUMERIC') return ''
      return `(${column.isOrdinal ? this.$t('editing.isOrdinal') : this.$t('editing.isNotOrdinal')})`
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-column-dialog {
  .dialog-header-block {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    line-height: 30px;
    margin-bottom: 12px;

    .data-frame-name {
      @include text-hidden
    ;

      font-size: 14px;
    }

    .remark-text {
      color: $theme-color-warning;
      font-size: 14px;
      margin-right: 12px;
    }
  }

  .edit-table-block {
    margin-bottom: 32px;

    .data-table-row {
      align-items: flex-start;

      .is-modified,
      .name-info-icon {
        color: $theme-color-warning;
      }
    }
  }

  .name {
    color: #ddd;
    width: 22%;
  }

  .source {
    width: 22%;
  }

  .alias {
    color: #ddd;
    width: 21%;

    .alias__item {
      display: inline;
    }
  }

  .tag {
    color: #ddd;
    width: 18%;
  }

  .action {
    width: 17%;
  }

  .alias-input {
    margin-right: 12px;
    width: 105px;
  }

  .edit-block {
    display: flex;
    flex-direction: column;

    .link {
      align-self: center;
    }

    .btn-add {
      width: 80px;

      .icon-plus {
        font-size: 13px;
      }
    }
  }

  .edit-alias-input-list {
    display: flex;

    .link {
      height: 32px;
    }
  }

  .edit-alias-input-block {
    height: 32px;
    margin-right: 12px;
    width: 105px;

    ::v-deep .input-verify-text {
      color: $theme-text-color;
      height: 32px;
    }

    ::v-deep .input-error {
      bottom: -18px;
    }

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .btn-add {
    .icon {
      margin-right: 5px;
    }
  }
}

.tooltip-container {
  .tooltip {
    color: #ddd;
    line-height: 14px;
    padding: 8px 12px;
    white-space: normal;
    width: 212px;
  }

  .icon {
    color: $theme-color-warning;
  }
}

.svg-wrapper + .svg-wrapper {
  margin-left: 20px;
}

.svg-icon {
  color: $theme-color-primary;
  cursor: pointer;
  font-size: 18px;
  position: relative;

  &.icon-close {
    font-size: 16px;
    margin-top: 1px;
    position: relative;
  }
}
</style>
<style lang="scss">
.tag-select.el-select {
  .el-input__inner {
    font-size: 14px;
    height: 32px;
    letter-spacing: 0.5px;
    line-height: 24px;
    padding-left: 0;
  }

  .el-input__icon {
    line-height: 24px;
  }

  &:not(:last-of-type) {
    margin-bottom: 14px;
  }
}
</style>
