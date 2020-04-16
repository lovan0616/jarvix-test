<template>
  <div class="etl-choose-column">
    <div class="section data-frame">
      <div class="title">{{ $t('etl.dataFrameList') }}</div>
      <div class="data-frame-list">
        <div class="single-column"
          v-for="n in 3"
          :key="n"
        >XX123XX</div>
      </div>
    </div>
    <div class="section data-column">
      <div class="title has-icon">{{ $t('etl.columnList') }}</div>
      <div class="data-column-list">
        <label class="single-column"
          v-for="(column, index) in columnList"
          :key="index"
        >
          <div class="checkbox">
            <div class="checkbox-label">
              <input type="checkbox" :name="'column' + index"
                :value="true"
                v-model="column.active"
              >
              <div class="checkbox-square"></div>
            </div>
          </div>
          <div class="data-frame-info">
            <div class="data-frame-name">{{ column.name }}</div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EtlChooseColumn',
  data () {
    return {
      columnList: [
        {
          name: 'XX',
          active: true
        },
        {
          name: '1234',
          active: true
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.etl-choose-column {
  display: flex;

  .section {
    flex: 1;

    &:not(:last-child) {
    
    }

    &.data-frame {
      flex: initial;
      width: 250px;
      padding-right: 20px;
    }
  }

  .title {
    margin-bottom: 12px;
  }

  .data-frame-list {

    .single-column {
      background: rgba(67, 76, 76, 0.95);
      border-radius: 5px;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }

  .data-column-list {
    .single-column {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 14px 16px;
      background: rgba(67, 76, 76, 0.95);
      border-radius: 5px;

      .checkbox {
        margin-right: 8px;
      }

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
