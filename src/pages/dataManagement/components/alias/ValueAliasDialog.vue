<template>
  <div class="value-alias-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.dataColumnValue') }}
        <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="dialog-header-block">
        <div class="data-frame-name">{{ $t('editing.dataFrame') }}：{{ dataFrameInfo.primaryAlias }}</div>
        <div class="button-block">
          <span class="remark-text">{{ $t('editing.rebuildRemark') }}</span>
          <button type="button" class="btn btn-default"
            @click="buildAlias"
          >{{ $t('button.build') }}</button>
        </div>
      </div>
      <div class="dialog-content-block">
        <div class="data-column-block">
          <div class="data-column-row block-title">{{ $t('editing.columnName') }}</div>
          <div class="data-column-block-body">
            <div class="data-column-row"
              v-for="column in dataColumnListInfo"
              :key="column.dataColumnId"
              :class="{active: currentColumnInfo.dataColumnId === column.dataColumnId}"
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
              <div class="data-table-row"
                v-for="(valueInfo, index) in currentColumnInfo.aliasList"
                :key="index"
              >
                <div class="data-table-cell data-value">{{ valueInfo.dataValue }}</div>
                <div class="data-table-cell alias">
                  <div class="edit-block"
                    v-if="currentEditValueIndex === index"
                  >
                    <div class="input-block edit-alias-input-block"
                      v-for="(singleAlias, aliasIndex) in tempAliasInfo"
                      :key="index + '-' + aliasIndex"
                    >
                      <input type="text" class="input"
                        v-model="singleAlias.name"
                      >
                      <div class="link"
                        @click="removeAlias(aliasIndex)"
                      >{{ $t('button.remove') }}</div>
                    </div>
                    <button class="btn-m btn-secondary btn-add"
                      @click="addAlias"
                    >
                      <svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.add') }}
                    </button>
                  </div>
                  <div class="display-block"
                    v-else
                  >
                    <div class="alias"
                      :class="{'is-modified': singleAlias.isModified}"
                      v-for="(singleAlias, aliasIndex) in valueInfo.alias"
                      :key="index + '-' + aliasIndex"
                    >{{ singleAlias.name }}<span v-show="aliasIndex !== valueInfo.alias.length - 1">,</span></div>
                    <div class="not-set"
                      v-show="valueInfo.alias.length === 0"
                    >{{ $t('editing.notSet') }}</div>
                  </div>
                </div>
                <div class="data-table-cell action">
                  <a href="javascript:void(0);" class="link action-link"
                    v-if="currentEditValueIndex !== index"
                    @click="editValueAlias(index)"
                  >{{ $t('button.edit') }}</a>
                  <template
                    v-else
                  >
                    <a href="javascript:void(0);" class="link action-link"
                      @click="saveAlias(index)"
                    >{{ $t('button.save') }}</a>
                    <a href="javascript:void(0);" class="link action-link"
                      @click="cancelEditAlias"
                    >{{ $t('button.cancel') }}</a>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataColumnDataValue } from '@/API/DataSource'
import { getValueAlias, saveValueAlias } from '@/API/Alias'

export default {
  name: 'ValueAliasDialog',
  props: {
    dataFrameInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dataColumnListInfo: [
        {
          dataColumnId: 2,
          primaryAlias: '產品',
          dataValue: [
            'test1',
            'test2',
            'test3'
          ]
        },
        {
          dataColumnId: 3,
          primaryAlias: '國家',
          dataValue: [
            '中國',
            '美國',
            '日本'
          ]
        }
      ],
      columnList: [],
      valueAliasList: [
        {
          dataColumnId: 1234,
          dataValue: 'test',
          alias: [
            {
              name: '測試1',
              isModified: false
            },
            {
              name: '測試2',
              isModified: false
            }
          ],
          isSaved: false
        },
        {
          dataColumnId: 1234,
          dataValue: '美國',
          alias: [
            {
              name: '米國',
              isModified: false
            },
            {
              name: '米鍋',
              isModified: false
            }
          ],
          isSaved: false
        },
        {
          dataColumnId: 1234,
          dataValue: '美美',
          alias: [
            {
              name: '米米',
              isModified: false
            },
            {
              name: '妹妹',
              isModified: false
            },
            {
              name: '秘密',
              isModified: true
            }
          ],
          isSaved: false
        },
        {
          dataColumnId: 1234,
          dataValue: '登登',
          alias: []
        }
      ],
      currentColumnInfo: {
        id: 31042,
        primaryAlias: '測試欄位'
      },
      currentEditValueIndex: null,
      tempAliasInfo: [],
      aliasConfig: {
        name: null,
        isModified: true
      }
    }
  },
  mounted () {
    this.fetchColumnInfo()
  },
  methods: {
    fetchColumnInfo () {
      getDataColumnDataValue(this.dataFrameInfo.id).then(response => {
        console.log(response, 'data column & data value')
        this.dataColumnListInfo = response

        // 取第一個 column 作為預測顯示
        this.setColumnInfo(response[0])
      })
    },
    setColumnInfo (columnInfo) {
      this.currentColumnInfo = columnInfo
      // 是否已經拿過 alias 資料
      if (this.currentColumnInfo.aliasList) return
      // 取得該 column 的 alias
      getValueAlias(columnInfo.dataColumnId).then(response => {
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
      })
    },
    setCurrentColumn (columnInfo) {
      this.setColumnInfo(columnInfo)
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
    },
    cancelEditAlias () {
      this.currentEditValueIndex = null
      this.tempAliasInfo = null
    },
    saveAlias (index) {
      // 比較編輯前後是否有差異
      this.tempAliasInfo.forEach(element => {
        if (!element.isModified) {
          element.isModified = this.currentColumnInfo.aliasList[index].alias.findIndex(item => item.name === element.name) < 0
        }
      })
      // 過濾掉空字串
      this.tempAliasInfo = this.tempAliasInfo.filter(element => element.name !== null && element.name !== '')

      this.currentColumnInfo.aliasList[index].alias = this.tempAliasInfo
      this.currentColumnInfo.aliasList[index].isSaved = true

      this.cancelEditAlias()
    },
    buildAlias () {
      let aliasInfo = this.dataColumnListInfo.reduce((acc, cur) => {
        if (!cur.aliasList) return acc
        let modifiedAlias = cur.aliasList.filter(element => element.isSaved)
        if (modifiedAlias) {
          modifiedAlias = modifiedAlias.map(element => {
            return {
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
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.value-alias-dialog {
  .dialog-title {
    position: relative;

    .close-btn {
      position: absolute;
      top: 0;
      right: 0;
      color: #fff;
      font-size: 14px;
    }
  }

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
          color: #FFDF6F;
        }
      }
      .not-set {
        color: #888;
      }
    }

    .edit-alias-input-block {
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin-bottom: 12px;
      }

      .input {
        width: 105px;
        margin-right: 12px;
        padding-bottom: 0;
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
}
</style>
