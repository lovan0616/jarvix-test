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
              <div class="data-table-cell action">{{ $t('editing.action') }}</div>
            </div>
          </div>
          <div 
            ref="dataTableBody" 
            class="data-table-body">
            <div 
              v-for="(column, index) in columnList"
              :key="column.id"
              class="data-table-row"
            >
              <div class="data-table-cell name">{{ column.name }}</div>
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
                      :placeholder="$t('editing.dataFrameInputPlaceholder')"
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
                <span
                  v-if="tempRowInfo.dataColumnId !== column.id"
                >{{ column.statsType }}</span>
                <default-select 
                  v-else
                  v-model="tempRowInfo.columnStatsType"
                  :option-list="typeOptionList(column.statsTypeOptionList)"
                  class="tag-select input"
                />
              </div>
              <div class="data-table-cell action">
                <a 
                  v-if="tempRowInfo.dataColumnId !== column.id" 
                  class="link action-link"
                  href="javascript:void(0)"
                  @click="edit(column)"
                >{{ $t('button.edit') }}</a>
                <el-tooltip
                  v-if="tempRowInfo.dataColumnId === column.id"
                  :enterable="false"
                  :visible-arrow="false"
                  :content="$t('button.save')"
                  placement="bottom"
                >
                  <svg-icon
                    icon-class="save"
                    @click.native="saveAlias(index)" />
                </el-tooltip>
                <el-tooltip
                  v-if="tempRowInfo.dataColumnId === column.id"
                  :enterable="false"
                  :visible-arrow="false"
                  :content="$t('button.cancel')"
                  placement="bottom"
                >
                  <svg-icon
                    icon-class="close"
                    class="icon-close"
                    @click.native="cancel"/>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataFrameColumnInfoById } from '@/API/DataSource'
import { patchColumnAlias } from '@/API/Alias'
import { updateDataFrameAlias } from '@/API/DataSource.js'
import DefaultSelect from '@/components/select/DefaultSelect'
import { Message } from 'element-ui'
import InputVerify from '@/components/InputVerify'

export default {
  name: 'EditColumnDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputVerify
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
      // 目前編輯的欄位
      currentEditColumn: null,
      // 目前編輯的欄位資訊
      tempRowInfo: {
        dataColumnId: null,
        aliasList: [],
        columnStatsType: null
      },
      userEditInfo: {
        dataFrameId: this.tableInfo.id,
        dataSourceId: this.tableInfo.dataSourceId,
        userEditedColumnInputList: []
      },
      isProcessing: false
    }
  },
  computed: {
    currentBookmarkInfo () {
      return this.$store.state.dataManagement.currentBookmarkInfo
    },
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
      getDataFrameColumnInfoById(this.tableId, true, false).then(response => {
        response.forEach((element, index) => {
          element.aliasList = element.aliasList.map(alias => {
            return {
              name: alias,
              isModified: false
            }
          })
        })
        this.columnList = response
      })
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
      this.tempRowInfo.dataColumnId = columnInfo.id
      this.tempRowInfo.aliasList = JSON.parse(JSON.stringify(columnInfo.aliasList))
      this.tempRowInfo.columnStatsType = JSON.parse(JSON.stringify(columnInfo.statsType))
    },
    buildAlias () {
      this.isProcessing = true
      let filterList = this.columnList.map(element => {
        return {
          dataColumnId: element.id,
          dataValue: element.name,
          alias: element.aliasList.map(dataValue => dataValue.name)
        }
      })

      const aliasPromise = patchColumnAlias(filterList)
      const statsTypePromise = updateDataFrameAlias(this.userEditInfo)
      Promise.all([aliasPromise, statsTypePromise])
        .then(() => {
        // 更新問句說明資訊
          this.$store.dispatch('dataSource/getDataSourceColumnInfo')
          this.closeDialog()
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        }).catch(() => {
          this.cancel()
        })
    },
    saveAlias (index) {
      this.$validator.validateAll().then((isValidate) => {
        if (!isValidate) return

        if (this.isProcessing) return

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

      &.is-modified {
        color: $theme-color-warning;
      }
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
  & + .svg-icon {
    margin-left: 20px;
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
