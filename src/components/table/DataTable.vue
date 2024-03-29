<template>
  <div class="data-table data-source-list-table">
    <div class="data-table-head">
      <div class="data-table-row table-head">
        <div
          v-if="hasCheckbox"
          class="data-table-cell checkbox"
        >
          <label
            :class="{indeterminate: selectList.length > 0 && selectList.length < dataList.length}"
            class="checkbox-label"
          >
            <input
              v-model="selectAll"
              :disabled="isProcessing"
              type="checkbox"
              name="selectAll"
            >
            <div class="checkbox-square" />
          </label>
        </div>
        <div
          v-for="headInfo in headers"
          :key="headInfo.value"
          :class="{sort: headInfo.sort, hasWidth: headInfo.width}"
          :style="{
            flex: `${headInfo.width ? 0 : 1} 0 ${headInfo.width}`,
            'text-align': headInfo.align
          }"
          class="data-table-cell"
          @click="(headInfo.sort) ? rankingData(headInfo.value) : ''"
        >
          {{ headInfo.text }}
          <svg-icon
            v-if="headInfo.sort && sortStatus"
            :class="{ 'arrow-up': sortStatus[headInfo.value] > 0, 'active': sortStatus[headInfo.value] }"
            icon-class="arrow-down"
            class="arrow-icon"
          />
        </div>
      </div>
    </div>
    <spinner
      v-if="loading"
      :title="$t('editing.loading')"
      class="spinner-container"
      size="50"
    />
    <div
      v-else
      class="data-table-body"
    >
      <empty-info-block
        v-if="isSearchResultEmpty"
        :msg="$t('message.emptyResult')"
      />
      <upload-block
        v-else-if="dataList.length === 0"
        :class="{'is-processing': isProcessing}"
        :bottom-message="emptyMessage"
        class="empty-status"
        @create="createDataSource"
      />
      <div
        v-for="(data, index) in dataList"
        v-else
        :key="index"
        :class="{selected: selectList.indexOf(data) > -1, 'is-processing': isInProcess(data) || isPending(data)}"
        class="data-table-row"
      >
        <div
          v-if="hasCheckbox"
          class="data-table-cell checkbox"
        >
          <label class="checkbox-label">
            <input
              v-model="selectList"
              :value="data"
              :disabled="isProcessing"
              type="checkbox"
              name="fileChosen"
            >
            <div class="checkbox-square" />
          </label>
        </div>
        <div
          v-for="headInfo in headers"
          :class="{action: headInfo.action, hasWidth: headInfo.width}"
          :key="headInfo.value"
          :style="{
            flex: `${headInfo.width ? 0 : 1} 0 ${headInfo.width}`,
            'text-align': headInfo.align
          }"
          class="data-table-cell"
        >
          <el-tooltip
            v-if="headInfo.link && checkLinkEnable(headInfo, data)"
            :content="data[headInfo.value]"
            placement="bottom-start"
          >
            <a
              href="javascript:void(0)"
              class="link name-link"
              @click="linkTo(headInfo.link, data.id)"
            >{{ data[headInfo.value] }}</a>
          </el-tooltip>
          <a
            v-for="action in headInfo.action"
            v-else-if="headInfo.action"
            :key="action.name"
            :disabled="isDisabledActionButton(action.value, data)"
            href="javascript:void(0)"
            class="link action-link link-dropdown"
            @click="doAction(action.value, action.link, data)"
          >
            <dropdown-select
              v-if="showActionDropdown(action.subAction, data)"
              :bar-data="showSubAction(action.subAction, data)"
              class="dropdown"
              @switchDialogName="doAction($event, action.link, data)"
            />
            {{ action.name }}
            <svg-icon
              v-if="action.subAction"
              icon-class="triangle"
              class="icon dropdown-icon"
            />
          </a>
          <span
            v-else-if="headInfo.value === 'state'"
            :class="{'is-processing': data[headInfo.value] === 'Process' || data[headInfo.value] === 'PROCESSING'}"
          >
            <svg-icon
              v-if="data[headInfo.value] === 'Process' || data[headInfo.value] === 'PROCESSING'"
              icon-class="spinner"
            />
            {{ buildStatus(data[headInfo.value]) }}
            <el-tooltip
              v-if="data.processComment"
              :content="data.processComment"
              class="item"
              popper-class="error-tooltip"
              placement="bottom"
            >
              <svg-icon
                icon-class="alert"
                class="alert-icon"
              />
            </el-tooltip>
          </span>
          <span
            v-else-if="headInfo.value === 'type'"
            :class="{'is-processing': data[headInfo.value] === 'PROCESS'}"
          >
            <svg-icon
              v-if="data[headInfo.value] === 'PROCESS'"
              icon-class="spinner"
            />
            {{ buildStatus(data[headInfo.value]) }}
            <el-tooltip
              v-if="data.processComment"
              :content="data.processComment"
              class="item"
              popper-class="error-tooltip"
              placement="bottom"
            >
              <svg-icon
                icon-class="alert"
                class="alert-icon"
              />
            </el-tooltip>
          </span>
          <span
            v-else-if="headInfo.value === 'joinCount'"
          >{{ data[headInfo.value] === 2 ? $t('editing.tableJoin') : $t('editing.userUpload') }}</span>
          <span v-else-if="headInfo.value === 'dataFrameStatus'">
            <span class="dataframe-status finished">
              {{ $t('editing.buildFinished') }}：{{ data.enableDataFrameCount }}
            </span>
            <span class="dataframe-status processing">
              {{ $t('editing.buildProcessing') }}：{{ data.processDataFrameCount }}
            </span>
            <span class="dataframe-status failed">
              {{ $t('editing.buildFailed') }}：{{ data.failDataFrameCount }}
            </span>
          </span>
          <span v-else-if="headInfo.value === 'primaryAlias'">
            <el-tooltip
              :content="data[headInfo.value]"
              placement="bottom-start"
            >
              <span class="dataframe-name">{{ data[headInfo.value] }}</span>
            </el-tooltip>
          </span>
          <span
            v-else-if="headInfo.value === 'latestImportStatus'"
            :class="{ 'is-processing': data[headInfo.value] === 'Process' }"
          >
            <svg-icon
              v-if="data[headInfo.value] === 'Process'"
              icon-class="spinner"
            />
            <el-tooltip
              :disabled="!(data['dbConnectionStartTime'] && data['dbConnectionEndTime'] && data['dbConnectionElapsedTime'])"
              placement="bottom-start"
            >
              <template #content>
                <div
                  v-for="info in dbConnectionLogInfo(data[headInfo.value])"
                  :key="info.title"
                  class="db-connection-log-info info"
                >
                  <p class="info__label">{{ info.label }}</p>
                  <p class="info__description">
                    {{ info.title === "dbConnectionElapsedTime" ? elapsedTimeFormat(data[info.title]) : timeToDateTimeSecondPrecision(data[info.title]) }}
                  </p>
                </div>
                <div
                  v-if="data.dataImportErrorMessage"
                  class="db-connection-log-info"
                >
                  <p class="info__label">{{ $t('editing.errorReason') }}</p>
                  <p class="info__description">{{ data.dataImportErrorMessage }}</p>
                </div>
              </template>
              <span :class="data.latestImportStatus ? `db-connection-status--${data.latestImportStatus.toLowerCase()}` : null">
                {{ batchLoadStatus(data) }}
                <svg-icon
                  v-show="data['dbConnectionStartTime'] && data['dbConnectionEndTime'] && data['dbConnectionElapsedTime']"
                  icon-class="information-circle"
                />
              </span>
            </el-tooltip>
          </span>
          <!-- 暫時放這 -->
          <span v-else-if="headInfo.value === 'createMethodLabel'">
            {{ data[headInfo.value] }}
            <a
              v-if="data.joinCount > 1"
              :disabled="isInProcess(data) || isPending(data) || calculateId === data.id"
              class="link"
              href="javascript:void(0);"
              @click="calculateMeta(data)"
            >
              <svg-icon
                v-show="calculateId === data.id"
                icon-class="spinner"
              />{{ $t('editing.reCalculateMeta') }}
            </a>
            <a
              v-if="data.enabledManualUpdate && data.lastImportType === 'REIMPORT'"
              :disabled="updateId === data.id"
              class="link"
              href="javascript:void(0);"
              @click="updateImmediately(data)"
            >
              <svg-icon
                v-show="updateId === data.id"
                icon-class="spinner"
              />{{ $t('button.updateImmediately') }}
            </a>
          </span>
          <span v-else>{{ headInfo.time ? timeFormat(data[headInfo.value], headInfo.time) : data[headInfo.value] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UploadBlock from '@/components/UploadBlock'
import DropdownSelect from '@/components/select/DropdownSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import { mapGetters } from 'vuex'
import { reCalculateMetaData, triggerUpdateData } from '@/API/DataSource'
import { Message } from 'element-ui'

/**
 * Data table 可傳入屬性
 * {
      // 欄位名稱
      text: '資料源名稱',
      // 屬性名稱
      value: 'name',
      // 排序
      sort: true,
      // 欄位寬度
      width: '16.3%',
      // 是否有連接
      link: true,
      // 時間格式
      time: 'YYYY-MM-DD'
      // 是否有功能
      action: [
        {
          // 功能名稱
          name: '重新命名',
          // emit function name
          value: 'rename'
        }
      ]
    }
 */
import i18n from '@/lang/index.js'
export default {
  name: 'DataTable',
  components: {
    UploadBlock,
    DropdownSelect,
    EmptyInfoBlock
  },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    // 第一欄是否有 checkbox
    selection: {
      type: Array,
      default: () => []
    },
    dataList: {
      type: [Array, Object],
      default: () => []
    },
    emptyMessage: {
      type: String,
      default: i18n.t('message.noData')
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    hasCheckbox: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    isSearchResultEmpty: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sortStatus: null,
      calculateId: null,
      updateId: null
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission']),
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog
    },
    // 目前所選擇的項目
    selectList: {
      get () {
        return this.selection
      },
      set (value) {
        this.$emit('update:selection', value)
      }
    },
    selectAll: {
      get () {
        return this.selectList.length === this.dataList.length && this.dataList.length > 0
      },
      set (value) {
        if (value) {
          this.selectList = this.dataList
        } else {
          this.selectList = []
        }
      }
    }
  },
  mounted () {
    this.setSortStatus()
  },
  methods: {
    dbConnectionLogInfo (status) {
      return status === 'Process'
        ? [{
          title: 'dbConnectionStartTime',
          label: this.$t('editing.startTime')
        }]
        : [{
          title: 'dbConnectionStartTime',
          label: this.$t('editing.startTime')
        },
        {
          title: 'dbConnectionEndTime',
          label: this.$t('editing.endTime')
        },
        {
          title: 'dbConnectionElapsedTime',
          label: this.$t('editing.elapsedTime')
        }]
    },
    setSortStatus () {
      let sortObj = {}
      this.headers.forEach(element => {
        if (element.sort) {
          sortObj[element.value] = null
        }
      })

      this.sortStatus = sortObj
    },
    createDataSource () {
      if (this.isProcessing) return
      this.$emit('create')
    },
    closeFileUploadDialog () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    rankingData (name) {
      for (let objProperty in this.sortStatus) {
        if (objProperty !== name) {
          this.sortStatus[objProperty] = null
        } else {
          if (this.sortStatus[name] === null) {
            this.sortStatus[name] = -1
          } else {
            this.sortStatus[name] = this.sortStatus[name] * -1
          }
        }
      }

      let order = this.sortStatus[name] > 0 ? 'asc' : 'desc'

      this.$emit('sort', { name, order })
    },
    linkTo (link, id) {
      let paramKey = link.paramName || 'id'
      this.$router.push({
        name: link.name,
        params: {
          [paramKey]: id
        }
      })
    },
    // 檢查 link 是否可以點擊
    checkLinkEnable (info, data) {
      let status = true
      if (info.link.disabled) {
        for (let i = 0; i < info.link.disabled.value.length; i++) {
          if (data[info.link.disabled.name] === info.link.disabled.value[i]) {
            status = false
          }
        }
      }
      return status
    },
    timeFormat (value, format) {
      if (value) {
        switch (format) {
          case 'YYYY-MM-DD':
            return this.timeToDate(value)
          case 'YYYY-MM-DD HH:mm':
            return this.timeToDateTime(value)
        }
      } else {
        return '-'
      }
    },
    doAction (actionName, actionLink, data) {
      if (
        !actionName ||
        this.isDisabledActionButton(actionName, data)
      ) return false
      if (actionLink) return this.linkTo(actionLink, data.id)
      this.$emit(actionName, data)
    },
    isDisabledActionButton (actionName, data) {
      if (
        this.isProcessing ||
        this.isInProcess(data) ||
        ((this.isFail(data) || this.isPending(data)) && actionName !== 'delete')
      ) return true
      return false
    },
    /**
     * TODO
     * 搞不清楚什麼時候要替換，這邊等後端更新之後再來統一
     */
    buildStatus (value) {
      switch (value) {
        case 'Ready':
        case 'READY':
        case 'Enable':
        case 'ENABLE':
          return i18n.t('editing.dataManageable')
        case 'Warn':
        case 'WARN':
        case 'Fail':
        case 'FAIL':
        case 'Delete':
        case 'DELETE':
        case 'DELETED':
        case 'Disable':
        case 'DISABLE':
          return i18n.t('editing.dataDisable')
        case 'Process':
        case 'PROCESS':
        case 'PROCESSING':
          return i18n.t('editing.dataBuilding')
        case 'Pending':
          return i18n.t('editing.dataInQueue')
      }
    },
    batchLoadStatus (data) {
      switch (data.latestImportStatus) {
        case null:
          return this.$t('batchLoad.noRecord')
        case 'Complete':
          return this.$t('batchLoad.updateSuccessfully')
        case 'Fail':
          return this.$t('batchLoad.updateFailed')
        case 'Process':
        case 'Ready':
          return this.$t('batchLoad.updating')
      }
    },
    showActionDropdown (subAction, data) {
      return subAction && !this.isProcessing && !this.isInProcess(data) && !this.isFail(data) && !this.isPending(data)
    },
    showSubAction (subAction, data) {
      return subAction.filter(action => {
        let hasPermission = true
        if (action.checkPermission) {
          // 需要擁有權限或是是自己建立的表
          hasPermission = this.hasPermission(action.checkPermission) || Number(data.createBy) === this.$store.state.userManagement.userId
        }
        if (action.dialogName === 'batchLoad' && data.joinCount > 1) return false
        if (action.dialogName === 'etlSetting') return data.etlExists
        if (action.dialogName === 'createdInfo') return data.originType === 'database' && hasPermission
        if (action.dialogName === 'updateSetting') return data.originType === 'file' && hasPermission && !data.name.startsWith('sc_')
        // Script 產出來的表，不能做資料處理設定
        if (action.dialogName === 'batchLoad') return !data.name.startsWith('sc_')
        return hasPermission
      })
    },
    isInProcess (data) {
      return data.state === 'Process' || data.state === 'PROCESSING'
    },
    isPending (data) {
      return data.state === 'Pending'
    },
    isFail (data) {
      return data.state === 'Disable' || data.type === 'DISABLE' || data.state === 'Fail' || data.type === 'FAIL' || data.state === 'Warn' || data.type === 'WARN'
    },
    elapsedTimeFormat (time) {
      let hour = this.$tc('timeScopeUnit.allowArg.hour', Math.floor(time / 3600)) + ' '
      let minute = this.$tc('timeScopeUnit.allowArg.minute', Math.floor(time % 3600 / 60)) + ' '
      let second = this.$tc('timeScopeUnit.allowArg.second', time % 60)
      return hour + minute + second
    },
    calculateMeta (dataInfo) {
      if (this.isInProcess(dataInfo) || this.isPending(dataInfo) || this.calculateId === dataInfo.id) return false
      this.calculateId = dataInfo.id
      // 重新計算 meta
      reCalculateMetaData(this.calculateId).then(() => {
        this.calculateId = null
        this.$emit('fetch')
      })
    },
    updateImmediately ({ id }) {
      if (this.updateId === id) return false
      this.updateId = id
      return triggerUpdateData(id).then(() => {
        Message({
          message: this.$t('batchLoad.startUpdate'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        this.updateId = null
        this.$emit('fetch')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.data-source-list-table {
  .empty-status {
    align-items: center;
    display: flex;
    height: 240px;
    justify-content: center;

    &.is-processing {
      cursor: not-allowed;
    }
  }

  .name-link {
    @include text-hidden;

    color: #42a5b3;
    display: inline-block;
    width: 100%;
  }

  .data-table-body {
    overflow: visible;
  }

  .data-table-row.is-processing {
    background-color: var(--color-bg-5);
  }

  .data-table-cell {
    .is-processing {
      color: #ccc;
    }

    .dataframe-status {
      display: block;
      height: 23px;

      &.finished {
        color: $theme-color-success;
      }

      &.processing {
        color: $theme-color-warning;
      }

      &.failed {
        color: $theme-color-danger;
      }
    }

    .dataframe-name {
      @include text-hidden;
    }

    .db-connection-status {
      &--fail {
        color: #ff5c46;
      }

      &--complete {
        color: #2fecb3;
      }
    }
  }

  .hasWidth {
    flex: initial;
  }

  .alert-icon {
    color: $theme-color-warning;
  }

  .spinner-container {
    height: 310px;
  }

  .link-dropdown {
    cursor: pointer;
    position: relative;

    &[disabled] {
      cursor: not-allowed;

      &:hover {
        .dropdown {
          visibility: hidden;
        }
      }
    }

    &:hover {
      .dropdown {
        visibility: visible;
      }

      .dropdown-icon {
        color: #fff;
        transform: rotate(0deg);
      }
    }

    .dropdown {
      visibility: hidden;
    }

    .dropdown-icon {
      margin-left: 6px;
      text-align: center;
      transform: rotate(180deg);
      transition: all 0.3s;
      width: 8px;
    }
  }
}
</style>
<style lang="scss">
.error-tooltip.el-tooltip__popper {
  background-color: #007783;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(34, 117, 125, 0.5);
  padding: 8px;

  &.el-tooltip__popper[x-placement^=top] .popper__arrow::after {
    border-top-color: #007783;
  }

  &.el-tooltip__popper[x-placement^=top] .popper__arrow {
    border-top-color: #007783;
  }

  &.el-tooltip__popper[x-placement^=bottom] .popper__arrow::after {
    border-bottom-color: #007783;
  }

  &.el-tooltip__popper[x-placement^=bottom] .popper__arrow {
    border-bottom-color: #007783;
  }
}

.db-connection-log-info {
  line-height: 14px;

  &:not(:first-child) {
    margin-top: 15px;
  }

  .info {
    &__label,
    &__description {
      font-size: 12px;
      line-height: 16px;
      margin: 0;
    }

    &__label {
      color: $theme-color-white;
      font-weight: 600;
    }

    &__description {
      color: #ddd;
    }
  }
}

.data-source-list-table {
  .link-dropdown {
    .dropdown-select {
      height: 30px;
      position: absolute;
      width: 100%;
    }

    .dropdown-select-box {
      box-shadow: 0 4px 10px rgba(58, 178, 189, 0.5);
      left: 0;
      top: 29px;
      z-index: 1;
    }

    .dropdown-select-box::before {
      right: 120px;
    }

    .dropdown-flex {
      padding: 12px;
    }
  }
}
</style>
