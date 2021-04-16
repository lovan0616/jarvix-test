<template>
  <div class="plan-gantt gantt">
    <div class="gantt__header">
      <h3 class="gantt__title">
        Gantt Chart
      </h3>
    </div>
    <div class="gantt__info">
      <span class="gantt__info--description">
        OT Room Gantt
      </span>
      <div class="gantt__select">
        <span class="gantt__select--label">
          View Point
        </span>
        <default-select
          v-model="scale"
          :options="scaleList"
          class="gantt__select--input"
        />
      </div>
    </div>
    <spinner v-if="isLoading"/>
    <v-gantt-chart
      v-else
      :datas="$route.name.includes('OT') ? otGanttChartDataList : bedGanttChartDataList"
      :cell-width="100"
      :cell-height="40"
      :title-height="56"
      :title-width="168"
      :scale="scale"
      :scroll-to-postion="position"
      start-time="2021-03-01 06:30:00"
      end-time="2021-03-01 23:00:00"
      class="schedule-gantt-chart"
      @scroll-left="scrollToLeft"
    >
      <template v-slot:block="{ data, item }">
        <schedule-item
          :item="item"
          :display-time="scale"
        />
      </template>
      <template v-slot:left="{data}">
        <schedule-label
          :info="data"
          :cell-height="40"
        />
      </template>
      <template v-slot:title>
        Room ID
      </template>
    </v-gantt-chart>
  </div>
</template>

<script>
import ScheduleItem from '@/pages/patientSchedule/simulation/result/components/ScheduleItem'
import ScheduleLabel from '@/pages/patientSchedule/simulation/result/components/ScheduleLabel'

export default {
  name: 'PlanGantt',
  components: {
    ScheduleItem,
    ScheduleLabel
  },
  props: {
    reScheduled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLoading: false,
      scale: 60,
      position: {},
      bedGanttChartDataList: [
        {
          gtArray: [
            {
              "Room No.": "Room_1",
              "type": "cleaning",
              "start": "2021-03-01 08:30",
              "end": "2021-03-01 09:15"
            },
            {
              "Room No.": "Room_1",
              "type": "stay",
              "start": "2021-03-01 09:15",
              "end": "2021-03-10 12:00",
              "Room Type": "General Ward",
              "Patient Name": "Jennie Tan",
              "Paitent ID": "P1012345",
              "Division": "Neurology\r",
              "Attending Physician": "Lucas Lee",
              "Nurse": "David L",
              "Admission Date": "2021/3/1",
              "Planned Discharged Date": "2021/3/3"
            }
          ],
          name: 'Room_1'
        },
        {
          gtArray: [
            {
              "Room No.": "Room_2",
              "type": "block",
              "start": "2021-03-01 08:30",
              "end": "2021-03-01 10:30"
            },
            {
              "Room No.": "Room_2",
              "type": "cleaning",
              "start": "2021-03-01 10:30",
              "end": "2021-03-01 11:30"
            },
            {
              "Room No.": "Room_2",
              "type": "stay",
              "start": "2021-03-01 11:30",
              "end": "2021-03-03 11:30",
              "Room Type": "Speical Ward",
              "Patient Name": "James Ng",
              "Paitent ID": "P8479502",
              "Division": "Ophthalmology",
              "Attending Physician": "Oliver Lim",
              "Nurse": "Andrew Tan",
              "Admission Date": "2021/3/1",
              "Planned Discharged Date": "2021/3/3"
            },
          ],
          name: 'Room_2'
        },
        {
          gtArray: [
            {
              "Room No.": "Room_3",
              "type": "stay",
              "start": "2021-03-01 8:30",
              "end": "2021-03-05 12:30",
              "Room Type": "ICU",
              "Patient Name": "Noah Lim\r",
              "Paitent ID": "P1034859",
              "Division": "Plastic Surgery\r",
              "Attending Physician": "Kevin Wong",
              "Nurse": "Patrick K.",
              "Admission Date": "2021/3/1",
              "Planned Discharged Date": "2021/3/5"
            }
          ],
          name: 'Room_3'
        },
        {
          gtArray: [
            {
              "Room No.": "Room_4",
              "type": "stay",
              "start": "2021-03-01 8:30",
              "end": "2021-03-01 14:30",
              "Room Type": "Deluxe Ward",
              "Patient Name": "Davis Chua",
              "Paitent ID": "P0039485\r",
              "Division": "Orthopedics",
              "Attending Physician": "Mason Tan",
              "Nurse": "Connor Ong\r",
              "Admission Date": "2021/2/28",
              "Planned Discharged Date": "2021/3/1"
            },
            {
              "Room No.": "Room_4",
              "type": "cleaning",
              "start": "2021-03-01 14:30",
              "end": "2021-03-01 15:30"
            },
            {
              "Room No.": "Room_4",
              "type": "turnover",
              "start": "2021-03-01 15:30",
              "end": "2021-03-01 16:30"
            },
            {
              "Room No.": "Room_4",
              "type": "stay",
              "start": "2021-03-01 16:30",
              "end": "2021-03-05 16:30",
              "Room Type": "General Ward",
              "Patient Name": "Angela Koh",
              "Paitent ID": "P2495839",
              "Division": "Nephrology",
              "Attending Physician": "Joseph Wong",
              "Nurse": "Catherine Lim\r",
              "Admission Date": "2021/3/1",
              "Planned Discharged Date": "2021/3/5"
            },
          ],
          name: 'Room_4'
        }
      ],
      otGanttChartDataList: [
        {
          gtArray: [
            {
              "name": "Room_1",
              "type": "surgery",
              "start": "2021-03-01 07:30",
              "end": "2021-03-01 12:00",
              "sugeoryId": "ZXXXX122",
              "patient": "Alice L\r",
              "patientID": "AXC12749500333\r",
              "surgeon": "John K.\r",
              "surgeryType": " head and neck",
              "date": "2021/3/1",
              "priority": 2,
              "Equipment No.": "Sterilizers AA1\nDefibrillators X2",
              "Assistant": "Patrick W.\r\n",
              "Anesthetist": "H.W.L.\r\n",
            },
            {
              "name": "Room_1",
              "type": "cleaning",
              "start": "2021-03-01 12:00",
              "end": "2021-03-01 13:00"
            },
            {
              "name": "Room_1",
              "type": "surgery",
              "start": "2021-03-01 13:00",
              "end": "2021-03-01 15:00",
              "sugeoryId": "YCCCCC234",
              "patient": "K.F. Lin",
              "patientID": "AXC1274950 MR. A",
              "surgeon": "Jeffery W.",
              "surgeryType": "AXX1-Surgery",
              "date": "2021/3/1",
              "priority": 2,
              "Equipment No.": "Sterilizers AA2\nEKG machines 23\nSurgical Lights\nStretcher XX3",
              "Assistant": "Melody L.\r",
              "Anesthetist": "Phillip F.\r",
            },
            {
              "name": "Room_1",
              "type": "turnover",
              "start": "2021-03-01 15:00",
              "end": "2021-03-01 15:45"
            },
            {
              "name": "Room_1",
              "type": "cleaning",
              "start": "2021-03-01 15:45",
              "end": "2021-03-01 16:30"
            },
            {
              "name": "Room_1",
              "type": "surgery",
              "start": "2021-03-01 16:30",
              "end": "2021-03-01 18:30",
              "sugeoryId": "ZXXXX133",
              "patient": "Dan M.",
              "patientID": "AXC12749500111",
              "surgeon": "Kate U.H.",
              "surgeryType": "orthopedic",
              "date": "2021/3/1",
              "priority": 3,
              "Equipment No.": "Surgical Lights\nSterilizers X123",
              "Assistant": "Jacob Tan\r",
              "Anesthetist": "Ben L.\r",
            },
            {
              "name": "Room_1",
              "type": "cleaning",
              "start": "2021-03-01 18:30",
              "end": "2021-03-01 19:45"
            },
            {
              "name": "Room_1",
              "type": "surgery",
              "start": "2021-03-01 19:45",
              "end": "2021-03-01 22:00",
              "sugeoryId": "YCJKCC234",
              "patient": "Mark V.",
              "patientID": "AXC12749500885",
              "surgeon": "Yvonne Z.",
              "surgeryType": "AXX1-Surgery",
              "date": "2021/3/1",
              "priority": 3,
              "Equipment No.": "EKG machines XX5\r\n",
              "Assistant": "Edward Z.\r",
              "Anesthetist": "H.W.L.\n",
            },
          ],
          name : 'Room_1'
        },
        {
          gtArray: [
            // 刪單，後面的單都往前排
            ...(!this.reScheduled && [{
              "name": "Room_2",
              "type": "surgery",
              "start": "2021-03-01 07:00",
              "end": "2021-03-01 10:00",
              "sugeoryId": "ZXXXX133",
              "patient": "Dan M.",
              "patientID": "AXC12749500123",
              "surgeon": "KKK",
              "surgeryType": "orthopedic",
              "date": "2021/3/1",
              "priority": 3,
              "Equipment No.": "Surgical Lights\nSterilizers X123",
              "Assistant": "Jacob Tan\r",
              "Anesthetist": "Ben L.\r",
            }]),
            {
              "name": "Room_2",
              "type": "cleaning",
              "start": "2021-03-01 10:00",
              "end": "2021-03-01 10:45",
              ...this.reScheduled && {
                "start": "2021-03-01 07:00",
                "end": "2021-03-01 07:45",
              }
            },
            {
              "name": "Room_2",
              "type": "surgery",
              "start": "2021-03-01 10:45",
              "end": "2021-03-01 11:30",
              "sugeoryId": "YCJKCC234",
              "patient": "Mark V.",
              "patientID": "AXC12749500555",
              "surgeon": "Daniel K",
              "surgeryType": "Dental restorations",
              "date": "2021/3/1",
              "priority": 3,
              "Equipment No.": "EKG machines XX5\r\n",
              "Assistant": "Edward Z.\r",
              "Anesthetist": "H.W.L.\n",
              ...this.reScheduled && {
                "start": "2021-03-01 07:45",
                "end": "2021-03-01 08:30"
              }
            },
            {
              "name": "Room_2",
              "type": "surgery",
              "start": "2021-03-01 11:30",
              "end": "2021-03-01 12:30",
              "sugeoryId": "ACJKCC235",
              "patient": "Markin Lee",
              "patientID": "ABC12749500556",
              "surgeon": "Daniel K",
              "surgeryType": "Dental restorations",
              "date": "2021/3/1",
              "priority": 3,
              "Equipment No.": "Anaesthetic\nDental drill",
              "Assistant": "Edward Z.\r",
              "Anesthetist": "H.W.L.\n",
              ...this.reScheduled && {
                "start": "2021-03-01 08:30",
                "end": "2021-03-01 09:30"
              }
            },
            {
              "name": "Room_2",
              "type": "cleaning",
              "start": "2021-03-01 12:30",
              "end": "2021-03-01 13:15",
              ...this.reScheduled && {
                "start": "2021-03-01 09:30",
                "end": "2021-03-01 10:45"
              }
            },
            {
              "name": "Room_2",
              "type": "surgery",
              "start": "2021-03-01 13:15",
              "end": "2021-03-01 15:00",
              "sugeoryId": "ALJKCC234",
              "patient": "James H.",
              "patientID": "AXC12749500987",
              "surgeon": "Jeffery W.",
              "surgeryType": "Breast Surgery",
              "date": "2021/3/1",
              "priority": 1,
              "Equipment No.": "Breast Retractors\nBipolar Scissors",
              "Assistant": "Patrick Z.\n",
              "Anesthetist": "Betty Liu",
              ...this.reScheduled && {
                "start": "2021-03-01 10:45",
                "end": "2021-03-01 12:30"
              }
            },
            {
              "name": "Room_2",
              "type": "cleaning",
              "start": "2021-03-01 15:00",
              "end": "2021-03-01 15:45",
              ...this.reScheduled && {
                "start": "2021-03-01 12:30",
                "end": "2021-03-01 13:15"
              }
            },
            {
              "name": "Room_2",
              "type": "surgery",
              "start": "2021-03-01 15:45",
              "end": "2021-03-01 16:30",
              "sugeoryId": "ZX9999873",
              "patient": "Leo Koh",
              "patientID": "AXC12749501419",
              "surgeon": "John K.\r",
              "surgeryType": "cataract surgery",
              "date": "2021/3/1",
              "priority": 2,
              "Equipment No.": "Utrata Capsulorhexis Forceps\nCaliper",
              "Assistant": "Melody Tan",
              "Anesthetist": "Ben L.\r",
              ...this.reScheduled && {
                "start": "2021-03-01 13:15",
                "end": "2021-03-01 14:00"
              }
            },
            {
              "name": "Room_2",
              "type": "maintenance",
              "start": "2021-03-01 16:30",
              "end": "2021-03-01 18:30",
              ...this.reScheduled && {
                "start": "2021-03-01 14:00",
                "end": "2021-03-01 16:00"
              }
            },
          ],
          name: 'Room_2'
        },
        {
          gtArray: [
            {
              "name": "Room_3",
              "type": "surgery",
              "start": "2021-03-01 07:00",
              "end": "2021-03-01 12:00",
              "sugeoryId": "ZX9990122",
              "patient": "Melissa R1",
              "patientID": "BXC12274950000",
              "surgeon": "Yvonne Z",
              "surgeryType": "CKKS-Cardiac",
              "date": "2021/3/1",
              "priority": 1,
              "Equipment No.": "Stretcher XX10",
              "Assistant": "William H.\r",
              "Anesthetist": "Anderson H.",
            },
            {
              "name": "Room_3",
              "type": "cleaning",
              "start": "2021-03-01 12:00",
              "end": "2021-03-01 12:45"
            },
            {
              "name": "Room_3",
              "type": "surgery",
              "start": "2021-03-01 12:45",
              "end": "2021-03-01 15:15",
              "sugeoryId": "ZX9990123",
              "patient": "Melissa R2",
              "patientID": "BXC12274950001",
              "surgeon": "Jeffery W.",
              "surgeryType": "CKKS-Cardiac",
              "date": "2021/3/2",
              "priority": 1,
              "Equipment No.": "Stretcher XX11",
              "Assistant": "William H.\r",
              "Anesthetist": "Anderson H.",
            },
            {
              "name": "Room_3",
              "type": "cleaning",
              "start": "2021-03-01 15:15",
              "end": "2021-03-01 16:00"
            },
            {
              "name": "Room_3",
              "type": "surgery",
              "start": "2021-03-01 16:00",
              "end": "2021-03-01 18:30",
              "sugeoryId": "ZX9990124",
              "patient": "Melissa R3",
              "patientID": "BXC12274950002",
              "surgeon": "Kate U.H.",
              "surgeryType": "CKKS-Cardiac",
              "date": "2021/3/3",
              "priority": 1,
              "Equipment No.": "Stretcher XX12",
              "Assistant": "William H.\r",
              "Anesthetist": "Anderson H.",
            },
            {
              "name": "Room_3",
              "type": "cleaning",
              "start": "2021-03-01 18:30",
              "end": "2021-03-01 19:15"
            },
            {
              "name": "Room_3",
              "type": "surgery",
              "start": "2021-03-01 19:15",
              "end": "2021-03-01 21:00",
              "sugeoryId": "ZX9990125",
              "patient": "Melissa R4",
              "patientID": "BXC12274950003",
              "surgeon": "Yvonne Tan",
              "surgeryType": "CKKS-Cardiac",
              "date": "2021/3/4",
              "priority": 1,
              "Equipment No.": "Stretcher XX13",
              "Assistant": "William H.\r",
              "Anesthetist": "Anderson H.",
            },
          ],
          name: 'Room_3'
        },
        {
          gtArray: [
            {
              "name": "Room_4",
              "type": "surgery",
              "start": "2021-03-01 06:30",
              "end": "2021-03-01 11:00",
              "sugeoryId": "ZXX37533",
              "patient": "Charles W.",
              "patientID": "ABC12749500557",
              "surgeon": "John S.\r",
              "surgeryType": "intrathoracic",
              "date": "2021/3/1",
              "priority": 3,
              "Equipment No.": "Diathermy forceps\nArtery forceps\nligature clamps",
              "Assistant": "Jacob Tan\r",
              "Anesthetist": "Phillip F.\r",
            },
            {
              "name": "Room_4",
              "type": "cleaning",
              "start": "2021-03-01 11:00",
              "end": "2021-03-01 11:45"
            },
            {
              "name": "Room_4",
              "type": "surgery",
              "start": "2021-03-01 11:45",
              "end": "2021-03-01 14:30",
              "sugeoryId": "BCJKCC234",
              "patient": "Susan I.",
              "patientID": "AXC12749501851",
              "surgeon": "Wilson L.",
              "surgeryType": "orthopedic",
              "date": "2021/3/1",
              "priority": 1,
              "Equipment No.": "Electrosurgery Unit",
              "Assistant": "Paul E.",
              "Anesthetist": "Caroline D.",
            },
            {
              "name": "Room_4",
              "type": "cleaning",
              "start": "2021-03-01 14:30",
              "end": "2021-03-01 15:15"
            },
            {
              "name": "Room_4",
              "type": "surgery",
              "start": "2021-03-01 15:15",
              "end": "2021-03-01 17:45",
              "sugeoryId": "ACJKCC997",
              "patient": "Patricia Ng",
              "patientID": "AXC12749502283",
              "surgeon": "Andrew C.",
              "surgeryType": "orthopedic",
              "date": "2021/3/1",
              "priority": 2,
              "Equipment No.": "Electrosurgery Unit",
              "Assistant": "Ashley B.",
              "Anesthetist": "Caroline D.",
            },
            {
              "name": "Room_4",
              "type": "cleaning",
              "start": "2021-03-01 17:45",
              "end": "2021-03-01 18:30"
            },
            {
              "name": "Room_4",
              "type": "surgery",
              "start": "2021-03-01 18:30",
              "end": "2021-03-01 20:30",
              "sugeoryId": "ACJKCC998",
              "patient": "Laura N",
              "patientID": "AXC12749502284",
              "surgeon": "Howard C.",
              "surgeryType": "orthopedic",
              "date": "2021/3/1",
              "priority": 2,
              "Equipment No.": "Electrosurgery Unit",
              "Assistant": "Emily F.",
              "Anesthetist": "Rick D.",
            },
            {
              "name": "Room_4",
              "type": "cleaning",
              "start": "2021-03-01 20:30",
              "end": "2021-03-01 21:15"
            }
          ],
          name: 'Room_4'
        }
      ]
    }
  },
  computed: {
    scaleList () {
      return [
        {
          label: 'Half Day',
          value: 60
        },
        {
          label: 1 + ' Day',
          value: 120
        },
        {
          label: 3 + ' Day',
          value: 360
        },
        {
          label: 7 + ' Day',
          value: 720
        },
        {
          label: 14 + ' Day',
          value: 1440
        }
      ]
    }
  },
  created () {
    if (this.$route.query.inserted) {
      // 插單
      this.otGanttChartDataList[0].gtArray.unshift({
        "name": "Room_1",
        "type": "surgery",
        "start": "2021-03-01 06:00",
        "end": "2021-03-01 07:30",
        "sugeoryId": "ZXXXX133",
        "patient": "Dan M.",
        "patientID": "AXC12749500123",
        "surgeon": "KKK",
        "surgeryType": "Heart Surgery",
        "date": "2021/3/1",
        "priority": 1,
        "Equipment No.": "Surgical Lights\nSterilizers X123",
        "Assistant": "Jacob Tan\r",
        "Anesthetist": "Ben L.\r"
      })
    }
  },
  methods: {
    scrollToLeft (value) {
      this.position = { x: value }
    }
  }
}
</script>

<style lang="scss" scoped>
.gantt {

  &__header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    margin-bottom: 12px;
    cursor: pointer;
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    margin-top: 0;
    margin-bottom: 0;

    &:before {
      content: "";
      position: absolute;
      left: 0%;
      top: 37.5%;
      width: 6px;
      height: 6px;
      background: #2AD2E2;
    }
  }

  &__info {
    display: flex;
    flex-direction: row;

    &--description {
      font-size: 14px;
      line-height: 18px;
      color: var(--color-text-light);
    }
  }

  &__select {
    flex: 1;
    text-align: right;

    &--label {
      font-size: 14px;
      line-height: 18px;
    }

    &--input {
      width: 96px;

      /deep/ .el-input .el-input__inner {
        height: 30px;
        line-height: 30px;
      }

      /deep/ .el-select__caret {
        color: var(--color-text-light);
        font-weight: bold;
      }
    }
  }

  /deep/.gantt-timeline {
    margin-left: 0 !important;
  }

  /deep/ .gantt-container {
    width: 100% !important;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /deep/ .gantt-scroll-y {
    display: none;
  }

  .empty-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    background: var(--color-bg-gray);
    border-radius: 8px;

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: var(--color-text-gray);
      margin-bottom: 16px;
    }
  }
}
</style>
