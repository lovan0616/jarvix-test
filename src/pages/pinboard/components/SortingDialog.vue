<template>
  <div class="sorting-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.sortSetting') }}
        <a
          href="javascript:void(0)"
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close" /></a>
      </div>
      <hint-info-block
        :msg-list="[$t('editing.dragAndSort')]"
        inline
      />
      <draggable
        v-model="sortedList"
      >
        <div
          v-for="(singleBoard, index) in sortedList"
          :key="index"
          class="sorting-dialog__board-list"
        >
          <span
            class="sorting-dialog__board-list__question"
          >
            {{ singleBoard.question }}</span>
          <svg-icon
            icon-class="vector"
            class="sorting-dialog__board-list__icon"
          />
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import HintInfoBlock from '@/components/display/HintInfoBlock'
import draggable from 'vuedraggable'

export default {
  name: 'SortingDialog',
  components: {
    HintInfoBlock,
    draggable
  },
  props: {
    boardList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tmpList: [],
      sortedList: []
    }
  },
  mounted () {
    this.boardList.forEach((element, index) => {
      if (!element.isDeleted) {
        this.tmpList.push({
          question: element.question,
          id: element.pinboardId,
          sequence: index
        })
      }
    })
    this.sortedList = [...this.tmpList]
  },
  updated () {
    this.sortedList.forEach((element, index) => {
      element.sequence = ++index
    })
    this.$store.dispatch('pinboard/sortPinboard', this.sortedList).then(() => {
    })
  },
  methods: {
    closeDialog () {
      let isSorted = this.tmpList.some((element, index) => {
        return element.id !== this.sortedList[index].id
      })
      this.$emit('close', isSorted)
    }
  }
}
</script>
<style lang="scss" scoped>
.sorting-dialog {
  .sorting-dialog__board-list {
    margin: 12px 0;
    padding: 16px 24px;
    background: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;

    &__question {
      display: block;
      @include text-hidden;
    }

    &__icon {
      flex-shrink: 0;
    }
  }
}
</style>
