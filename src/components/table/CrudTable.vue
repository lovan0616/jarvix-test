<template>
  <div class="data-table crud-table">
    <div class="data-table-head">
      <div class="data-table-row table-head">
        <div
          class="data-table-cell checkbox"
          v-if="hasCheckbox"
        >
          <label class="checkbox-label"
            :class="{indeterminate: selectList.length > 0 && selectList.length < dataList.length}"
          >
            <input
              type="checkbox"
              name="selectAll"
              v-model="selectAll"
              :disabled="isProcessing"
            >
            <div class="checkbox-square"></div>
          </label>
        </div>
        <div
          class="data-table-cell"
          v-for="headInfo in headers"
          :key="headInfo.value"
          :class="{sort: headInfo.sort, hasWidth: headInfo.width}"
          :style="{
            width: headInfo.width,
            'text-align': headInfo.align
          }"
          @click="(headInfo.sort) ? rankingData(headInfo.value) : ''"
        >{{ headInfo.text }}
          <span
            class="tooltip-container"
            v-if="headInfo.tooltip"
          >
            <svg-icon icon-class="information-circle" class="icon" />
            <div
              class="tooltip"
              :style="{width: headInfo.tooltip.width}"
            >
              <slot :name="headInfo.value" />
              <span v-if="headInfo.tooltip.text" v-html="headInfo.tooltip.text" />
            </div>
          </span>
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
    <empty-info-block
      v-else-if="dataList.length === 0"
      :msg="emptyMessage"
    ></empty-info-block>
    <div
      class="data-table-body"
      v-else
    >
      <div class="data-table-row"
        v-for="(data, index) in dataList"
        :key="index"
        :class="{selected: selectList.indexOf(data) > -1}"
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
          <template v-if="headInfo.value === 'action'">
            <slot name="action" :data="data">
              <a
                href="javascript:void(0)"
                class="link action-link link-dropdown"
                v-for="action in headInfo.action"
                :key="action.name"
                :disabled="isProcessing || !showActionButton(action, data)"
                @click="doAction(action, data)"
              >
                <dropdown-select
                  v-if="action.subAction"
                  class="dropdown"
                  :barData="getBarData(action.subAction, data)"
                />
                {{ action.name }}
                <svg-icon v-if="getBarData(action.subAction, data).length > 0" icon-class="triangle" class="icon dropdown-icon" />
              </a>
            </slot>
          </template>
          <template v-else-if="headInfo.value === 'icon'">
            <svg-icon
              :icon-class="data[headInfo.value]"
              class="icon"
              :class="data.class"
            />
          </template>
          <span v-else>{{ data[headInfo.value] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import orderBy from 'lodash.orderby'
import DropdownSelect from '@/components/select/DropdownSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import { mapGetters } from 'vuex'

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
      // tooltip
      tooltip: {
        // tooltip 寬度（需給定）
        width: '200px',
        // tooltip 內容可直接透過 text 屬性帶入值(允許 innerHTML)
        // 亦可用 slot 帶入客製化內容，slot 名稱格式："header value"
        text: 'tooltip 文字內容'
      }
      // 是否有連接
      link: true,
      // 時間格式
      time: 'YYYY-MM-DD'
      // 是否有功能
      action: [
        {
          // action 用途
          type: 'event / link',
          // 功能名稱
          name: '重新命名',
          // emit function name
          value: 'rename',
          // action type 為 link 時設定路徑
          link: {
            name: 'route name'
          }
        }
      ]
    }
 */

export default {
  name: 'CrudTable',
  components: {
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
    emptyMessage: {
      type: String,
      default () { this.$t('editing.emptyResult') }
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
    doAction (action, data) {
      if (!action || (action && !action.value) || !this.showActionButton(action, data)) return
      if (action.type === 'event') return this.$emit(action.value, data)
      this.linkTo(action.link, data.id)
    },
    hasActionPermission (action) {
      if (!action.hasOwnProperty('permission')) return true
      return this.hasPermission(action.permission)
    },
    getBarData (actions = [], data) {
      if (data && !data.id) return actions
      return actions.reduce((acc, cur) => {
        if (!this.hasActionPermission(cur)) return acc
        acc.push({
          ...cur,
          id: data.id
        })
        return acc
      }, [])
    },
    showActionButton (action, data) {
      if (!action.subAction) return this.hasActionPermission(action)
      return this.getBarData(action.subAction, data).length > 0
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission']),
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
.crud-table {
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

  .tooltip-container {
    margin: 0 3px;

    .tooltip {
      padding: 12px;
      line-height: 14px;
      white-space: normal;
    }

    .icon {
      color: $theme-color-warning;
    }
  }
}
</style>
<style lang="scss">
.crud-table {
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
