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
            <div class="checkbox-square"/>
          </label>
        </div>
        <div 
          v-for="headInfo in headers"
          :key="headInfo.value"
          :class="{sort: headInfo.sort, hasWidth: headInfo.width}"
          :style="{
            width: headInfo.width,
            'text-align': headInfo.align
          }"
          class="data-table-cell"
          @click="(headInfo.sort) ? rankingData(headInfo.value) : ''"
        >{{ headInfo.text }}
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
      <upload-block
        v-if="dataList.length === 0"
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
            <div class="checkbox-square"/>
          </label>
        </div>
        <div 
          v-for="headInfo in headers"
          :class="{action: headInfo.action, hasWidth: headInfo.width}"
          :key="headInfo.value"
          :style="{
            width: headInfo.width,
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
            :disabled="isProcessing || isInProcess(data) || ((isFail(data) || isPending(data)) && action.value !== 'delete')"
            href="javascript:void(0)"
            class="link action-link link-dropdown"
            @click="doAction(action.value, data)"
          >
            <dropdown-select
              v-if="showActionDropdown(action.subAction, data)"
              :bar-data="action.subAction"
              class="dropdown"
              @switchDialogName="doAction($event, data)"
            />
            {{ action.name }}
            <svg-icon 
              v-if="action.subAction" 
              icon-class="triangle" 
              class="icon dropdown-icon" />
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
                class="alert-icon"/>
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
                class="alert-icon"/>
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
          <span v-else>{{ headInfo.time ? timeFormat(data[headInfo.value], headInfo.time) : data[headInfo.value] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UploadBlock from '@/components/UploadBlock'
import orderBy from 'lodash.orderby'
import DropdownSelect from '@/components/select/DropdownSelect'

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
    DropdownSelect
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
    }
  },
  data () {
    return {
      sortStatus: null
    }
  },
  computed: {
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
      this.$emit('update:dataList', orderBy(this.dataList, [name], [order]))
    },
    linkTo (link, id) {
      this.$router.push({
        name: link.name,
        params: {
          id
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
    doAction (actionName, data) {
      if (!actionName || this.isProcessing || this.isInProcess(data) || ((this.isFail(data) || this.isPending(data)) && actionName !== 'delete')) return false
      this.$emit(actionName, data)
    },
    /**
     * TODO
     * 搞不清楚什麼時候要替換，這邊等後端更新之後再來統一
     */
    buildStatus (value) {
      switch (value) {
        case 'Warn':
        case 'WARN':
        case 'Ready':
        case 'READY':
        case 'Enable':
        case 'ENABLE':
          return i18n.t('editing.dataManageable')
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
    showActionDropdown (subAction, data) {
      return subAction && !this.isProcessing && !this.isInProcess(data) && !this.isFail(data) && !this.isPending(data)
    },
    isInProcess (data) {
      return data['state'] === 'Process' || data['state'] === 'PROCESSING'
    },
    isPending (data) {
      return data['state'] === 'Pending'
    },
    isFail (data) {
      return data['state'] === 'Disable' || data['type'] === 'DISABLE' || data['state'] === 'Fail' || data['type'] === 'FAIL'
    }
  },
}
</script>
<style lang="scss" scoped>
.data-source-list-table {
  .empty-status {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 240px;

    &.is-processing {
      cursor: not-allowed;
    }
  }

  .name-link {
    display: inline-block;
    width: 100%;
    color: #42A5B3;
    @include text-hidden;
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
    position: relative;
    cursor: pointer;

    &[disabled] {
      cursor: not-allowed;
    }

    &:hover {
      .dropdown {
        visibility: visible;
      }

      .dropdown-icon {
        transform: rotate(0deg);
        color: #fff;
      }
    }

    .dropdown {
      visibility: hidden;
    }

    .dropdown-icon {
      margin-left: 6px;
      width: 8px;
      text-align: center;
      transition: all 0.3s;
      transform: rotate(180deg);
    }
  }
}
</style>
<style lang="scss">
.error-tooltip.el-tooltip__popper {
  background-color: #007783;
  box-shadow: 0px 2px 10px rgba(34, 117, 125, 0.5);
  border-radius: 8px;
  padding: 8px;

  &.el-tooltip__popper[x-placement^=top] .popper__arrow:after {
    border-top-color: #007783;
  }

  &.el-tooltip__popper[x-placement^=top] .popper__arrow {
    border-top-color: #007783;
  }

  &.el-tooltip__popper[x-placement^=bottom] .popper__arrow:after {
    border-bottom-color: #007783;
  }

  &.el-tooltip__popper[x-placement^=bottom] .popper__arrow {
    border-bottom-color: #007783;
  }
}

.data-source-list-table {
  .link-dropdown {
    .dropdown-select {
      position: absolute;
      width: 100%;
      height: 30px;
    }
    .dropdown-select-box {
      top: 29px;
      left: 0;
      z-index: 1;
      box-shadow: 0px 4px 10px rgba(58, 178, 189, 0.5)
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
