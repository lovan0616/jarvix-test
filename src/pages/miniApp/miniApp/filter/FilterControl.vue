<template>
  <section
    :class="{ 'has-background': isEditMode }"
    class="filter-control"
  >
    <svg-icon
      icon-class="filter" 
      class="filter-control__filter-icon"/>
    <single-filter-badge
      v-for="(filter, index) in filterlist"
      :key="index"
      :initial-filter="filter"
      :is-edit-mode="isEditMode"
      @updateFilter="updateFilter($event, index)"
    />
  </section>
</template>

<script>
import SingleFilterBadge from './SingleFilterBadge'

export default {
  name: 'FilterControl',
  components: {
    SingleFilterBadge
  },
  props: {
    initialFilterList: {
      type: Array,
      required: true
    },
    isEditMode: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      filterlist: [],
      isShowSeletor: false
    }
  },
  watch: {
    initialFilterList: {
      deep: true,
      handler (updatedFilterList) {
        this.filterlist = updatedFilterList
      }
    }
  },
  mounted () {
    this.filterlist = JSON.parse(JSON.stringify(this.initialFilterList))
  },
  methods: {
    updateFilter (updatedFilter, filterIndex) {
      const updatedFilterList = this.filterlist.map((filter, index) => {
        return index === filterIndex ? updatedFilter : filter
      })
      this.$emit('update:initial-filter-list', updatedFilterList)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-control {
  position: relative;
  z-index: 1;
  padding: 16px 19px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-right: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;

  &__filter-icon {
    margin-right: 11px;
  }

  &.has-background {
    background: #1C292B;
  }

  &__selector {
    position: absolute;
    top: 30px;
    left: 0;
    padding-top: 12px;
    width: 100%;
    border-radius: 5px;
    background-color: var(--color-bg-gray);
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));
    z-index: 2;

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      right: 6px;
      border-bottom: 12px solid #2B3839;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
    }
  }

  .selector {
    &__input-block {
      margin: 0 12px 8px 12px;
      padding: 9px 12px;
      width: calc(100% - 24px);
      font-size: 14px;
      color: #888888;
      border: none;
      border-radius: 8px;
      background-color: #141C1D;

      &:focus {
        outline: none;
      }
      
      .placeholder {
        font-size: 14px;
        line-height: 22px;
        color: #888888;
      }
    }

    &__list-block {
      max-height: 220px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.7);
      }  

      .checkbox {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 32px;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, .6);
        }

        &--active {
          cursor: not-allowed;
        }

        &:not(:first-child) {
          border-top: 1px solid #3F4546;
        }

        &-label {
          margin: 0 8px 0 12px;

          & input:checked ~ .checkbox-square {
            background: #777777;
            border-color: #DCDFE6;
          }

          & input:disabled ~ .checkbox-square:after {
            border-color: #C0C4CC;
          }
        }

        & > span {
          font-size: 14px;
          line-height: 20px;
          color: #CCC;
        }
      }
    }

    .empty-message {
      margin-bottom: 12px;
      padding: 0 12px;
      font-size: 12px;
      line-height: 20px;
      color: #CCC;
    }

  }
}
</style>