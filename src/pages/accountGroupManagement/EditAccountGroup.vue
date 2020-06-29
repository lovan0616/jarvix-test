<template>
  <div class="group-management">
    <div class="page-title-row">
      <h1 class="title">{{ editTypeName }}</h1>
      <div class="bread-crumb">
        <router-link
          :to="{name: 'AccountGroupManagement'}"
          class="title-link"
          @click="quitEditGroup"
        >
          {{ $t('sideNav.accountGroupManagement') }}
        </router-link>
        <span class="divider">></span>{{ editTypeName }}
      </div>
    </div>
    <form
      class="group-info-form"
      @submit.stop.prevent="submitForm"
    >
      <div class="input-wrapper">
        <div class="input-group">
          <div class="input-label">{{ $t('editing.groupName') }}</div>
          <input-block
            v-validate="`required|max:${max}`"
            v-model="groupName"
            class="input-block"
            name="groupName"
          />
        </div>
        <div
          v-if="editType === 'create'"
          class="input-group"
        >
          <div class="input-label">{{ $t('editing.groupOwner') }}</div>
          <div
            :class="{'has-error': errors.has('owner')}"
            class="input-block"
          >
            <default-select
              v-validate="'required'"
              v-model="selectedOwner"
              :option-list="userEmailList"
              filterable
              class="input"
              name="owner"
            />
            <div
              v-if="errors.has('owner')"
              class="error-text"
            >{{ errors.first('owner') }}</div>
          </div>
        </div>
      </div>
      <div class="button-block">
        <button
          type="button"
          class="btn btn-outline"
          @click.stop="quitEditGroup"
        >{{ $t('button.cancel') }}</button>
        <button
          :disabled="isLoading"
          class="btn btn-default"
          type="submit"
        >{{ editType === 'create' ? $t('button.built') : $t('button.save') }}</button>
      </div>
    </form>
  </div>
</template>
<script>

import { getAccountGroupList, getAccountUsers, updateGroupInfo, createGroup } from '@/API/User'
import DefaultSelect from '@/components/select/DefaultSelect'
import InputBlock from '@/components/InputBlock'
import { Message } from 'element-ui'

export default {
  name: 'EditAccountGroup',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock
  },
  data () {
    return {
      isLoading: false,
      selectedOwner: '',
      groupName: '',
      userList: [],
      userEmailList: []
    }
  },
  computed: {
    editType () {
      const groupId = this.$route.params.id
      return groupId ? 'edit' : 'create'
    },
    editTypeName () {
      return this.editType === 'create' ? this.$t('button.createGroup') : this.$t('button.editGroupName')
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  mounted () {
    this.editType === 'create' ? this.fetchUser() : this.fetchGroupName()
  },
  methods: {
    quitEditGroup () {
      this.$router.push({name: 'AccountGroupManagement'})
    },
    fetchGroupName () {
      this.isLoading = true
      getAccountGroupList()
        .then(groupList => {
          this.groupName = groupList.find(group => group.groupId === parseInt(this.$route.params.id)).groupName
          this.isLoading = false
        })
        .catch(() => this.quitEditGroup())
    },
    fetchUser () {
      this.isLoading = true
      getAccountUsers()
        .then(userList => {
          this.userList = userList
          this.userEmailList = userList.map(user => ({value: user.email}))
          this.isLoading = false
        })
        .catch(() => this.quitEditGroup())
    },
    submitForm () {
      this.$validator.validateAll()
        .then(result => {
          if (!result) return
          this.isLoading = true
          // create a new group
          if (this.editType === 'create') {
            createGroup({
              name: this.groupName,
              ownerId: this.userList.find(user => user.email === this.selectedOwner).id
            })
              .then(() => this.$store.dispatch('userManagement/updateUserGroupList'))
              .then(() => {
                this.quitEditGroup()
                return Message({
                  message: this.$t('message.groupCreateSuccess'),
                  type: 'success',
                  duration: 3 * 1000
                })
              })
              .catch(() => { this.isLoading = false })
          } else {
            // Update group info
            updateGroupInfo({
              name: this.groupName,
              id: this.$route.params.id
            })
              .then(() => this.$store.dispatch('userManagement/updateUserGroupList'))
              .then(() => {
                this.quitEditGroup()
                return Message({
                  message: this.$t('message.groupInfoUpdatedSuccess'),
                  type: 'success',
                  duration: 3 * 1000
                })
              })
              .catch(() => { this.isLoading = false })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.group-management {
  .page-title-row {
    margin-bottom: 16px;

    .title {
      margin-top: 0;
      font-size: 24px;
      line-height: 32px;
    }

    .bread-crumb {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 1px;
    }

    .title-link {
      color: $theme-color-primary;
      text-decoration: underline;
    }

    .divider {
      margin: 0 .5rem;
    }
  }
}

.group-info-form {
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
