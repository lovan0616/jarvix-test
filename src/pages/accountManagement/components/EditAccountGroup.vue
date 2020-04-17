<template>
  <form
    @submit.stop.prevent="submitForm"
    class="edit-account-group"
  >
    <div class="input-wrapper">
      <div class="input-group">
        <div class="input-label">{{ $t('editing.groupName') }}：</div>
        <input-block
          class="input-block"
          name="groupName"
          v-model="groupName"
          v-validate="'required'"
        ></input-block>
      </div>
      <div
        v-if="editData.type === 'create'"
        class="input-group"
      >
        <div class="input-label">{{ $t('editing.accountOwner') }}：</div>
        <div
          class="input-block"
          :class="{'has-error': errors.has('owner')}"
        >
          <default-select
            class="input"
            v-model="selectedOwner"
            :option-list="userEmailList"
            name="owner"
            v-validate="'required'"
          ></default-select>
          <div
            class="error-text"
            v-if="errors.has('owner')"
          >{{errors.first('owner')}}</div>
        </div>
      </div>
    </div>
    <div class="button-block">
      <button
       type="button"
        class="btn btn-outline"
        @click.stop="cancelEditGroup"
      >{{ $t('button.cancel') }}</button>
      <button
        class="btn btn-default"
        type="submit"
      >{{editData.type === 'create' ? $t('button.built') : $t('button.save')}}</button>
    </div>
  </form>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import InputBlock from '@/components/InputBlock'
import { getAccountUsers, updateGroupInfo, createGroup } from '@/API/User'
import { Message } from 'element-ui'

export default {
  name: 'EditAccountGroup',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock
  },
  props: {
    groupList: {
      type: Array,
      default: () => []
    },
    editData: {
      type: Object,
      default: () => ({
        type: '',
        data: ''
      })
    }
  },
  data () {
    return {
      selectedOwner: '',
      groupName: this.getGroupName(),
      userList: [],
      userEmailList: []
    }
  },
  mounted () {
    if (this.editData.type === 'create') return this.fetchUser()
  },
  methods: {
    getGroupName () {
      if (this.editData.type === 'create' || !this.editData.data || !this.editData.data.groupName) return ''
      return JSON.parse(JSON.stringify(this.editData.data.groupName))
    },
    fetchUser () {
      getAccountUsers()
        .then(users => {
          this.userList = users
          this.userEmailList = users.map(user => ({value: user.email}))
        })
        .catch(() => this.cancelEditGroup())
    },
    cancelEditGroup () {
      this.$emit('cancelEdit')
    },
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        // create a new group
        if (this.editData.type === 'create') {
          createGroup({
            name: this.groupName,
            ownerId: this.userList.find(user => user.email === this.selectedOwner).id
          })
          this.$emit('finishEdit')
          return Message({
            message: this.$t('message.groupCreateSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        }

        // Update group info
        updateGroupInfo({
          id: this.editData.data.groupId,
          name: this.groupName
        })
          .then(() => {
            this.$emit('finishEdit')
            Message({
              message: this.$t('message.groupInfoUpdatedSuccess'),
              type: 'success',
              duration: 3 * 1000
            })
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-account-group {
  .input-wrapper {
    background: $theme-bg-color;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 1rem;
  }

  .input-group {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .input-label {
    margin-right: .5rem;
  }

  .input-block {
    width: 350px;

    & >>> .input {
      padding-bottom: 0px;
    }
  }

  .button-block {
    display: flex;
    justify-content: flex-end;

    .btn:not(:last-of-type) {
      margin-right: 20px;
    }
  }

  .has-error .input {
    border-bottom: 1px solid #EB5959;
  }

  >>> .el-input__inner {
    padding-left: 0;
    padding-bottom: 8px;
  }
}
</style>
