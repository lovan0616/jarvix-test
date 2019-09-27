<template>
  <div class="data-table data-source-list-table">
    <div class="data-table-head"
      :class="{ 'is-scrolling': tableScrolling }"
    >
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
          :class="{sort: headInfo.sort}"
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
    <div class="data-table-body" ref="dataTableBody">
      <upload-block
        v-if="dataList.length === 0"
        class="empty-status"
        :bottom-message="emptyMessage"
        @create="createDataSource"
      ></upload-block>
      <div class="data-table-row"
        v-else
        v-for="(data, index) in dataList"
        :key="index"
        :class="{selected: selectList.indexOf(data) > -1, 'is-processing': data['build_status']}"
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
          :class="{action: headInfo.action}"
          :key="headInfo.value"
          :style="{
            width: headInfo.width,
            'text-align': headInfo.align
          }"
        >
          <a href="javascript:void(0)" class="name-link"
            v-if="headInfo.link && checkLinkEnable(headInfo, data)"
            @click="linkTo(headInfo.link, data.id)"
          >{{ data[headInfo.value] }}</a>
          <a href="javascript:void(0)" class="action-link"
            v-else-if="headInfo.action"
            v-for="action in headInfo.action"
            :key="action.name"
            :disabled="isProcessing || data['build_status']"
            @click="doAction(action.value, data)"
          >{{ action.name }}</a>
          <span v-else-if="headInfo.value === 'build_status'"
            :class="{'is-processing': data[headInfo.value]}"
          >
            <svg-icon
              v-if="data[headInfo.value]"
              icon-class="spinner"
            ></svg-icon>
            {{ data[headInfo.value] ? $t('editing.dataBuilding') : $t('editing.dataManageable') }}
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
    UploadBlock
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
    }
  },
  data () {
    return {
      tableScrolling: false,
      sortStatus: null
    }
  },
  mounted () {
    document.addEventListener('scroll', this.detectScroll, true)
    this.setSortStatus()
  },
  destroyed () {
    document.removeEventListener('scroll', this.detectScroll, true)
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
    detectScroll () {
      let dataTableBody = this.$refs.dataTableBody
      let firstChild = dataTableBody.childNodes[0]
      this.tableScrolling = firstChild.getBoundingClientRect().top - dataTableBody.getBoundingClientRect().top !== 0
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
      switch (format) {
        case 'YYYY-MM-DD':
          return this.timeStampToDate(value)
        case 'YYYY-MM-DD HH:mm':
          return this.timeStampToDateTime(value)
      }
    },
    doAction (actionName, data) {
      if (this.isProcessing) return false
      this.$emit(actionName, data)
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
        return this.selectList.length === this.dataList.length
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
    padding-top: 50px;
    height: 240px;
  }

  .name-link {
    display: inline-block;
    width: 100%;
    color: #42A5B3;
  }
  .data-table-row.is-processing {
    background-color: rgba(0, 0, 0, 0.35);
  }
  .data-table-cell {
    .is-processing {
      color: #ccc;
    }
  }
}
</style>
