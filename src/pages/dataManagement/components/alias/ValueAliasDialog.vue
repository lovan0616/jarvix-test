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
          <button type="button" class="btn btn-default">{{ $t('button.build') }}</button>
        </div>
      </div>
      <div class="dialog-content-block">
        <div class="data-column-block">
          <div class="data-column-row block-title">{{ $t('editing.columnName') }}</div>
          <div class="data-column-block-body">
            <div class="data-column-row"
              v-for="column in columnList"
              :key="column.id"
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
                v-for="(valueInfo, index) in valueAliasList"
                :key="index"
              >
                <div class="data-table-cell data-value">{{ valueInfo.dataValue }}</div>
                <div class="data-table-cell alias">
                  <div class="edit-block"
                    v-if="valueInfo.isEdit"
                  >
                    <div class="input-block edit-alias-input-block"
                      v-for="(singleAlias, aliasIndex) in tempAliasInfo"
                      :key="index + '-' + aliasIndex"
                    >
                      <input type="text" class="input"
                        v-model="singleAlias.name"
                      >
                      <div class="link">{{ $t('button.remove') }}</div>
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
                    v-if="!valueInfo.isEdit"
                    @click="editValueAlias(index)"
                  >{{ $t('button.edit') }}</a>
                  <template
                    v-else
                  >
                    <a href="javascript:void(0);" class="link action-link"
                    >{{ $t('button.save') }}</a>
                    <a href="javascript:void(0);" class="link action-link"
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
import { setDataAlias, getDataFrameColumnInfoById } from '@/API/DataSource'

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
      columnList: [],
      valueAliasList: [
        {
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
          isEdit: false
        },
        {
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
          isEdit: false
        },
        {
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
          isEdit: false
        },
        {
          dataValue: '登登',
          alias: [],
          isEdit: false
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
      getDataFrameColumnInfoById(this.dataFrameInfo.id).then(response => {
        this.columnList = response

        // 取第一個 column 作為預測顯示
      })
    },
    fetchValueInfo (id) {
    },
    editValueAlias (index) {
      if (this.currentEditValueIndex !== null) {
        this.valueAliasList[this.currentEditValueIndex].isEdit = false
      }
      this.currentEditValueIndex = index
      this.tempAliasInfo = this.valueAliasList[index].alias
      this.valueAliasList[index].isEdit = true
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
