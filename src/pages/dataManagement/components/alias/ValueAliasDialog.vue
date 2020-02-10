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
        <div class="data-frame-name">{{ $t('editing.dataFrame') }}：xxx</div>
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
              v-for="i in 20"
              :key="i"
            >test {{i}}</div>
          </div>
        </div>
        <div class="data-value-block">
          <div class="block-title">{{ $t('editing.columnName') }}：XXX</div>
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
                v-for="i in 20"
                :key="i"
              >
                <div class="data-table-cell data-value">test {{i}}</div>
                <div class="data-table-cell alias">
                  <div class="edit-block">
                    <div class="input-block edit-alias-input-block">
                      <input type="text" class="input">
                      <div class="link">{{ $t('button.remove') }}</div>
                    </div>
                    <div class="input-block edit-alias-input-block">
                      <input type="text" class="input">
                      <div class="link">{{ $t('button.remove') }}</div>
                    </div>
                    <button class="btn btn-secondary">
                      <svg-icon icon-class="plus"></svg-icon>{{ $t('button.add') }}
                    </button>
                  </div>
                </div>
                <div class="data-table-cell action">
                  <a href="javascript:void(0);" class="link action-link">{{ $t('button.edit') }}</a>
                  <a href="javascript:void(0);" class="link action-link">{{ $t('button.save') }}</a>
                  <a href="javascript:void(0);" class="link action-link">{{ $t('button.cancel') }}</a>
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
export default {
  name: 'ValueAliasDialog',
  methods: {
    closeDialog () {

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
          cursor: pointer;

          &:hover {
            background-color: #2AD2E2;
            color: #fff;

            &:after {
              content: "";
              display: block;

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
          width: 48.2%;
        }
        &.action {
          flex: 1;
        }
      }
    }

    .edit-alias-input-block {
      display: flex;
      align-items: center;

      .input {
        width: 105px;
        margin-right: 12px;
      }
    }
  }
}
</style>
