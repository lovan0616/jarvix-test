<template>
  <div class="remote-connection-form">
    <!-- 為了避免瀏覽器自動帶入 -->
    <input 
      name="account" 
      type="text" 
      class="hidden-input">
    <input 
      name="password" 
      type="password" 
      class="hidden-input">
    <input-block 
      v-validate="`required|max:${max}`"
      v-if="!dataSourceId"
      :label="$t('editing.dataSourceName')"
      v-model="dataSourceName"
      class="dialog-input"
      name="dataSourceName"
    />
    <input-block 
      v-validate="`required|max:${max}`"
      :label="$t('editing.connectionName')"
      v-model="connectInfo.name"
      class="dialog-input"
      name="connectionName"
    />
    <input-block 
      v-validate="'required'"
      :label="$t('editing.loginAccount')"
      v-model="connectInfo.account"
      class="dialog-input"
      name="account"
    />
    <input-block 
      v-validate="'required'"
      :label="$t('editing.loginPassword')"
      v-model="connectInfo.password"
      class="dialog-input"
      type="password"
      name="loginPwd"
    />
    <div class="database-type-select-block dialog-input">
      <label 
        for="connectInfo.databaseType"
        class="select-label"
      >{{ $t('editing.databaseType') }}</label>
      <default-select
        v-validate="'required'"
        v-model="connectInfo.databaseType"
        :option-list="dbOptionList"
        :placeholder="$t('editing.defaultOption')"
        name="databaseType"
      />
    </div>
    <input-block 
      v-validate="'required'"
      v-model="connectInfo.database"
      class="dialog-input"
      label="Database"
      name="database"
    />
    <input-block 
      v-validate="'max:128'"
      v-model="connectInfo.schema"
      class="dialog-input"
      label="Schema"
      name="schema"
    />
    <div class="inline-input-block">
      <input-block 
        v-validate="'required'"
        v-model="connectInfo.host"
        class="dialog-input host"
        label="Host"
        name="host"
      />
      <input-block 
        v-validate="'required'"
        v-model="connectInfo.port"
        class="dialog-input port"
        label="Port"
        name="port"
      />
    </div>
  </div>
</template>
<script>
import InputBlock from '@/components/InputBlock'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  inject: ['$validator'],
  name: 'RemoteConnectionForm',
  components: {
    InputBlock,
    DefaultSelect
  },
  props: {
    dataSourceId: {
      type: Number,
      default: null
    },
    dataSourceName: {
      type: String,
      default: null
    },
    connectInfo: {
      type: Object,
      default: () => {
        return {
          account: null,
          databaseType: null,
          host: null,
          name: null,
          password: null,
          port: null,
          database: null,
          schema: null
        }
      }
    }
  },
  data () {
    return {
      dbOptionList: [
        {
          name: 'MSSQL',
          value: 'MSSQL'
        },
        {
          name: 'POSTGRESQL',
          value: 'POSTGRESQL'
        }
      ]
    }
  },
  computed: {
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-input {
  margin-bottom: 36px;
}
.loading-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
.database-type-select-block {
  position: relative;

  .select-label {
    position: absolute;
    font-size: 13px;
    line-height: 24px;
    top: -24px;
    left: 0;
  }

  & >>> .sy-select {
    width: 100%;
    border-bottom: 1px solid #aaa;
  }
}

.inline-input-block {
  width: 100%;
  display: flex;

  .dialog-input {
    margin-bottom: 0;
  }

  .host {
    width: 74.66%;
    margin-right: 16px;
  }
}

.hidden-input {
  display: block;
  opacity: 0;
  height: 0;
  padding: 0;
  border: 0;
}
</style>
<style lang="scss">
.database-type-select-block {
  .sy-select {
    .el-input__inner {
      padding-left: 0;
    }
  }

  .el-select-dropdown__item {
    padding-left: 0;
  }
}
.remote-connection-form {
  .input-block .error-text {
    right: 0;
  }
}
</style>
