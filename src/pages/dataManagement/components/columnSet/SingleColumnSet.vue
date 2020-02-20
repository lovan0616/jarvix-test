<template>
  <div class="single-edit-region">
    <div class="input-block">
      <label for="">*{{ $t('editing.columnSetName') }}</label>
      <input type="text" class="input"
        :placeholder="$t('editing.pleaseEnterName')"
      >
    </div>
    <div class="select-container">
      <div class="select-block">
        <div class="block-title">{{ $t('editing.notSelect') }}</div>
        <div class="option-list-block">
          <div class="single-option"
            v-for="column in columnList"
            :key="column.id"
          >
            <div class="info name">{{ column.name }}</div>
            <div class="info alias">{{ column.primaryAlias }}</div>
            <button class="btn-m btn-default btn-select">{{ $t('button.select') }}</button>
          </div>
        </div>
      </div>
      <div class="icon-block">
        <svg-icon icon-class="go-right" class="arrow-icon"></svg-icon>
        <svg-icon icon-class="go-right" class="arrow-icon left"></svg-icon>
      </div>
      <div class="select-block">
        <div class="block-title">{{ $t('editing.alreadySelect') }}</div>
        <div class="option-list-block"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SingleColumnSet',
  props: {
    columnList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    
  }
}
</script>
<style lang="scss" scoped>
.single-edit-region {
  width: 100%;
  height: 484px;
  padding: 24px;
  background: rgba(50, 58, 58, 0.95);
  border-radius: 5px;

  .select-container {
    display: flex;
    justify-content: space-between;

    .select-block {
      width: 46%;
      background: rgba(38, 46, 46, 0.95);
      border-radius: 8px;
      padding: 16px;
      height: 358px;

      .block-title {
        margin-bottom: 12px;
        font-size: 14px;
      }
    }

    .icon-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .arrow-icon {
        &.first-child {
          margin-bottom: 12px;
        }
        &.left {
          transform: rotate(180deg);
        }
      }
    }

    .single-option {
      background: #475353;
      border-radius: 5px;
      padding: 12px;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      .info {
        font-size: 14px;
        line-height: 20px;

        &:first-child {
          margin-bottom: 4px;
        }

        &.alias {
          color: #ccc;
        }
      }

      .btn-select {
        position: absolute;
        top: 12px;
        right: 12px;
      }
    }
  }
}
</style>
