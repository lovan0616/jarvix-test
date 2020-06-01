<template>
  <div class="value-alias-dialog full-page-dialog">
    <spinner 
      v-if="isSaving || isLoading"
      :title="$t('editing.isSaving')"
      class="layout-spinner"
      size="50"
    />
    <div 
      v-else
      class="dialog-container"
    >
      <div class="dialog-title">
        {{ $t('editing.dataColumnValue') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
      </div>
      <template v-if="dataColumnListInfo.length > 0">
        <div class="dialog-header-block">
          <div class="data-frame-name">{{ $t('editing.dataFrame') }}：{{ dataFrameInfo.primaryAlias }}</div>
          <div class="button-block">
            <span class="remark-text">{{ $t('editing.rebuildRemark') }}</span>
            <button 
              type="button" 
              class="btn-m btn-default"
              @click="buildAlias"
            >{{ $t('button.build') }}</button>
          </div>
        </div>
        <div class="dialog-content-block">
          <div class="data-column-block">
            <div class="data-column-row block-title">{{ $t('editing.columnName') }}</div>
            <div class="data-column-block-body">
              <div 
                v-for="column in dataColumnListInfo"
                :key="column.dataColumnId"
                :class="{active: currentColumnInfo.dataColumnId === column.dataColumnId}"
                class="data-column-row"
                @click="setCurrentColumn(column)"
              >{{ column.primaryAlias }}</div>
            </div>
          </div>
          <div class="data-value-block">
            <div class="block-title">{{ $t('editing.columnName') }}：{{ currentColumnInfo.primaryAlias }}</div>
            <div class="data-value-table data-table">
              <div class="data-table-head is-scrolling">
                <div class="data-table-row table-head">
                  <div class="data-table-cell data-value">{{ $t('editing.dataValue') }}</div>
                  <div class="data-table-cell alias">{{ $t('editing.alias') }}</div>
                  <div class="data-table-cell action">{{ $t('editing.action') }}</div>
                </div>
              </div>
              <div class="data-table-body">
                <div 
                  v-for="(valueInfo, index) in currentColumnInfo.aliasList"
                  :key="index"
                  class="data-table-row"
                >
                  <div class="data-table-cell data-value">{{ valueInfo.dataValue }}</div>
                  <div class="data-table-cell alias">
                    <div 
                      v-if="currentEditValueIndex === index"
                      class="edit-block"
                    >
                      <div 
                        v-for="(singleAlias, aliasIndex) in tempAliasInfo"
                        :key="index + '-' + aliasIndex"
                        class="edit-alias-input-block"
                      >
                        <data-input-verify
                          v-validate="`letterSpace|max:${max}`"
                          v-model="singleAlias.name"
                          :name="index + '-' + aliasIndex"
                          :placeholder="$t('editing.pleaseEnterName')"
                          type="text"
                          class="input-verify"
                        />
                        <div 
                          class="link"
                          @click="removeAlias(aliasIndex)"
                        >{{ $t('button.remove') }}</div>
                      </div>
                      <button 
                        class="btn-m btn-secondary btn-add"
                        @click="addAlias"
                      >
                        <svg-icon 
                          icon-class="plus" 
                          class="icon"/>{{ $t('button.add') }}
                      </button>
                    </div>
                    <div 
                      v-else
                      class="display-block"
                    >
                      <div 
                        v-for="(singleAlias, aliasIndex) in valueInfo.alias"
                        :class="{'is-modified': singleAlias.isModified}"
                        :key="index + '-' + aliasIndex"
                        class="alias"
                      >{{ singleAlias.name }}<span v-show="aliasIndex !== valueInfo.alias.length - 1">,</span></div>
                      <div 
                        v-show="valueInfo.alias.length === 0"
                        class="not-set"
                      >{{ $t('editing.notSet') }}</div>
                    </div>
                  </div>
                  <div class="data-table-cell action">
                    <a 
                      v-if="currentEditValueIndex !== index" 
                      href="javascript:void(0);"
                      class="link action-link"
                      @click="editValueAlias(index)"
                    >{{ $t('button.edit') }}</a>
                    <template
                      v-else
                    >
                      <a 
                        href="javascript:void(0);" 
                        class="link action-link"
                        @click="saveAlias(index)"
                      >{{ $t('button.save') }}</a>
                      <a 
                        href="javascript:void(0);" 
                        class="link action-link"
                        @click="cancelEditAlias"
                      >{{ $t('button.cancel') }}</a>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="empty-info-block">
          <div>{{ $t('editing.emptyValueAlias') }}</div>
          <div>{{ '（' + $t('editing.emptyValueAliasDescription') + '）' }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getDataColumnDataValue } from '@/API/DataSource'
import { getValueAlias, saveValueAlias } from '@/API/Alias'
import { getSelfInfo } from '@/API/User'
import { Message } from 'element-ui'
import DataInputVerify from '../DataInputVerify'

export default {
  name: 'ValueAliasDialog',
  inject: ['$validator'],
  components: {
    DataInputVerify
  },
  props: {
    dataFrameInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dataColumnListInfo: [],
      currentColumnInfo: null,
      currentEditValueIndex: null,
      tempAliasInfo: [],
      aliasConfig: {
        name: null,
        isModified: true
      },
      userId: null,
      isSaving: false,
      isLoading: true
    }
  },
  computed: {
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  },
  mounted () {
    this.fetchColumnInfo()
    this.getSelfUserInfo()
  },
  methods: {
    getSelfUserInfo () {
      getSelfInfo()
        .then(response => {
          this.userId = response.id
          this.isLoading = false
        })
        .catch(() => { this.isLoading = false })
    },
    fetchColumnInfo () {
      getDataColumnDataValue(this.dataFrameInfo.id)
        .then(response => {
          this.dataColumnListInfo = response
          // handle empty data
          if (!this.dataColumnListInfo.length) {
            this.isLoading = false
            return
          }

          // 取第一個 column 作為預測顯示
          this.setColumnInfo(response[0])
        })
        .catch(() => { this.isLoading = false })
    },
    setColumnInfo (columnInfo) {
      this.currentColumnInfo = columnInfo
      // 是否已經拿過 alias 資料
      if (this.currentColumnInfo.aliasList) return
      // 取得該 column 的 alias
      getValueAlias(columnInfo.dataColumnId)
        .then(response => {
          if (response.length === 0) {
            this.$set(this.currentColumnInfo, 'aliasList', columnInfo.dataValue.map(dataValue => {
              return {
                dataValue,
                dataColumnId: this.currentColumnInfo.dataColumnId,
                alias: [],
                isSaved: false
              }
            }))
          } else {
            this.$set(this.currentColumnInfo, 'aliasList', columnInfo.dataValue.map(dataValue => {
              let dataValueInfo = response.find(element => element.dataValue === dataValue)
              if (dataValueInfo) {
                dataValueInfo = dataValueInfo.alias.map(element => {
                  return {
                    name: element,
                    isModified: false
                  }
                })
              } else {
                dataValueInfo = []
              }
              return {
                dataValue,
                dataColumnId: this.currentColumnInfo.dataColumnId,
                alias: dataValueInfo,
                isSaved: false
              }
            }))
          }
          this.isLoading = false
        })
        .catch(() => { this.isLoading = false })
    },
    setCurrentColumn (columnInfo) {
      this.setColumnInfo(columnInfo)
      this.cancelEditAlias()
    },
    editValueAlias (index) {
      this.currentEditValueIndex = index
      this.tempAliasInfo = JSON.parse(JSON.stringify(this.currentColumnInfo.aliasList[index].alias))
    },
    addAlias () {
      this.tempAliasInfo.push({
        name: null,
        isModified: true
      })
    },
    removeAlias (index) {
      this.tempAliasInfo.splice(index, 1)
      // 確保已經從 DOM 中移除欄位才能驗證到正確名稱的欄位
      this.$nextTick(() => {
        // 重新驗證所有欄位
        this.$validator.validateAll()
      })
    },
    cancelEditAlias () {
      this.currentEditValueIndex = null
      this.tempAliasInfo = null
    },
    saveAlias (index) {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.tempAliasInfo = this.tempAliasInfo.reduce((result, element) => {
          // 過濾掉空字串
          if (element.name === null || element.name === '') return result
          if (element.isModified) return result.concat(element)
          // 比較編輯前後是否有差異
          return result.concat({
            ...element,
            isModified: this.currentColumnInfo.aliasList[index].alias.findIndex(item => item.name === element.name) < 0
          })
        }, [])

        this.currentColumnInfo.aliasList[index].alias = this.tempAliasInfo
        this.currentColumnInfo.aliasList[index].isSaved = true

        this.cancelEditAlias()
      })
    },
    buildAlias () {
      this.isSaving = true
      let aliasInfo = this.dataColumnListInfo.reduce((acc, cur) => {
        if (!cur.aliasList) return acc
        let modifiedAlias = cur.aliasList.filter(element => element.isSaved)
        if (modifiedAlias) {
          modifiedAlias = modifiedAlias.map(element => {
            return {
              userId: this.userId,
              dataColumnId: element.dataColumnId,
              dataValue: element.dataValue,
              alias: element.alias.map(dataValue => dataValue.name)
            }
          })
        } else {
          modifiedAlias = []
        }
        return acc.concat(modifiedAlias)
      }, [])

      saveValueAlias(aliasInfo)
        .then(() => {
          this.isSaving = false
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
          // 更新問句說明資訊
          this.$store.dispatch('dataSource/getDataSourceDataValue')
          this.closeDialog()
        })
        .catch(() => { this.isSaving = false })
    },
    closeDialog () {
      this.$emit('close')
    }
  },
}
</script>
<style lang="scss" scoped>
.value-alias-dialog {
  .dialog-header-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .data-frame-name {
      font-size: 14px;
    }

    .remark-text {
      color: $theme-color-warning;
      font-size: 14px;
      margin-right: 12px;
    }
  }
  .dialog-content-block {
    display: flex;
    max-height: 70vh;

    .data-column-block {
      width: 23%;

      .data-column-block-body {
        max-height: calc(70vh - 40px);
        overflow: auto;

        .data-column-row {
          position: relative;
          cursor: pointer;

          &:hover, &.active {
            background-color: #2AD2E2;
            color: #fff;

            &:after {
              position: absolute;
              right: 0;
              top: calc(50% - 4px);
              content: "";
              display: block;
              width: 0;
              height: 0;
              border: 4px solid transparent;
              border-left-color: #fff;
            }
          }
        }
      }

      .data-column-row {
        padding: 8px 18px;
        color: #DDD;

        &.block-title {
          background-color: rgba(51, 51, 51, 0.6);
          color: #fff;
        }
      }
    }

    .data-value-block {
      width: 77%;
      border: 2px solid #2AD2E2;
      padding: 14px;

      .block-title {
        margin-bottom: 12px;
      }
    }

    .data-value-table.data-table {
      .data-table-body {
        max-height: calc(70vh - 120px);
      }
      .data-table-cell {
        padding: 10px 16px;

        &.data-value {
          flex: initial;
          width: 28.3%;
        }
        &.alias {
          flex: initial;
          width: 41.2%;
        }
        &.action {
          flex: 1;
        }
      }
    }

    .display-block {
      .alias {
        display: inline-block;

        &:not(:last-child) {
          margin-right: 4px;
        }
        &.is-modified {
          color: $theme-color-warning;
        }
      }
      .not-set {
        color: #888;
      }
    }

    .edit-alias-input-block {
      display: flex;
      align-items: flex-start;

      &:not(:last-child) {
        margin-bottom: 12px;
      }

      & >>> .input-verify {
        width: 105px;
        margin-right: 12px;
      }

      .link {
        line-height: 32px;
      }
    }

    .edit-block {
      .btn-add {

        .icon {
          margin-right: 5px;
        }
      }
    }
  }
  .empty-info-block {
    padding: 24px 0;
    background-color: rgba(29, 30, 30, 0.95);
    border-radius: 5px;
    text-align: center;
    color: #AAAAAA;
  }
}
</style>
