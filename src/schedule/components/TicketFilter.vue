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
        <spinner v-if="isSearching" />
        <template v-else-if="options.length > 0">
          <li
            v-for="option in options"
            :key="option"
            class="option"
            @click="onClickOption(option)"
          >
            {{ option }}
          </li>
        </template>
        <div
          v-else
          class="option is-empty">
          查無結果
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

export default {
  name: 'TicketFilter',
  data () {
    return {
      isSearching: true,
      isFocus: false,
      btnText: 'send', // send, reset
      keyword: '',
      options: [],
      defaultOptions: [], // 將第一頁選項暫存在本地
      debounceTimer: null
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId'])
  },
  watch: {
    keyword (keyword) {
      if (this.isSearching) return
      if (!keyword) {
        this.options = this.defaultOptions
        this.btnText = 'reset'
        return
      }
      this.clearTimer()
      this.btnText = 'send'
      this.debounceTimer = setTimeout(() => {
        this.fetchOptions(keyword)
      }, 200)
    }
  },
  mounted () {
    this.fetchOptions()
  },
  methods: {
    fetchOptions (keyword = '') {
      this.isSearching = true
      keywordSearch({
        projectId: this.scheduleProjectId,
        page: 0,
        size: 200,
        keyword
      })
      .then(options => {
        if (this.defaultOptions.length === 0) {
          this.defaultOptions = options
        }
        this.options = options
      })
      .catch(() => {})
      .finally(() => this.isSearching = false)
    },
    onClickOption (option) {
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
      max-height: 400px;
      width: 100%;
      overflow: auto;
      font-size: 14px;
      list-style: none;
      z-index: 4;
  
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