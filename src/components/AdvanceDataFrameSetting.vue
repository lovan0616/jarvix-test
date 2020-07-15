<template>
  <div 
    :class="{ 'is-show': isShowSettingBox }"
    class="setting__wrapper">
    <span 
      class="setting__close-icon" 
      @click="closeAdvanceDataFrameSetting">
      <svg-icon icon-class="close"/>
    </span>
    <div class="filter-block filter-block--top">
      <div class="filter-block__title">
        <svg-icon 
          icon-class="column" 
          class="filter-block__title--icon" />
        {{ $t('dataFrameAdvanceSetting.columnList') }}
      </div>
      <div class="filter-block__search-box">
        <div class="input-group">
          <svg-icon 
            icon-class="search" 
            class="input-group__icon" />
          <input 
            ref="columnSearchInput"
            :placeholder="$t('dataFrameAdvanceSetting.searchColumn')"
            :disabled="false"
            class="input input-group__field"
            autocomplete="off"
            @keyup="searchColumn"
          >
        </div>
      </div>
      <div class="filter-block__select-box">
        <div class="filter-block__select-box--actions">
          <a 
            href="javascript:void(0);" 
            class="link filter-block__select-box--link"
            @click="selectAllColumns"
          >{{ $t('button.selectAll') }}</a>
          <a 
            href="javascript:void(0);" 
            class="link filter-block__select-box--link"
            @click="clearAllColumns"
          >{{ $t('button.delete') }}</a>
        </div>
        <div class="filter-block__select-box--checkbox">
          <label class="filter-block__select-box--checkbox-label">
            <div class="checkbox">
              <div class="checkbox-label">
                <input 
                
                  type="checkbox"
                >
                <div class="checkbox-square"/>
              </div>
            </div>
            日期
          </label>
        </div>
      </div>
    </div>
    <div class="filter-block filter-block--bottom">
      <div class="filter-block__title">
        <svg-icon 
          icon-class="filter" 
          class="filter-block__title--icon" />
        {{ $t('dataFrameAdvanceSetting.filterCriteria') }}
      </div>
      <div class="filter-block__select-box">
        <div class="filter-block__select-box--checkbox">
          <label class="filter-block__select-box--checkbox-label">
            <div class="checkbox">
              <div class="checkbox-label">
                <input 
                
                  type="checkbox"
                >
                <div class="checkbox-square"/>
              </div>
            </div>
            日期
          </label>
          <span class="filter-block__select-box--checkbox-description">
            description
          </span>
        </div>
      </div>
    </div>
    <div class="setting__button-block">
      <button 
        type="button"
        class="btn btn-outline"
        @click="saveFilter"
      >{{ $t('button.save') }}</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AdvanceDataFrameSetting',
  data () {
    return {}
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
  },
  methods: {
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox']),
    closeAdvanceDataFrameSetting () {
      this.toggleSettingBox(false)
    },
    searchColumn () {

    },
    selectAllColumns () {

    },
    clearAllColumns () {

    },
    saveFilter () {

    }
  }
}
</script>

<style lang="scss" scoped>
.setting__wrapper {
  position: absolute;
  top: $header-height + $chat-room-height;
  left: 0;
  min-height: calc(100vh - #{$header-height + $chat-room-height});
  width: $basic-df-setting-width;
  display: flex;
  flex-direction: column;
  transform: translateX(-$basic-df-setting-width);
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.55);;
  border: 1px solid #2B3638;
  display: flex;
  flex-direction: column;
  flex: 1;

  &.is-show {
    transform: translateX(0);
  }
  
  .setting {
    &__close-icon {
      position: absolute;
      top: 18px;
      right: 24px;
      color: #0CD1DE;
      cursor: pointer;
    }

    &__button-block {
      padding: 16px 24px;

      .btn {
        width: 100%;
      }
    }
  }

  .filter-block {
    max-height: 350px;
    overflow: auto;
    padding: 16px 24px;
    border-bottom: 1px solid #464A50;
    overflow: auto;

    &--top {
      flex: 6 6 auto;
      min-height: 400px
    }

    &--bottom {
      flex: 4 4 auto;
      min-height: 250px
    }

    &__title {
      padding-bottom: 18px;
      font-weight: 600;

      &--icon {
        color: #0CD1DE;
        margin-right: 6px;
      }
    }

    &__search-box {
      padding-bottom: 12px;
    }

    &__select-box {
      &--actions {
        padding-bottom: 16px;
      }

      &--link {
        font-weight: 600;
        &:not(:last-of-type) {
          margin-right: 8px;
        }
      }

      &--checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;

        .checkbox {
          margin-right: 11px;
        }
      }

      &--checkbox-description {
        margin-left: 26px;
        color: #CCCCCC;
        font-size: 12px;
      }
    }
    

    .input-group {
      background: rgba(35, 61, 64, 0.6);
      padding: 10px;
      display: flex;
      align-items: center;
      border-radius: 5px;

      &__icon {
        margin-right: 6px;
      }

      &__field {
        line-height: 22px;
        border-bottom: none;
        
        &::placeholder {
          color: #888888;
          font-size: 14px;
        }
      }
    }
  }
}
</style>