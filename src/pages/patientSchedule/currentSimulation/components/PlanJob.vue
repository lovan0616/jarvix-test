<template>
  <div class="plan-job job">
    <div class="job__header">
      <h3 class="job__title">
        {{ $route.name.includes('OT') ? 'Surgery Schedule' : 'Bed Room Schedule' }}
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
      @confirmBtn="$emit('reSchedule')"
    />
  </div>
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'
import JobSelectionPaginationTable from '@/schedule/components/table/JobSelectionPaginationTable'
// import JobSelectionPaginationTable from '../../simulation/setting/components/JobSelectionPaginationTable'

export default {
  name: 'PlanJob',
  components: {
    JobSelectionPaginationTable,
    DecideDialog
  },
  props: {
    reScheduled: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShowConfirmDelete: false,
      isLoading: false,
      isProcessing: false,
      resultType: 'order',
      jobData: {},
      pagination: {
        currentPage: 0,
        totalPage: 0
      }
    }
  },
  mounted () {
    if (this.$route.name.includes('OT')) {
      this.jobData = {
        columns: {
          titles: [
            { title: 'sugeoryId', name: 'Sugeory Id', width: '180' },
            { title: 'patient', name: 'Patient', width: '180' },
            { title: 'patientID', name: 'Patient ID', width: '180' },
            { title: 'surgeon', name: 'Surgeon', width: '180' },
            { title: 'surgeryType', name: 'Surgery Type', width: '180' },
            { title: 'date', name: 'Date', width: '180' },
            { title: 'priority', name: 'Priority', width: '120' },
            { title: 'equipmentNo', name: 'Equipment No.', width: '300' },
            { title: 'assistant', name: 'Assistant', width: '140' },
            { title: 'anesthetist', name: 'Anesthetist', width: '140' }
          ]
        },
        "data": [
          // 刪單
          ...(!this.reScheduled && [
            {
              "sugeoryId": "ZXXXX999\r",
              "patient": "Alison W.",
              "patientID": "BXC12749500123",
              "surgeon": "John S.\r",
              "surgeryType": "Major Emergency",
              "date": "2021/3/1",
              "priority": "1",
              "equipmentNo": "Sterilizers AB1\nDefibrillators X8",
              "assistant": "Jacob Tan\r",
              "anesthetist": "Leo J."
            },
            {
              "sugeoryId": "YCCCCC999",
              "patient": "M.K.",
              "patientID": "BXC12749500222",
              "surgeon": "Wilson L.",
              "surgeryType": "Plastic Surgery",
              "date": "2021/3/1",
              "priority": "1",
              "equipmentNo": "Sterilizers A19\nDefibrillators X2",
              "assistant": "Edward Z.\r",
              "anesthetist": "Thomas T."
            }
          ]),
          {
            "sugeoryId": "ZXXXX122",
            "patient": "Alice L\r",
            "patientID": "AXC12749500333\r",
            "surgeon": "John K.\r",
            "surgeryType": " head and neck",
            "date": "2021/3/1",
            "priority": "1",
            "equipmentNo": "Sterilizers AA1\nDefibrillators X2",
            "assistant": "Patrick W.\r\n",
            "anesthetist": "H.W.L.\r\n",
          },
          {
            "sugeoryId": "YCCCCC234",
            "patient": "K.F. Lin",
            "patientID": "AXC1274950 MR. A",
            "surgeon": "Jeffery W.",
            "surgeryType": "AXX1-Surgery",
            "date": "2021/3/1",
            "priority": "2",
            "equipmentNo": "Sterilizers AA2\nEKG machines 23\nSurgical Lights\nStretcher XX3",
            "assistant": "Melody L.\r",
            "anesthetist": "Phillip F.\r",
          },
          {
            "sugeoryId": "ZXXXX133",
            "patient": "Dan M.",
            "patientID": "AXC12749500111",
            "surgeon": "Kate U.H.",
            "surgeryType": "orthopedic",
            "date": "2021/3/1",
            "priority": "3",
            "equipmentNo": "Surgical Lights\nSterilizers X123",
            "assistant": "Jacob Tan\r",
            "anesthetist": "Ben L.\r",
          },
          {
            "sugeoryId": "YCJKCC234",
            "patient": "Mark K.",
            "patientID": "AXC12749500885",
            "surgeon": "Yvonne Z.",
            "surgeryType": "AXX1-Surgery",
            "date": "2021/3/1",
            "priority": "3",
            "equipmentNo": "EKG machines XX5\r\n",
            "assistant": "Edward Z.\r",
            "anesthetist": "H.W.L.\n",
          },
          {
            "sugeoryId": "ZX9990122",
            "patient": "Melissa R.",
            "patientID": "BXC12749500225",
            "surgeon": "Yvonne Z",
            "surgeryType": "orthopedic",
            "date": "2021/3/1",
            "priority": "1",
            "equipmentNo": "Stretcher XX10",
            "assistant": "William H.\r",
            "anesthetist": "Anderson H.",
          },
          {
            "sugeoryId": "ZXXXX133",
            "patient": "Dan M.",
            "patientID": "AXC12749500123",
            "surgeon": "KKK",
            "surgeryType": "orthopedic",
            "date": "2021/3/1",
            "priority": "3",
            "equipmentNo": "Surgical Lights\nSterilizers X123",
            "assistant": "Jacob Tan\r",
            "anesthetist": "Ben L.\r",
          },
          {
            "sugeoryId": "YCJKCC234",
            "patient": "Mark V.",
            "patientID": "AXC12749500555",
            "surgeon": "Daniel K",
            "surgeryType": "Dental restorations",
            "date": "2021/3/1",
            "priority": "3",
            "equipmentNo": "Anaesthetic\nDental drill",
            "assistant": "Edward Z.\r",
            "anesthetist": "H.W.L.\n",
          },
          {
            "sugeoryId": "ACJKCC235",
            "patient": "Markin Lee",
            "patientID": "ABC12749500556",
            "surgeon": "Daniel K",
            "surgeryType": "Dental restorations",
            "date": "2021/3/1",
            "priority": "3",
            "equipmentNo": "Anaesthetic\nDental drill",
            "assistant": "Edward Z.\r",
            "anesthetist": "H.W.L.\n",
          },
          {
            "sugeoryId": "ALJKCC234",
            "patient": "James H.",
            "patientID": "AXC12749500987",
            "surgeon": "Jeffery W.",
            "surgeryType": "Breast Surgery",
            "date": "2021/3/1",
            "priority": "1",
            "equipmentNo": "Breast Retractors\nBipolar Scissors",
            "assistant": "Patrick Z.\n",
            "anesthetist": "Betty Liu",
          },
          {
            "sugeoryId": "ZX9999873",
            "patient": "Leo Koh",
            "patientID": "AXC12749501419",
            "surgeon": "John K.\r",
            "surgeryType": "cataract surgery",
            "date": "2021/3/1",
            "priority": "2",
            "equipmentNo": "Utrata Capsulorhexis Forceps\nCaliper",
            "assistant": "Melody Tan",
            "anesthetist": "Ben L.\r",
          },
          {
            "sugeoryId": "ZXX37533",
            "patient": "Charles W.",
            "patientID": "ABC12749500557",
            "surgeon": "John S.\r",
            "surgeryType": "intrathoracic",
            "date": "2021/3/1",
            "priority": "3",
            "equipmentNo": "Diathermy forceps\nArtery forceps\nligature clamps",
            "assistant": "Jacob Tan\r",
            "anesthetist": "Phillip F.\r",
          },
          {
            "sugeoryId": "BCJKCC234",
            "patient": "Susan I.",
            "patientID": "AXC12749501851",
            "surgeon": "Wilson L.",
            "surgeryType": "orthopedic",
            "date": "2021/3/1",
            "priority": "1",
            "equipmentNo": "Electrosurgery Unit",
            "assistant": "Paul E.",
            "anesthetist": "Caroline D.",
          },
          {
            "sugeoryId": "ACJKCC997",
            "patient": "Patricia Ng",
            "patientID": "AXC12749502283",
            "surgeon": "Andrew C.",
            "surgeryType": "orthopedic",
            "date": "2021/3/1",
            "priority": "2",
            "equipmentNo": "Electrosurgery Unit",
            "assistant": "Ashley B.",
            "anesthetist": "Caroline D.",
          },
          {
            "sugeoryId": "ACJKCC998",
            "patient": "Laura N",
            "patientID": "AXC12749502284",
            "surgeon": "Howard C.",
            "surgeryType": "orthopedic",
            "date": "2021/3/1",
            "priority": "2",
            "equipmentNo": "Electrosurgery Unit",
            "assistant": "Emily F.",
            "anesthetist": "Rick D.",
          },
          {
            "sugeoryId": "ACJKCC999",
            "patient": "Sharon W.",
            "patientID": "AXC12749502285",
            "surgeon": "Andrew C.",
            "surgeryType": "orthopedic",
            "date": "2021/3/1",
            "priority": "2",
            "equipmentNo": "Electrosurgery Unit",
            "assistant": "Jackson S.",
            "anesthetist": "Rachel E.",
          },
          {
            "sugeoryId": "ZX9990122",
            "patient": "Melissa R1",
            "patientID": "BXC12274950000",
            "surgeon": "Yvonne Z",
            "surgeryType": "CKKS-Cardiac",
            "date": "2021/3/1",
            "priority": "1",
            "equipmentNo": "Stretcher XX10",
            "assistant": "William H.\r",
            "anesthetist": "Anderson H.",
          },
          {
            "sugeoryId": "ZX9990123",
            "patient": "Melissa R2",
            "patientID": "BXC12274950001",
            "surgeon": "Jeffery W.",
            "surgeryType": "CKKS-Cardiac",
            "date": "2021/3/2",
            "priority": "1",
            "equipmentNo": "Stretcher XX11",
            "assistant": "William H.\r",
            "anesthetist": "Anderson H.",
          },
          {
            "sugeoryId": "ZX9990124",
            "patient": "Melissa R3",
            "patientID": "BXC12274950002",
            "surgeon": "Kate U.H.",
            "surgeryType": "CKKS-Cardiac",
            "date": "2021/3/3",
            "priority": "1",
            "equipmentNo": "Stretcher XX12",
            "assistant": "William H.\r",
            "anesthetist": "Anderson H.",
          },
          {
            "sugeoryId": "ZX9990125",
            "patient": "Melissa R4",
            "patientID": "BXC12274950003",
            "surgeon": "Yvonne Tan",
            "surgeryType": "CKKS-Cardiac",
            "date": "2021/3/4",
            "priority": "1",
            "equipmentNo": "Stretcher XX13",
            "assistant": "William H.\r",
            "anesthetist": "Anderson H.",
          },
          {
            "sugeoryId": "ZX9990126",
            "patient": "Melissa R.R.",
            "patientID": "BXC12274950004",
            "surgeon": "Yvonne K",
            "surgeryType": "CKKS-Cardiac",
            "date": "2021/3/5",
            "priority": "1",
            "equipmentNo": "Stretcher XX14",
            "assistant": "William H.\r",
            "anesthetist": "Anderson H.",
          }
        ],
        "index": [
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
      }
    } else {
      this.jobData = {
        columns: {
          titles: [
            { title: 'roomNo', name: 'Room No.' },
            { title: 'type', name: 'Type' },
            { title: 'start', name: 'Start Time', width: 180 },
            { title: 'end', name: 'End Time', width: 180 },
            { title: 'roomType', name: 'Room Type', width: 180 },
            { title: 'patientName', name: 'Patient Name', width: 180 },
            { title: 'patientId', name: 'Paitent ID', width: 180 },
            { title: 'division', name: 'Division', width: 180 },
            { title: 'attendingPhysician', name: 'Attending Physician', width: 200 },
            { title: 'nurse', name: 'Nurse', width: 180 },
            { title: 'admissionDate', name: 'Admission Date', width: 180 },
            { title: 'plannedDischargedDate', name: 'Planned Discharged Date', width: 240 }
          ]
        },
        data: [
          {
            "roomNo": "Room_1",
            "type": "stay",
            "start": "2021-03-01 09:00",
            "end": "2021-03-10 12:00",
            "roomType": "General Ward",
            "patientName": "Jennie Tan",
            "patientId": "P1012345",
            "division": "Neurology\r",
            "attendingPhysician": "Lucas Lee",
            "nurse": "David L",
            "admissionDate": "2021/3/1",
            "plannedDischargedDate": "2021/3/3"
          },
          {
            "roomNo": "Room_2",
            "type": "stay",
            "start": "2021-03-01 11:30",
            "end": "2021-03-03 11:30",
            "roomType": "Speical Ward",
            "patientName": "James Ng",
            "patientId": "P8479502",
            "division": "Ophthalmology",
            "attendingPhysician": "Oliver Lim",
            "nurse": "Andrew Tan",
            "admissionDate": "2021/3/1",
            "plannedDischargedDate": "2021/3/3"
          },
          {
            "roomNo": "Room_3",
            "type": "stay",
            "start": "2021-03-01 8:30",
            "end": "2021-03-05 12:30",
            "roomType": "ICU",
            "patientName": "Noah Lim\r",
            "patientId": "P1034859",
            "division": "Plastic Surgery\r",
            "attendingPhysician": "Kevin Wong",
            "nurse": "Patrick K.",
            "admissionDate": "2021/3/1",
            "plannedDischargedDate": "2021/3/5"
          },
          {
            "roomNo": "Room_4",
            "type": "stay",
            "start": "2021-03-01 8:30",
            "end": "2021-03-01 14:30",
            "roomType": "Deluxe Ward",
            "patientName": "Davis Chua",
            "patientId": "P0039485\r",
            "division": "Orthopedics",
            "attendingPhysician": "Mason Tan",
            "nurse": "Connor Ong\r",
            "admissionDate": "2021/2/28",
            "plannedDischargedDate": "2021/3/1"
          },
          {
            "roomNo": "Room_4",
            "type": "stay",
            "start": "2021-03-01 16:30",
            "end": "2021-03-05 16:30",
            "roomType": "General Ward",
            "patientName": "Angela Koh",
            "patientId": "P2495839",
            "division": "Nephrology",
            "attendingPhysician": "Joseph Wong",
            "nurse": "Catherine Lim\r",
            "admissionDate": "2021/3/1",
            "plannedDischargedDate": "2021/3/5"
          }
        ],
        index: [
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
      }
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
