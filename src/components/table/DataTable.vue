<template>
  <div class="data-table data-source-list-table">
    <div class="data-table-head">
      <div class="data-table-row table-head">
        <div class="data-table-cell checkbox"
          v-if="hasCheckbox"
        >
          <label class="checkbox-label"
            :class="{indeterminate: selectList.length > 0 && selectList.length < dataList.length}"
          >
            <input type="checkbox" name="selectAll"
              v-model="selectAll"
              :disabled="isProcessing"
            >
            <div class="checkbox-square"></div>
          </label>
        </div>
        <div class="data-table-cell"
          v-for="headInfo in headers"
          :key="headInfo.value"
          :class="{sort: headInfo.sort, hasWidth: headInfo.width}"
          :style="{
            width: headInfo.width,
            'text-align': headInfo.align
          }"
          @click="(headInfo.sort) ? rankingData(headInfo.value) : ''"
        >{{ headInfo.text }}
          <svg-icon icon-class="arrow-down" class="arrow-icon"
            v-if="headInfo.sort && sortStatus"
            :class="{ 'arrow-up': sortStatus[headInfo.value] > 0, 'active': sortStatus[headInfo.value]  }"
          ></svg-icon>
        </div>
      </div>
    </div>
    <spinner class="spinner-container"
      v-if="loading"
      :title="$t('editing.loading')"
      size="50"
    ></spinner>
    <div class="data-table-body"
      v-else
    >
      <upload-block
        v-if="dataList.length === 0"
        class="empty-status"
        :class="{'is-processing': isProcessing}"
        :bottom-message="emptyMessage"
        @create="createDataSource"
      ></upload-block>
      <div class="data-table-row"
        v-else
        v-for="(data, index) in dataList"
        :key="index"
        :class="{selected: selectList.indexOf(data) > -1, 'is-processing': data['state'] === 'PROCESSING'}"
      >
        <div class="data-table-cell checkbox"
          v-if="hasCheckbox"
        >
          <label class="checkbox-label">
            <input type="checkbox" name="fileChosen"
              v-model="selectList"
              :value="data"
              :disabled="isProcessing"
            >
            <div class="checkbox-square"></div>
          </label>
        </div>
        <div class="data-table-cell"
          v-for="headInfo in headers"
          :class="{action: headInfo.action, hasWidth: headInfo.width}"
          :key="headInfo.value"
          :style="{
            width: headInfo.width,
            'text-align': headInfo.align
          }"
        >
          <a href="javascript:void(0)" class="link name-link"
            v-if="headInfo.link && checkLinkEnable(headInfo, data)"
            @click="linkTo(headInfo.link, data.id)"
          >{{ data[headInfo.value] }}</a>

          <a href="javascript:void(0)" class="link action-link link-dropdown"
            v-else-if="headInfo.action"
            v-for="action in headInfo.action"
            :key="action.name"
            :disabled="isProcessing || data['state'] === 'PROCESSING'"
            @click="doAction(action.value, data)"
          >
            <dropdown-select
              v-if="action.subAction"
              class="dropdown"
              @switchDialogName="doAction($event, data)"
              :barData="action.subAction"
            />
            {{ action.name }}
            <svg-icon v-if="action.subAction" icon-class="triangle" class="icon dropdown-icon" />
          </a>

          <span v-else-if="headInfo.value === 'state'"
            :class="{'is-processing': data[headInfo.value] === 'PROCESSING'}"
          >
            <svg-icon
              v-if="data[headInfo.value] === 'PROCESSING'"
              icon-class="spinner"
            ></svg-icon>
            {{ buildStatus(data[headInfo.value]) }}
            <el-tooltip class="item"
              v-if="data.processComment"
              popper-class="error-tooltip"
              :content="data.processComment"
              placement="bottom"
            >
              <svg-icon icon-class="alert" class="alert-icon"></svg-icon>
            </el-tooltip>
          </span>
          <span v-else-if="headInfo.value === 'type'"
            :class="{'is-processing': data[headInfo.value] === 'PROCESS'}"
          >
            <svg-icon
              v-if="data[headInfo.value] === 'PROCESS'"
              icon-class="spinner"
            ></svg-icon>
            {{ buildStatus(data[headInfo.value]) }}
            <el-tooltip class="item"
              v-if="data.processComment"
              popper-class="error-tooltip"
              :content="data.processComment"
              placement="bottom"
            >
              <svg-icon icon-class="alert" class="alert-icon"></svg-icon>
            </el-tooltip>
          </span>
          <span v-else-if="headInfo.value === 'joinCount'"
          >{{ data[headInfo.value] === 2 ? $t('editing.tableJoin') : $t('editing.userUpload') }}</span>
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
      if (!actionName || this.isProcessing || data['state'] === 'PROCESSING') return false
      this.$emit(actionName, data)
    },
    buildStatus (value) {
      switch (value) {
        case 'WARN':
        case 'READY':
        case 'ENABLE':
          return i18n.t('editing.dataManageable')
        case 'ERROR':
        case 'DISABLE':
          return i18n.t('editing.dataDisable')
        case 'PROCESS':
        case 'PROCESSING':
          return i18n.t('editing.dataBuilding')
      }
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
  }
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
  }
  .data-table-body {
    overflow: visible;
  }
  .data-table-row.is-processing {
    background-color: $theme-bg-color;
  }
  .data-table-cell {
    .is-processing {
      color: #ccc;
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
