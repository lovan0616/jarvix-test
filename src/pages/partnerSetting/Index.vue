<template>
  <div class="page-sis-setting">
    <div class="setting-block">
      <div class="setting-block__title">顯示設定</div>
      <div class="setting-block__content">
        <div class="input-block">
          <label for="">切換顯示 Logo：</label>
          <el-switch 
            v-model="switchDisplayLogo"
            class="setting-switch"
          />
          <div 
            v-if="switchDisplayLogo"
            class="sub-setting-block"
          >
            <div class="block__title">選擇欲變更的圖片</div>
            <div
              v-for="(option, index) in logoOptionList"
              :key="index + '-' + option"
              class="input-radio-group"
            >
              <input
                v-validate="'required'"
                :id="index + '-' + option"
                :value="option"
                v-model="currentLogoType"
                class="input-radio"
                type="radio"
              >
              <label
                :for="index + '-' + option"
                class="input-radio-label"
              >{{ option }}</label>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PagePartnerSetting',
  data () {
    return {
      logoOptionList: [
        'SyGPS',
        'ASE'
      ],
      currentLogo: localStorage.getItem('currentLogo'),
      switchLogo: localStorage.getItem('switchLogo')
    }
  },
  computed: {
    switchDisplayLogo: {
      get () {
        return this.switchLogo === 'true' || this.switchLogo
      },
      set (value) {
        this.switchLogo = value
        localStorage.setItem('switchLogo', value)
        if (!value) localStorage.removeItem('currentLogo')
      }
    },
    currentLogoType: {
      get () {
        return this.currentLogo
      },
      set (value) {
        this.currentLogo = value
        localStorage.setItem('currentLogo', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page-sis-setting {
  width: 960px;
  margin: 32px auto;

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

  .sub-setting-block {
    margin-top: 24px;
    background-color: #333;
    padding: 24px;
    border-radius: 8px;
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
    padding: 4px;
    font-size: 14px;
    border-radius: 4px;
  }

  .setting-switch {
    &.is-checked /deep/ .el-switch__core {
      background-color: #409EFF;
      border-color: #409EFF;
    }
  }
}
</style>