<template>
  <div class="edit-column-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">{{ $t('editing.dataColumn') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
      </div>
      <div class="dialog-header-block">
        <el-tooltip 
          :content="tableInfo.primaryAlias"
          placement="bottom">
          <div class="data-frame-name">{{ $t('editing.dataFrame') }}：{{ tableInfo.primaryAlias }}</div>
        </el-tooltip>
        <div
          v-if="userEditInfo.userEditedColumnInputList.length > 0"
          class="button-block"
        >
          <span class="remark-text">{{ $t('editing.rebuildRemark') }}</span>
          <button 
            :disabled="isProcessing"
            class="btn-m btn-default"
            @click="buildAlias"
          >{{ $t('button.build') }}</button>
        </div>
      </div>
      <div class="edit-table-block">
        <div class="data-table">
          <div class="data-table-head is-scrolling">
            <div class="data-table-row table-head">
              <div class="data-table-cell name">{{ $t('editing.columnName') }}</div>
              <div 
                v-if="isJoinTable"
                class="data-table-cell source"
              >
                {{ $t('editing.columnSource') }}
                <span class="nav-item nav-function tooltip-container">
                  <svg-icon 
                    icon-class="information-circle" 
                    class="icon" />
                  <div class="tooltip">{{ $t('editing.columnSourceRemind') }}</div>
                </span>
              </div>
              <div class="data-table-cell alias">{{ $t('editing.alias') }}</div>
              <div class="data-table-cell tag">{{ $t('editing.columnTag') }}</div>
              <div class="data-table-cell created-method">{{ $t('editing.createdMethod') }}</div>
              <div class="data-table-cell action">{{ $t('editing.action') }}</div>
            </div>
          </div>
          <div 
            ref="dataTableBody" 
            class="data-table-body">
            <spinner v-if="isLoading" />
            <div
              v-for="(column, index) in columnList"
              v-else
              :key="column.id"
              class="data-table-row"
            >
              <div class="data-table-cell name">
                <span
                  v-show="!isEditing(column.id)"
                  :class="{'is-modified': column.name.isModified}"
                >{{ column.name.primaryAlias }}</span>
                <input-verify
                  v-validate="'required'"
                  v-show="isEditing(column.id)"
                  v-model="tempRowInfo.primaryAlias"
                  :name="'name-' + column.id"
                  class="edit-alias-input-block"
                />
              </div>
              <div 
                v-if="isJoinTable"
                class="data-table-cell source"
              >{{ column.parentDataFrameAlias || '-' }}</div>
              <div class="data-table-cell alias">
                <span v-show="!isEditing(column.id) && column.aliasList.length === 0"> - </span>
                <div 
                  v-for="(singleAlias, aliasIndex) in column.aliasList"
                  v-show="!isEditing(column.id)"
                  :class="{'is-modified': singleAlias.isModified}"
                  :key="column.id + '-' + aliasIndex"
                  class="alias__item"
                >{{ singleAlias.name }}<span v-show="aliasIndex !== column.aliasList.length - 1">, </span></div>
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
                        icon-class="ban" />
                    </div>
                  </div>
                  <button 
                    class="btn-m btn-secondary btn-add"
                    @click="addAlias"
                  >
                    <svg-icon 
                      icon-class="plus" 
                      class="icon icon-plus"/>{{ $t('button.add') }}
                  </button>
                </div>
              </div>
              <div class="data-table-cell tag">
                <default-select 
                  v-if="tempRowInfo.dataColumnId === column.id && !column.isClustering"
                  v-model="tempRowInfo.columnStatsType"
                  :option-list="typeOptionList(column.statsTypeOptionList)"
                  class="tag-select input"
                />
                <span
                  v-else
                >{{ column.statsType }}</span>
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
                      @click="saveAlias(index)">
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
                      @click="cancel">
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
        :title="this.$t('editing.confirmDeleteColumnText')"
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
  deleteDataColumnById
} from '@/API/DataSource'
import DefaultSelect from '@/components/select/DefaultSelect'
import DecideDialog from '@/components/dialog/DecideDialog'
import { Message } from 'element-ui'
import InputVerify from '@/components/InputVerify'
import { mapGetters } from 'vuex'

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
        isClustering: null
      },
      userEditInfo: {
        dataFrameId: this.tableInfo.id,
        dataSourceId: this.tableInfo.dataSourceId,
        userEditedColumnInputList: []
      },
      isLoading: false,
      isProcessing: false,
      showConfirmDeleteDialog: false
    }
  },
  computed: {
    ...mapGetters('dataSource', ['currentDataFrameId']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    isJoinTable () {
      return this.columnList.some(element => element.parentDataFrameAlias)
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
      if (filteredUserEditInfo.userEditedColumnInputList.length > 0){
        promises.push(updateDataFrameAlias(filteredUserEditInfo))
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
        columnStatsType: null
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
          if (this.currentDataFrameId === this.tableId) {
            this.$store.commit('dataFrameAdvanceSetting/toggleIsInit', false)
            this.$store.commit('dataSource/setShouldAdvanceDataFrameSettingRefetchDataColumn', true)
          }
        })
        .finally(() => { this.isProcessing = false })
    }
  },
}
</script>
<style lang="scss" scoped>
.edit-column-dialog {
  .dialog-header-block {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    line-height: 30px;

    .data-frame-name {
      font-size: 14px;
      @include text-hidden
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
      .is-modified {
        color: $theme-color-warning;
      }
    }
  }
  .name {
    width: 22%;
    color: #DDDDDD;
  }
  .source {
    width: 22%;
  }
  .alias {
    width: 21%;
    color: #DDDDDD;

    .alias__item {
      display: inline;
    }
  }
  .tag {
    width: 18%;
    color: #DDDDDD;
  }
  .action {
    width: 17%;
  }

  .alias-input {
    width: 105px;
    margin-right: 12px;
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
    width: 105px;
    height: 32px;
    margin-right: 12px;

    /deep/ .input-verify-text {
      height: 32px;
      color: $theme-text-color;
    }

    /deep/ .input-error  {
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
    width: 212px;
    white-space: normal;
    padding: 8px 12px;
    line-height: 14px;
    color: #DDDDDD;
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
    height: 32px;
    line-height: 24px;
    font-size: 14px;
    padding-left: 0;
    letter-spacing: 0.5px;
  }
  .el-input__icon {
    line-height: 24px;
  }
}
</style>
