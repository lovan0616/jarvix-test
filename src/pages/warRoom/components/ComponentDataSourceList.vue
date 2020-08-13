<template>
  <section class="setting__content">
    <div class="setting__block">
      <a
        href="javascript:void(0);"
        class="link action-link" 
        @click="$emit('back')"
      >
        <svg-icon
          icon-class="arrow-left" 
          class="icon"/>
        {{ $t('warRoom.back') }}
      </a>
    </div>
    <div class="setting__block">
      <div class="setting__block-title">
        {{ $t('warRoom.indexTypeContent') }}
      </div>
      <div
        v-if="dataSouceList.indexList.length > 0"
        :class="{ 'setting__block-list--disabled': componentType !== 'number' }"
        class="setting__block-list"
      >
        <div
          v-for="item in dataSouceList.indexList"
          :key="item.id"
          class="setting__block-list-item"
        >
          <a
            href="javascript:void(0);"
            class="link" 
            @click="selectedDataSourceItem(item)"
          >{{ item.name }}</a>
          <a
            href="javascript:void(0);"
            class="link icon" 
            @click="deleteDataSourceItem()"
          ><svg-iconicon-class="delete"/></a>
        </div>
      </div>
    </div>
    <div class="setting__block">
      <div class="setting__block-title">
        {{ $t('warRoom.chartTypeContent') }}
      </div>
      <div
        v-if="dataSouceList.diagramList.length > 0"
        :class="{ 'setting__block-list--disabled': componentType !== 'chart' }"
        class="setting__block-list"
      >
        <div
          v-for="item in dataSouceList.diagramList"
          :key="item.id"
          class="setting__block-list-item"
        >
          <a
            href="javascript:void(0);"
            class="link" 
            @click="selectedDataSourceItem(item)"
          >{{ item.name }}</a>
          <a
            href="javascript:void(0);"
            class="link icon" 
            @click="deleteDataSourceItem"
          ><svg-iconicon-class="delete"/></a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ComponentDataSourceList',
  props: {
    componentType: {
      type: String,
      required: true
    },
    dataSouceList: {
      type: Object,
      default: () => ({
        indexList: [],
        diagramList: []
      })
    }
  },
  methods: {
    selectedDataSourceItem (item) {
      this.$emit('select', item)
    },
    deleteDataSourceItem () {
      // TODO: delete
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  &__content {
    justify-content: flex-start;
  }

  &__block {
    &:not(:first-of-type) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  &__block-list {
    margin-top: 8px;
    flex: 1;
    overflow: auto;

    &--disabled {
      opacity: .5;
      .setting__block-list-item {
        pointer-events: none;
      }
    }
  }

  &__block-list-item {
    padding: 8px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;

    &:hover {
      background: #171E1E;
      .link { color: #4DE2F0; }
      .icon { opacity: 1; }
    }

    .link {
      color: #EEEEEE;
      text-decoration: none;
    }

    .icon {
      opacity: 0;
      color: #4DE2F0;
      cursor: pointer;
    }
  }
}

</style>