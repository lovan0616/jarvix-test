<template>
  <div class="page-sis-setting">
    <div class="setting-block">
      <div class="setting-block__title">
        Public / Schedule API 環境設定
      </div>
      <div class="setting-block__content">
        <div class="input-block">
          <label for="">Public API 環境：</label>
          <el-select
            v-model="publicApiRootUrlValue"
            class="setting-select"
          >
            <el-option
              v-for="item in publicApiRootOptions"
              :key="`public-api-option-${item.label}`"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input-block">
          <label for="">Schedule API 環境：</label>
          <el-select
            v-model="scheduleApiRootUrlValue"
            class="setting-select"
          >
            <el-option
              v-for="item in scheduleApiRootOptions"
              :key="`schedule-api-option-${item.label}`"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="setting-block">
      <div class="setting-block__title">
        資料處理設定
      </div>
      <div class="setting-block__content">
        <div class="input-block">
          <label for="">開啟分片設定：</label>
          <el-switch
            v-model="openDistributedSetting"
            class="setting-switch"
          />
        </div>
      </div>
    </div>
    <div class="setting-block">
      <div class="setting-block__title">
        排程模組設定
      </div>
      <div class="setting-block__content">
        <div class="input-block">
          <label for="">開啟訂單上傳功能：</label>
          <el-switch
            v-model="openOrderUpload"
            class="setting-switch"
          />
        </div>
        <div class="input-block">
          <label for="">啟用排程模組：</label>
          <el-switch
            v-model="openScheduleModule"
            class="setting-switch"
          />
        </div>
      </div>
    </div>
    <div class="setting-block">
      <div class="setting-block__title">
        新 parser 設定
      </div>
      <div class="setting-block__content">
        <div class="input-block">
          <label for="">開啟新 parser：</label>
          <el-switch
            v-model="useNewParser"
            class="setting-switch"
          />
        </div>
      </div>
    </div>
    <div class="setting-block">
      <div class="setting-block__title">
        演算法設定
      </div>
      <div class="setting-block__content">
        <div class="input-block">
          <label for="">開啟演算法：</label>
          <el-switch
            v-model="showAlgorithmBtn"
            class="setting-switch"
          />
        </div>
        <div class="input-block">
          <label for="">Demo 已經結束：</label>
          <el-switch
            v-model="demoEnd"
            class="setting-switch"
          />
        </div>
        <div class="input-block">
          <label for="">Demo 資料源名稱 (預設：富士康_輪廓型分析_molding_預測)：</label>
          <el-input
            v-model="demoDatasourceName"
            class="el-input"
          />
        </div>
        <div class="input-block">
          <label for="">Demo 演算法計算時間（單位：毫秒）（預設 30 秒）：</label>
          <el-input
            v-model="demoCalculateTime"
            type="number"
            class="el-input"
          />
        </div>
      </div>
    </div>
    <div class="setting-block">
      <div class="setting-block__title">
        Join Table 限制
      </div>
      <div class="setting-block__content">
        <div class="input-block">
          <label for="">開啟 Join Table 檢查資料量的限制：</label>
          <el-switch
            v-model="hasJoinLimit"
            class="setting-switch"
          />
        </div>
      </div>
    </div>
    <div class="setting-block">
      <div class="setting-block__title">
        快捷鍵
      </div>
      <div class="setting-block__content">
        <div class="input-block">
          <label for="">開啟豹小秘機器人：</label>
          <code class="code">1. 點擊問句輸入框 2. Ctrl + Shift + x (刪除問句的 icon 將會變色)</code>
        </div>
        <div class="input-block">
          <label for="">關閉演算法超過200萬筆不做的限制：</label>
          <code class="code">1. 點擊問句輸入框 2. Ctrl + Shift + z (送出問句的箭頭將會變色)</code>
        </div>
        <div class="input-block">
          <label for="">開啟問句輔助：</label>
          <code class="code">1. 點擊問句輸入框 2. Ctrl + Shift + h</code>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const PUBLIC_API_ROOT_OPTIONS = {
  dev: 'https://public.dev.sis.ai/',
  qa: 'https://public.qa.sis.ai/',
  qa2: 'https://public.qa2.sis.ai/',
  sp1: 'https://public.sp1.sis.ai/',
  sp2: 'https://public.sp2.sis.ai/',
  sp3: 'https://public.sp3.sis.ai/'
}

const SCHEDULE_API_ROOT_OPTIONS = {
  dev: 'https://schedule.dev.sis.ai/',
  qa: 'https://schedule.qa.sis.ai/',
  qa2: 'https://schedule.qa2.sis.ai/',
  sp1: 'https://schedule.sp1.sis.ai/',
  sp2: 'https://schedule.sp2.sis.ai/',
  sp3: 'https://schedule.sp3.sis.ai/'
}

export default {
  name: 'PageSisSetting',
  data () {
    return {
      isShowDistributedSetting: localStorage.getItem('isShowDistributedSetting'),
      isShowOrderUpload: localStorage.getItem('isShowOrderUpload'),
      isShowScheduleModule: localStorage.getItem('isShowScheduleModule'),
      isShowAlgorithmBtn: localStorage.getItem('isShowAlgorithmBtn'),
      isDemoEnd: localStorage.getItem('isDemoEnd'),
      demoDatasource: localStorage.getItem('demoDatasource'),
      demoWaitTime: localStorage.getItem('demoWaitTime'),
      joinLimit: localStorage.getItem('joinLimit'),
      newParser: localStorage.getItem('newParser'),
      publicApiRootUrl: localStorage.getItem('PUBLIC_API_ROOT_URL'),
      publicApiRootOptions: Object.entries(PUBLIC_API_ROOT_OPTIONS).map(([label, value]) => ({ label, value })),
      scheduleApiRootUrl: localStorage.getItem('SCHEDULE_API_ROOT_URL'),
      scheduleApiRootOptions: Object.entries(SCHEDULE_API_ROOT_OPTIONS).map(([label, value]) => ({ label, value }))
    }
  },
  computed: {
    openDistributedSetting: {
      get () {
        return this.isShowDistributedSetting === 'true' || this.isShowDistributedSetting
      },
      set (value) {
        this.isShowDistributedSetting = value
        localStorage.setItem('isShowDistributedSetting', value)
      }
    },
    openOrderUpload: {
      get () {
        return this.isShowOrderUpload === 'true' || this.isShowOrderUpload
      },
      set (value) {
        this.isShowOrderUpload = value
        localStorage.setItem('isShowOrderUpload', value)
      }
    },
    openScheduleModule: {
      get () {
        return this.isShowScheduleModule === 'true' || this.isShowScheduleModule
      },
      set (value) {
        this.isShowScheduleModule = value
        localStorage.setItem('isShowScheduleModule', value)
      }
    },
    showAlgorithmBtn: {
      get () {
        return this.isShowAlgorithmBtn === 'true' || this.isShowAlgorithmBtn
      },
      set (value) {
        this.isShowAlgorithmBtn = value
        localStorage.setItem('isShowAlgorithmBtn', value)
      }
    },
    demoEnd: {
      get () {
        return this.isDemoEnd === 'true' || this.isDemoEnd
      },
      set (value) {
        this.isDemoEnd = value
        localStorage.setItem('isDemoEnd', value)
      }
    },
    demoDatasourceName: {
      get () {
        return this.demoDatasource
      },
      set (value) {
        this.demoDatasource = value
        localStorage.setItem('demoDatasource', value)
      }
    },
    demoCalculateTime: {
      get () {
        return this.demoWaitTime
      },
      set (value) {
        this.demoWaitTime = value
        localStorage.setItem('demoWaitTime', value)
      }
    },
    hasJoinLimit: {
      get () {
        return this.joinLimit === 'true' || this.joinLimit
      },
      set (value) {
        this.joinLimit = value
        localStorage.setItem('joinLimit', value)
      }
    },
    useNewParser: {
      get () {
        return this.newParser === 'true' || this.newParser
      },
      set (value) {
        this.newParser = value
        localStorage.setItem('newParser', value)
      }
    },
    publicApiRootUrlValue: {
      get () {
        return this.publicApiRootUrl
      },
      set (value) {
        this.publicApiRootUrl = value
        localStorage.setItem('PUBLIC_API_ROOT_URL', value)
        window.location.reload()
      }
    },
    scheduleApiRootUrlValue: {
      get () {
        return this.scheduleApiRootUrl
      },
      set (value) {
        this.scheduleApiRootUrl = value
        localStorage.setItem('SCHEDULE_API_ROOT_URL', value)
        window.location.reload()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page-sis-setting {
  margin: 32px auto;
  width: 960px;

  .setting-block {
    margin-bottom: 24px;

    &__title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    &__content {
      background-color: #000;
      border-radius: 8px;
      padding: 16px;
    }
  }

  .input-block {
    &:not(:last-child) {
      margin-bottom: 16px;
    }

    .el-input {
      width: 200px;
    }
  }

  .code {
    background-color: rgb(224, 36, 36);
    border-radius: 4px;
    font-size: 14px;
    padding: 4px;
  }

  .setting-switch {
    &.is-checked ::v-deep .el-switch__core {
      background-color: #409eff;
      border-color: #409eff;
    }
  }
}
</style>
