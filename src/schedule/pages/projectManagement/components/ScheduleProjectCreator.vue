<template>
  <div class="general-management-page general-management-page--project-create">
    <div class="page-title-row">
      <h1 class="title">
        <div class="title-left">{{ $t('schedule.project.projectManagement') }}</div>
      </h1>
      <div class="bread-crumb">
        <router-link 
          :to="{ name: 'ScheduleProjectList' }" 
          class="title-link">{{ $t('schedule.project.projectManagement') }}</router-link>
        <span class="divider">/</span>
        {{ $t('schedule.project.createProject') }}
      </div>
      <div class="block__form">
        <div class="form__item">
          <div class="form__label">
            {{ $t('schedule.project.projectName') }}
          </div>
          <div class="form__content">
            <default-input
              v-validate="'required'"
              v-model="formData.name" 
              :placeholder="$t('schedule.project.pleaseEnterProjectName')"
              name="name"
            />
          </div>
        </div>
        <div class="form__item">
          <div class="form__label">
            {{ $t('schedule.project.bindDataSource') }}
          </div>
          <div class="form__content">
            <div class="input-radio-group">
              <div>
                <input
                  id="true"
                  v-model="isNewDataSource"
                  :value="false"
                  class="input-radio"
                  type="radio"
                  name="isNewDataSource"
                >
                <label 
                  class="input-radio-label" 
                  for="true">{{ $t('schedule.project.existingDataSource') }}</label>
              </div>
              <default-select 
                v-validate.disable="'required'"
                v-model="formData.datasourceId"
                :options="dataSourceOptions"
                name="datasourceId"
                @input="isNewDataSource = false"
              />
            </div>
            <div class="input-radio-group">
              <div>
                <input
                  id="false"
                  v-model="isNewDataSource"
                  :value="true"
                  class="input-radio"
                  type="radio"
                  name="isNewDataSource"
                >
                <label 
                  class="input-radio-label" 
                  for="false">{{ $t('schedule.project.createDataSource') }}</label>
              </div>
              <default-input 
                v-validate="'required'"
                v-model="formData.datasourceName" 
                :placeholder="$t('schedule.project.pleaseEnterDataSourceName')"
                name="datasourceName"
                @input="isNewDataSource = true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="button-block">
        <default-button 
          type="outline" 
          @click="$router.push({ name: 'ScheduleProjectList' })">{{ $t('button.cancel') }}</default-button>
        <default-button
          :is-disabled="isProcessing"
          @click="onClickCreate"
        >{{ $t('button.build') }}</default-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { postProjectWithDatasource, postProjectNewDatasource } from '@/schedule/API/Project' 
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'ScheduleProjectCreator',
  data: () => {
    return {
      formData: {
        name: '',
        datasourceName: '',
        datasourceId: null
      },
      isProcessing: false,
      isNewDataSource: false
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceList']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    dataSourceOptions () {
      const options = this.dataSourceList.map(item => ({ value: item.id, label: item.name }))
      options.unshift({ value: null, label: this.$t('editing.defaultOption') })
      return options
    }
  },
  watch: {
    isNewDataSource (value) {
      // 切換"是否建立新資料源時"，清除不相關的error msg
      if (value) {
        if (this.errors.items.find(item => item.field === 'datasourceId')) this.errors.remove('datasourceId')
      } else {
        if (this.errors.items.find(item => item.field === 'datasourceName')) this.errors.remove('datasourceName')
      }
    }
  },
  methods: {
    onClickCreate () {
      const validateName = this.$validator.validate('name')
      const fields = [validateName, this.isNewDataSource ? this.$validator.validate('datasourceName') : this.$validator.validate('datasourceId')]
      
      Promise.all(fields)
        .then(res => {
          if (res.some(isValid => !isValid)) return

          let copiedFormData = { ...this.formData }
          copiedFormData.groupId = this.getCurrentGroupId

          this.isProcessing = true
          if (this.isNewDataSource) {
            delete copiedFormData.datasourceId
            postProjectNewDatasource(copiedFormData)
              .then(() => this.afterCreated())
              .catch(() => {})
              .finally(() => this.isProcessing = false)
          } else {
            delete copiedFormData.datasourceName
            postProjectWithDatasource(copiedFormData)
              .then(() => this.afterCreated())
              .catch(() => {})
              .finally(() => this.isProcessing = false)
          }
        })
    },
    afterCreated () {
      Message({
        message: this.$t('schedule.project.successfullyCreateDataSource'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
      this.$router.push({ name: 'ScheduleProjectList' })
    }
  }
}
</script>

<style lang="scss" scoped>
.general-management-page {
  &--project-create {
    padding: 24px;
  }
  .title-link {
    color: $theme-color-primary;
    text-decoration: underline;
  }
  .divider {
    margin: 0 .5rem;
  }

  .block__form {
    background-color: rgba(0, 0, 0, 0.55);
    border-radius: 8px;
    padding: 24px;
    margin: 12px 0;

    .form {
      &__item {
        display: flex;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
      }
      &__label {
        flex-basis: 120px;
        line-height: 40px;
        text-align: right;
        margin-right: 16px;
      }
      &__content {
        flex: 1;
        display: flex;
        .input-radio-group {
          .default-select, .default-input {
            margin-left: 30px;
          }
        }
        /deep/ .el-input .el-input__inner {
          line-height: 40px;
          height: 40px;
          width: 200px;
        }
      }
    }
  }

  .button-block {
    .btn + .btn {
      margin-left: 8px;
    }
  }
}
</style>