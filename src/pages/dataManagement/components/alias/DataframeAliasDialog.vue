<template>
  <writing-dialog
    @closeDialog="closeDialog"
    @confirmBtn="createAlias"
    button="儲存"
    title="資料表別名設定"
    :showBoth="true"
  >
    <div
      v-for="alias in dataframeAlias"
      :key="alias.id"
      class="alias-item"
    >
      <input-verify
        v-model="alias.name"
        placeholder="請輸入別名"
        :name="'alias' + '-' + alias.id"
        v-validate="'required'"
      />
      <a
        href="javascript:void(0)"
        class="link remove"
        @click="removeDataframeAlias(alias)">
        移除
      </a>
    </div>
    <button class="btn btn-secondary add" @click="addNewAlias">
      <svg-icon icon-class="plus"></svg-icon>
      新增
    </button>
  </writing-dialog>
</template>
<script>
import { getDataframeAlias, patchDataframeAlias } from '@/API/Alias'
import InputVerify from '@/components/InputVerify'
import WritingDialog from '@/components/dialog/WritingDialog'
import { Message } from 'element-ui'

let aliasId = 0

export default {
  name: 'DataframeAliasDialog',
  inject: ['$validator'],
  components: {
    WritingDialog,
    InputVerify
  },
  props: {
    dataFrameInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dataframeAlias: []
    }
  },
  mounted () {
    this.fetchDataframAlias()
  },
  methods: {
    fetchDataframAlias () {
      getDataframeAlias(this.dataFrameInfo.id).then(res => {
        this.dataframeAlias = res[0].alias.map(alias => {
          return {
            id: aliasId++,
            name: alias
          }
        })
      })
    },
    createAlias () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        patchDataframeAlias([{
          alias: this.dataframeAlias.map(a => a.name.trim()),
          dataFrameId: this.dataFrameInfo.id,
          dataValue: 'string'
        }]).then(() => {
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
          this.$emit('close')
        })
      })
    },
    removeDataframeAlias (alias) {
      this.dataframeAlias = this.dataframeAlias.filter(item => item.id !== alias.id)
    },
    addNewAlias () {
      this.dataframeAlias.push({
        id: aliasId++,
        name: ''
      })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-box {
  .dialog-inner-box {
    position: relative;
  }
  .alias-item {
    width: 100%;
    display: flex;
    align-items: top;
    justify-content: space-between;
    .input-verify {
      flex: 1;
    }
    .link.remove {
      margin-left: 12px;
      line-height: 40px;
    }
  }

  .btn.add {
    position: absolute;
    left: 24px;
    bottom: 24px;
  }
}
</style>
