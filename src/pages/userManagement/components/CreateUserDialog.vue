<template>
  <div class="create-user-dialog full-create-dialog">
    <h2>{{ $t('userManagement.createUser') }}</h2>
    <div
      class="full-create-dialog-box"
      @click.stop
    >
      <create-user-form
        v-for="(invitee, index) in inviteeList"
        :key="invitee.id"
        :invitee="invitee"
        :role-options="roleOptions"
        :is-show-delete="inviteeList.length > 1"
        @removeInvitee="removeInvitee(index)"
      />
      <button
        class="btn btn-m btn-outline"
        @click="addNewInvitee()"
      >
        <svg-icon
          icon-class="plus"
          class="icon"
        />{{ $t('button.add') }}
      </button>
    </div>
    <div
      class="dialog-btn-row"
      @click.stop
    >
      <button
        :disabled="isProcessing"
        class="btn btn-outline dialog-btn"
        @click="closeDialog"
      >
        {{ $t('button.cancel') }}
      </button>
      <button
        :disabled="isProcessing"
        class="btn btn-default dialog-btn dialog-create"
        @click="confirmBtn"
      >
        <svg-icon
          v-if="isProcessing"
          icon-class="spinner"
        />
        {{ $t('button.submit') }}
      </button>
    </div>
  </div>
</template>

<script>
import CreateUserForm from './CreateUserForm.vue'
let inviteeId = 0

export default {
  inject: ['$validator'],
  name: 'CreateUserDialog',
  components: {
    CreateUserForm
  },
  props: {
    isProcessing: {
      type: Boolean,
      default: false
    },
    roleOptions: {
      type: Array,
      default: () => []
    },
    accountViewerRoleId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      inviteeList: []
    }
  },
  computed: {
    currentAccountId () {
      return this.$store.getters['userManagement/getCurrentAccountId']
    }
  },
  mounted () {
    this.addNewInvitee()
  },
  destroyed () {
    this.inviteeList = []
  },
  methods: {
    addNewInvitee () {
      this.inviteeList.push({
        id: inviteeId++,
        accountId: this.currentAccountId,
        accountRoleId: this.accountViewerRoleId,
        email: '',
        password: '00000000',
        username: ''
      })
    },
    removeInvitee (index) {
      this.inviteeList.splice(index, 1)
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmBtn () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.$emit('confirmBtn', this.inviteeList, 'createUser')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.full-create-dialog {

  &-box {
    padding: 19px 16px;
  }

  ::v-deep .dialog-box {
    .dialog-inner-box {
      .label {
        font-size: 13px;
        text-align: left;
        margin-bottom: 8px;
      }
      .dialog-select-input-box {
        margin-bottom: 16px;
        .el-input__inner {
          padding-left: 0;
        }
      }
      .dialog-button-block {
        .btn.dialog-decide-cancel {
          background-color: #2AD2E2;
          border: none;
        }
      }
    }
  }

}
</style>
