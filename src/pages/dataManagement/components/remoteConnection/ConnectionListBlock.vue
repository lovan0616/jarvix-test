<template>
  <div class="connection-list-block">
    <div class="block-title-row">
      <div class="block-title">{{ title }}</div>
      <slot name="fileListTitle"></slot>
    </div>
    <div class="connection-list">
      <div class="single-connection-row"
        v-for="(connection, index) in connectionList"
        :key="index"
      >
        <div class="single-connection-info">
          <div class="file-info name">{{ connection.name }}</div>
        </div>
        <div class="file-status">
          <svg-icon
            :class="connection.connectionStatus"
            :icon-class="connection.connectionStatus === 'success' ? 'checked' : 'alert'"
          ></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ConnectionListBlock',
  props: {
    title: {
      type: String,
      default: null
    },
    connectionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.connection-list-block {

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  .block-title-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .block-title {
      font-size: 14px;
      line-height: 21px;
      letter-spacing: 0.5px;
    }
  }

  .connection-list {
    background: rgba(50, 58, 58, 0.95);
    border-radius: 4px;
    max-height: 280px;
    overflow: auto;
    padding: 24px;
  }

  .single-connection-row {
    display: flex;
    padding: 10px 20px;
    font-size: 14px;
    background-color: rgba(67, 76, 76, 0.95);
    border-radius: 5px;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    &.fail {
      color: #BDBDBD;
    }

    .single-connection-info {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      line-height: 19px;
      letter-spacing: 0.5px;
      margin-right: 15px;
    }

    .file-status {
      position: relative;
      width: 52px;
      text-align: center;

      .success {
        color: $theme-color-primary;
      }
      .fail {
        color: #F1616D;
      }
    }
  }
}
</style>
