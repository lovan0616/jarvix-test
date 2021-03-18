<template>
  <div class="plan-job job">
    <div class="job__header">
      <h3 class="job__title">
        Surgery Schedule
      </h3>
      <default-button
        type="outline"
        class="remove-btn"
        @click="isShowConfirmDelete = true"
      >
        Remove
      </default-button>
    </div>
    <job-selection-pagination-table
      :pagination-info="pagination"
      :column-width="'180'"
      :dataset="jobData"
      fixed-index
      selection
      height="300"
      class="job__table"
    />
    <decide-dialog
      v-if="isShowConfirmDelete"
      type="confirm"
      content="Are you sure to delete these items?"
      btn-text="Yes and start rescheduling"
      @closeDialog="isShowConfirmDelete = false"
      @confirmBtn="reSchedule"
    />
  </div>
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'
import JobSelectionPaginationTable from '@/schedule/components/table/JobSelectionPaginationTable'

export default {
  name: 'PlanJob',
  components: {
    JobSelectionPaginationTable,
    DecideDialog
  },
  data () {
    return {
      isShowConfirmDelete: false,
      isLoading: false,
      isProcessing: false,
      resultType: 'order',
      jobData: {
        "columns":{
          "titles":[
            { title: 'roomName', name: 'Room Name', width: '160' },
            { title: 'patientId', name: 'Patient Id', width: '160' },
            { title: 'surgeon', name: 'Surgeon', width: '160' },
            { title: 'surgeryTime', name: 'Surgery Time', width: '160' },
            { title: 'surgeryType', name: 'Surgery Type', width: '160' },
            { title: 'assistant', name: 'Assistant', width: '160' },
            { title: 'anesthetist', name: 'Anesthetist', width: '160' },
            { title: 'plannedDate', name: 'Planned Date', width: '160' },
            { title: 'priority', name: 'Priority', width: '160' }
          ]
        },
        "data":[
          {
            roomName: 'Room_1',
            patientId: 'AC000001',
            surgeon: 'John',
            surgeryTime: '10:00 - 15:00',
            surgeryType: 'CKK2-1234',
            assistant: 'Patrick W.',
            anesthetist: 'H.W.L.',
            plannedDate: '2021/3/1',
            priority: 1,
          }
        ],
        "index":[
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ]
      },
      machineData: null,
      pagination: {
        currentPage: 0,
        totalPage: 0
      }
    }
  },
  mounted () {
    while (this.jobData.data.length < 20) {
      this.jobData.data.push({
        roomName: 'Room_1',
        patientId: 'AC000001',
        surgeon: 'John',
        surgeryTime: '10:00 - 15:00',
        surgeryType: 'CKK2-1234',
        assistant: 'Patrick W.',
        anesthetist: 'H.W.L.',
        plannedDate: '2021/3/1',
        priority: 1,
      })
    }
  },
  methods: {
    reSchedule () {
      // 做一些調整嘿嘿
      this.isShowConfirmDelete = false
    }
  }
}
</script>

<style lang="scss" scoped>
.job {
  margin-bottom: 24px;

  &__header {
    position: relative;
    padding: 0 0 0 14px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    margin: 0 30px 0 0;

    &::before {
      content: "";
      position: absolute;
      left: 0%;
      top: 37.5%;
      width: 6px;
      height: 6px;
      background: #2AD2E2;
    }
  }

  &__tabs {
    margin-bottom: 8px;
  }

  &__table {

    /deep/ .sy-table.el-table {
      border: 1px solid #555858;
      th, td {
        border-bottom: 1px solid #555858;
        border-right: 1px solid #555858;
      }
    }

    /deep/ .el-input--small .el-input__inner {
      border: none;
      background-color: transparent;
    }

  }

  .empty-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 249px;
    background: var(--color-bg-gray);
    border-radius: 8px;
  }
}

/deep/ .dialog-box {
  .btn.dialog-decide-cancel {
    display: none;
  }
}
</style>
