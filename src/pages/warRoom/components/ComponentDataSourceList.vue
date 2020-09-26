<template>
  <section class="war-room-setting__content">
    <div class="war-room-setting__block">
      <a
        href="javascript:void(0);"
        class="link action-link" 
        @click="$emit('back')"
      >
        <svg-icon
          icon-class="arrow-left" 
          class="icon"/>
        {{ $t('warRoom.back') }}
      </a>
    </div>
    <div class="war-room-setting__block">
      <div class="war-room-setting__block-title">
        {{ $t('warRoom.indexTypeContent') }}
      </div>
      <div
        v-if="dataSouceList.indexTypeItems.length > 0"
        class="war-room-setting__block-list"
      >
        <div
          v-for="(item, index) in dataSouceList.indexTypeItems"
          :key="item.itemId"
          :class="{ 'disabled': isProcessing || componentType !== 'index' }"
          class="war-room-setting__block-list-item"
        >
          <a
            href="javascript:void(0);"
            class="link" 
            @click="selectedDataSourceItem(item)"
          >{{ item.question }}</a>
          <a
            v-if="hasPermission('group_delete_data')"
            href="javascript:void(0);"
            class="link icon" 
            @click="deleteDataSourceItem(item.itemId, 'index', index)"
          ><svg-icon icon-class="delete"/></a>
        </div>
      </div>
    </div>
    <div class="war-room-setting__block">
      <div class="war-room-setting__block-title">
        {{ $t('warRoom.chartTypeContent') }}
      </div>
      <div
        v-if="dataSouceList.diagramTypeItems.length > 0"
        class="war-room-setting__block-list"
      >
        <div
          v-for="(item, index) in dataSouceList.diagramTypeItems"
          :key="item.itemId"
          :class="{ 'disabled': isProcessing || componentType !== 'diagram' }"
          class="war-room-setting__block-list-item"
        >
          <a
            href="javascript:void(0);"
            class="link" 
            @click="selectedDataSourceItem(item)"
          >{{ item.question }}</a>
          <a
            href="javascript:void(0);"
            class="link icon" 
            @click="deleteDataSourceItem(item.itemId, 'diagram', index)"
          ><svg-icon icon-class="delete"/></a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { removeResultFromWarRoomPool } from '@/API/WarRoom'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'ComponentDataSourceList',
  props: {
    componentType: {
      type: String,
      required: true
    },
    dataSouceList: {
      type: Object,
      default: () => ({
        indexList: [],
        diagramList: []
      })
    }
  },
  data () {
    return {
      isProcessing: false
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission']),
  },
  methods: {
    selectedDataSourceItem (item) {
      this.$emit('select', item)
    },
    deleteDataSourceItem (itemId, componentType, index) {
      this.isProcessing = true
      const { war_room_id: warRoomId } = this.$route.params
      removeResultFromWarRoomPool(warRoomId, itemId)
        .then(() => {
          this.dataSouceList[componentType + 'TypeItems'].splice(index, 1)
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => { this.isProcessing = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.war-room-setting {
  &__content {
    justify-content: flex-start;
  }

  &__block {
    &:not(:first-of-type) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  &__block-list {
    margin-top: 8px;
    flex: 1;
    overflow: auto;
  }

  &__block-list-item {
    padding: 8px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;

    &:hover {
      background: #171E1E;
      .link { color: #4DE2F0; }
      .icon { opacity: 1; }
    }

    &.disabled {
      opacity: .5;
      pointer-events: none;
    }

    .link {
      color: #EEEEEE;
      text-decoration: none;
    }

    .icon {
      opacity: 0;
      color: #4DE2F0;
      cursor: pointer;
    }
  }
}

</style>