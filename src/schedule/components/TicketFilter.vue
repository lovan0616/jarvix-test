<template>
  <div class="filter">
    <div
      class="filter__input"
      @mouseleave="closeDopdown"
    >
      <i class="el-icon-search filter__icon-search" />
      <input
        v-model="keyword"
        :placeholder="$t('schedule.simulation.searchJobOrOrder')"
        class="filter__input-text"
        @mouseenter="openDropdown"
      >
      <i  
        class="el-icon-circle-close filter__icon-reset"
        @click="keyword = ''"
      />
      <ul
        v-show="isFocus"
        class="filter__input-options"
      >
        <template v-if="options.length > 0">
          <li
            v-for="option in options"
            :key="option"
            class="option"
            @click="onClickOption(option)"
          >
            {{ option }}
          </li>
          <observer
            v-if="!reachLastPage"
            :options="observerOptions"
            @intersect="fetchOptions(++paginationInfo.currentPage)"
          />
        </template>
        <div
          v-else
          class="option is-empty">
          {{ $t('schedule.base.noData') }}
        </div>
      </ul>
    </div>
    <default-button
      class="filter__button"
      type="outline"
      @click="$emit('search', keyword)"
    >
      {{ $t(`schedule.button.${btnText}`) }}
    </default-button>
  </div>
</template>

<script>
import { keywordSearch } from '@/schedule/API/Plan'
import { mapState } from 'vuex'
import Observer from '@/components/Observer'

export default {
  name: 'TicketFilter',
  components: {
    Observer
  },
  data () {
    return {
      isSearching: true,
      isFocus: false,
      isSelectByClick: false,
      btnText: 'send', // send, reset
      keyword: '',
      options: [],
      defaultOptions: [], // 將第一頁選項暫存在本地
      debounceTimer: null,
      paginationInfo: {
        currentPage: 0,
        itemPerPage: 0,
        totalItems: 0,
        totalPages: 0
      }
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    observerOptions () {
      return {
        rootClassName: '.filter__input-options',
        rootMargin: 0,
        threshold: 0,
      }
    },
    reachLastPage () {
      return this.paginationInfo.currentPage >= this.paginationInfo.totalPages - 1
    }
  },
  watch: {
    keyword (keyword) {
      if (this.isSearching) return
      // 如果是直接點 options，就不用再去 fetch 選項
      if (this.isSelectByClick) {
        // 還原狀態
        this.isSelectByClick = false
        return
      }
      if (!keyword) {
        this.options = this.defaultOptions
        this.btnText = 'reset'
        return
      }
      this.clearTimer()
      this.btnText = 'send'
      this.paginationInfo.currentPage = 0
      this.debounceTimer = setTimeout(() => {
        this.fetchOptions()
      }, 200)
    }
  },
  mounted () {
    this.fetchOptions()
  },
  methods: {
    fetchOptions (page = 0) {
      this.isSearching = true
      keywordSearch({
        projectId: this.scheduleProjectId,
        page,
        size: 200,
        keyword: this.keyword
      })
      .then(({ data: newOptions, pagination }) => {
        if (this.defaultOptions.length === 0) {
          this.defaultOptions = newOptions
        }
        if (pagination.currentPage === 0) {
          this.options = newOptions
        } else {
          this.options = [ ...this.options, ...newOptions ]
        }
        this.paginationInfo = pagination
      })
      .catch(() => {})
      .finally(() => this.isSearching = false)
    },
    onClickOption (option) {
      this.isSelectByClick = true
      this.keyword = option
      this.closeDopdown()
    },
    openDropdown () {
      this.isFocus = true
    },
    closeDopdown () {
      this.isFocus = false
    },
    clearTimer () {
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  align-items: center;

  &__input {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: rgba(35, 61, 64, 0.6);
    border-radius: 6px;
    margin-right: 8px;
    font-size: 14px;

    &-text {
      background-color: transparent;
      border: none;
      line-height: 36px;
      color: var(--color-text);
      outline: none;
    }
    &-options {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #303435;
      margin: 0;
      padding: 0;
      max-height: 320px;
      width: 100%;
      overflow: auto;
      font-size: 14px;
      list-style: none;
      z-index: 4;
      box-shadow: 0px 4px 12px rgba(73, 128, 132, 0.48);
  
      .option {
        padding: 0 20px;
        line-height: 36px;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, .55);
          color: var(--color-text);
        }
        &.is-empty {
          cursor: default;
        }
      }
    }
  }
  &__icon {
    font-size: 13px;
    &-search {
      margin-right: 4px;
    }
    &-reset {
      margin-left: 8px;
      cursor: pointer;
    }
  }
}
</style>