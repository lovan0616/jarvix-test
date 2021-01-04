<template>
  <aside class="mini-app__side-nav">
    <div
      v-if="isEditMode || isWarningModuleActivate"
      :class="{'is-active': isShowWarningModule && !currentDashboardId}"
      class="title warning-module-entry"
      @click="$emit('openWarningModule')">
      <svg-icon 
        icon-class="warning" 
        class="label-icon"/>
      <span class="label-name">{{ $t('alert.monitorAlert') }}</span>
    </div>
    <div class="title">
      <svg-icon 
        icon-class="dashboard" 
        class="label-icon"/>
      <span class="label-name">{{ $t('miniApp.dashboardList') }}</span>
      <div
        v-if="isEditMode"
        class="create-dashboard-icon-block"
        @click="$emit('showCreateDashboardDialog')"
      >
        <svg-icon 
          icon-class="plus" 
          class="create-dashboard-icon"/>
      </div>
    </div>
    <ul class="item-wrapper">
      <draggable
        :list="dashboardList"
        :move="logDraggingMovement"
        :disabled="!isEditMode || dashboardList.length === 1"
        ghost-class="dragging-ghost"
        @end="updateDashboardOrder"
      >
        <li
          v-for="dashboard in dashboardList" 
          :key="dashboard.id"
          :class="{'is-active': dashboard.id === currentDashboardId}"
          class="item"
          @click="$emit('activeCertainDashboard', dashboard.id)"
        >
          <svg-icon 
            class="item-icon" 
            icon-class="triangle"/>
          <span class="item-name">{{ dashboard.name }}</span>
        </li>
      </draggable>
    </ul>
  </aside>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'MiniAppSideNav',
  components: {
    draggable
  },
  props: {
    isEditMode: {
      type: Boolean,
      default: false
    },
    dashboardList: {
      type: Array,
      default: () => []
    },
    currentDashboardId: {
      type: String,
      default: null
    },
    isWarningModuleActivate: {
      type: Boolean,
      default: false
    },
    isShowWarningModule: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      draggedContext: { index: -1, futureIndex: -1 }
    }
  },
  computed: {
    isDashboardOrderChanged () {
      return this.draggedContext.index !== this.draggedContext.futureIndex
    }
  },
  methods: {
    logDraggingMovement (e) {
      const { index, futureIndex } = e.draggedContext
      this.draggedContext = { index, futureIndex }
    },
    updateDashboardOrder () {
      if (this.isDashboardOrderChanged) {
        this.$emit('updateDashboardOrder')
        this.draggedContext = { index: -1, futureIndex: -1 }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-app__side-nav {
  flex: 0 0 240px;
  display: flex;
  flex-direction: column;
  background-color: #000;
  border-right: 1px solid #232C2E;
  .title {
    padding-left: 26px;
    padding-right: 20px;
    color: $theme-color-primary;
    flex: 0 0 48px;
    line-height: 48px;
    display: flex;
    align-items: center;
    &.warning-module-entry {
      cursor: pointer;
    }
    .label-icon {
      margin-right: 4px;
    }
    .label-name {
      padding-left: 6px;
      flex: 1;
    }
  }
  .item-wrapper {
    overflow: overlay;
    flex: 1;
    margin: 0;
    padding: 0;
    list-style: none;
    .item {
      min-height: 48px;
      padding: 12px 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #FFF;
      &:hover {
        color: #FFF;
      }
      &-icon {
        visibility: hidden;
        height: 12px;
        margin: 0 16px 0 24px;
        transform: translate(-1px, -1px) rotate(-30deg);
        flex-shrink: 0;
      }
    }
  }
  .create-dashboard-icon-block {
    flex: 0 0 48px;
    cursor: pointer;
    text-align: right;
  }
  .item.is-active, .title.is-active {
    background-color: #42A5B3;
    color: #FFF;
    .item-icon {
      visibility: visible;
    }
  }
}

.dragging-ghost {
  opacity: 0.5;
  background: #42A5B3;
}
</style>