<template>
  <ul class="list">
    <spinner 
      v-if="isLoading"
      class="list__spinner"
      size="50"
    />
    <template v-else>
      <li 
        v-for="(log, index) in warningLog"
        :key="index"
        class="list__item">
        <div class="list__item--left">
          <svg-icon 
            icon-class="alert" 
            class="list__item-icon"/>
        </div>
        <div class="list__item--right">
          <div class="list__item-title">
            {{ log.title }}
          </div>
          <div class="list__item-description">
            {{ log.time }}
          </div>
        </div>
      </li>
    </template>
  </ul>
</template>

<script>
const dummyWaningLog = [
  {
    title: '案場(A) / Inverter(01) / CH(05)發現異常，異常代碼為(1)',
    time: '2020/11/03 13:44:56'
  },
  {
    title: '案場(A) / Inverter(01) / CH(05)發現異常，異常代碼為(1)',
    time: '2020/11/03 13:44:56'
  },
  {
    title: '案場(A) / Inverter(01) / CH(05)發現異常，異常代碼為(1)、(2)',
    time: '2020/11/03 13:44:56'
  },
  {
    title: '案場(A) / Inverter(01) / CH(05)發現異常，異常代碼為(1)、(2)',
    time: '2020/11/03 13:44:56'
  },
  {
    title: '案場(A) / Inverter(01) / CH(05)發現異常，異常代碼為(1)、(2)',
    time: '2020/11/03 13:44:56'
  },
  {
    title: '案場(A) / Inverter(01) / CH(05)發現異常，異常代碼為(1)、(2)',
    time: '2020/11/03 13:44:56'
  }
]

export default {
  name: 'MonitorWarningList',
  data () {
    return {
      warningLog: [],
      isLoading: false
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      this.warningLog = dummyWaningLog
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  flex: 1;
  width: 100%;
  overflow: auto;
  padding: 0;
  margin: 0;
  &__item {
    width: 100%;
    min-height: 62px;
    background: #252F2F;
    border-radius: 5px;
    display: flex;
    padding: 12px;

    &:not(:last-of-type) {
      margin-bottom: 8px;
    }

    &--left {
      display: flex;
      align-items: center;
      margin-right: 11px;
    }

    &--right {
      flex: 1;
    }

    &-icon {
      color: #FF5C46;
      font-size: 25px;
    }

    &-title {
      color: #FFFFFF;
      font-size: 12px;
      margin-bottom: 5px;
    }

    &-description {
      color: #A7A7A7;
      font-size: 12px;
    }
  }
}
</style>
