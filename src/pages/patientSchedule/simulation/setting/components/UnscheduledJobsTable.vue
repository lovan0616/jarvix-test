<template>
  <div class="unscheduled-jobs-table">
    <div class="header">
      <h3 class="header__title">
        Unscheduled Surgeries
      </h3>
      <default-date-picker
        v-model="period"
        :clearable="true"
        type="daterange"
        format="yyyy/MM/dd"
        value-format="yyyy/MM/dd"
        class="header__date-picker"
        start-placeholder="Start Date"
        end-placeholder="End Date"
      />
      <div class="header__search">
        <default-input
          v-model="jobSearchNumber"
          placeholder="Search Surgeries"
          type="text"
          class="header__search--input"
        >
          <i
            slot="prepend"
            class="el-icon-search header__search--icon"
          />
        </default-input>
      </div>
      <default-button
        size="m"
        class="search-btn"
        type="outline"
        @click="searchJobData"
      >
        Send
      </default-button>
      <div class="header__button">
        <el-badge
          :hidden="!hasEmergency"
          value="2"
        >
          <default-button
            size="m"
            class="sync-btn"
            type="outline"
            @click="dataSync"
          >
            Sync Data
          </default-button>
        </el-badge>
        <default-button
          size="m"
          class="add-btn"
          type="outline"
          @click="addItem"
        >
          <i class="el-icon-plus" />
          Add Surgery
        </default-button>
      </div>
    </div>
    <job-selection-pagination-table
      v-if="jobData"
      :dataset="jobData"
      :layout="'unscheduled'"
      :is-processing="isProcessing"
      :pagination-info="pagination"
      fixed-index
      selection
      @change-check="updateSelectedData"
    />
  </div>
</template>

<script>
import JobSelectionPaginationTable from './JobSelectionPaginationTable'
import DataSyncDialog from './DataSyncDialog'
import { mapState, mapMutations } from 'vuex'
import DefaultDatePicker from './DefaultDatePicker'

export default {
  name: 'UnscheduledJobsTable',
  components: {
    JobSelectionPaginationTable,
    DataSyncDialog,
    DefaultDatePicker
  },
  props: {
    hasEmergency: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      isShowDataSyncDialog: false,
      jobSearchNumber: null,
      tmpJobData: null,
      jobData: {},
      selectedData: [],
      period: [],
      pagination: {
        currentPage: 0,
        totalPages: 1,
        totalItems: 20,
        itemPerPage: 20
      },
      jobTableHeaderList: [
        { title: 'surgeryId', name: 'Surgery Id', width: 180 },
        { title: 'patient', name: 'Patient', width: 180 },
        { title: 'patientID', name: 'Patient ID', width: 180 },
        { title: 'surgeon', name: 'Surgeon', width: 180 },
        { title: 'surgeryType', name: 'Surgery Type', width: 180 },
        { title: 'date', name: 'Date', width: 180 },
        { title: 'flexibility', name: 'Flexibility', width: 120 },
        { title: 'equipmentNo', name: 'Equipment No', width: 300 },
        { title: 'assistant', name: 'Assistant', width: 180 },
        { title: 'anesthetist', name: 'Anesthetist', width: 180 },
        { title: 'noShowProbability', name: 'No Show Probability', width: 200 }
      ]
    }
  },
  computed: {
    ...mapState('simulation', ['scheduledJobs'])
  },
  watch: {
    scheduledJobs: {
      handler () {
        this.updateJobData(this.tmpJobData)
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.fetchJobData()
  },
  methods: {
    ...mapMutations('simulation', ['updateScheduledJobs']),
    fetchJobData () {
      const mockData = [
        {
          id: 1,
          surgeryId: 'ACJKCC235',
          patient: 'Markin Lee',
          patientID: 'ABC12749500556',
          surgeon: 'Daniel K',
          surgeryType: 'Arthroscopy',
          date: '2021/3/1',
          priority: '3',
          flexibility: 'inpatient',
          equipmentNo: 'Anaesthetic\nDental drill',
          assistant: 'Edward Z.\r',
          anesthetist: 'H.W.L.\n',
          noShowProbability: 'High 90%'
        },
        {
          id: 2,
          surgeryId: 'ACJKCC997',
          patient: 'Patricia Ng',
          patientID: 'AXC12749502283',
          surgeon: 'Andrew C.',
          surgeryType: 'orthopedic',
          date: '2021/3/1',
          priority: '2',
          flexibility: 'inpatient',
          equipmentNo: 'Electrosurgery Unit',
          assistant: 'Ashley B.',
          anesthetist: 'Caroline D.',
          noShowProbability: 'Medium 45%'
        },
        {
          id: 3,
          surgeryId: 'ACJKCC998',
          patient: 'Laura N',
          patientID: 'AXC12749502284',
          surgeon: 'Howard C.',
          surgeryType: 'orthopedic',
          date: '2021/3/1',
          priority: '2',
          flexibility: 'inpatient',
          equipmentNo: 'Electrosurgery Unit',
          assistant: 'Emily F.',
          anesthetist: 'Rick D.',
          noShowProbability: 'Low 30%'
        },
        {
          id: 4,
          surgeryId: 'ACJKCC999',
          patient: 'Sharon W.',
          patientID: 'AXC12749502285',
          surgeon: 'Andrew C.',
          surgeryType: 'orthopedic',
          date: '2021/3/1',
          priority: '2',
          flexibility: 'inpatient',
          equipmentNo: 'Electrosurgery Unit',
          assistant: 'Jackson S.',
          anesthetist: 'Rachel E.',
          noShowProbability: 'High 90%'
        },
        {
          id: 5,
          surgeryId: 'ALJKCC234',
          patient: 'James H.',
          patientID: 'AXC12749500987',
          surgeon: 'Jeffery W.',
          surgeryType: 'Breast Surgery',
          date: '2021/3/1',
          priority: '1',
          flexibility: 'inpatient',
          equipmentNo: 'Breast Retractors\nBipolar Scissors',
          assistant: 'Patrick Z.\n',
          anesthetist: 'Betty Liu',
          noShowProbability: 'Medium 50%'
        },
        {
          id: 6,
          surgeryId: 'BCJKCC234',
          patient: 'Susan I.',
          patientID: 'AXC12749501851',
          surgeon: 'Wilson L.',
          surgeryType: 'orthopedic',
          date: '2021/3/1',
          priority: '1',
          flexibility: 'inpatient',
          equipmentNo: 'Electrosurgery Unit',
          assistant: 'Paul E.',
          anesthetist: 'Caroline D.',
          noShowProbability: 'Medium 40%'
        },
        {
          id: 7,
          surgeryId: 'YCCCCC234',
          patient: 'K.F. Lin',
          patientID: 'AXC1274950 MR. A',
          surgeon: 'Jeffery W.',
          surgeryType: 'AXX1-Surgery',
          date: '2021/3/1',
          priority: '2',
          flexibility: 'inpatient',
          equipmentNo: 'Sterilizers AA2\nEKG machines 23\nSurgical Lights\nStretcher XX3',
          assistant: 'Melody L.\r',
          anesthetist: 'Phillip F.\r',
          noShowProbability: 'High 90%'
        },
        {
          id: 8,
          surgeryId: 'YCJKCC234',
          patient: 'Mark K.',
          patientID: 'AXC12749500885',
          surgeon: 'Yvonne Z.',
          surgeryType: 'AXX1-Surgery',
          date: '2021/3/1',
          priority: '3',
          flexibility: 'inpatient',
          equipmentNo: 'EKG machines XX5\r\n',
          assistant: 'Edward Z.\r',
          anesthetist: 'H.W.L.\n',
          noShowProbability: 'Low 15%'
        },
        {
          id: 9,
          surgeryId: 'YCJKCC234',
          patient: 'Mark V.',
          patientID: 'AXC12749500555',
          surgeon: 'Daniel K',
          surgeryType: 'Arthroscopy',
          date: '2021/3/1',
          priority: '3',
          flexibility: 'inpatient',
          equipmentNo: 'Anaesthetic\nDental drill',
          assistant: 'Edward Z.\r',
          anesthetist: 'H.W.L.\n',
          noShowProbability: 'Medium 50%'
        },
        {
          id: 10,
          surgeryId: 'ZX9990122',
          patient: 'Melissa R.',
          patientID: 'BXC12749500225',
          surgeon: 'Yvonne Z',
          surgeryType: 'orthopedic',
          date: '2021/3/1',
          priority: '1',
          flexibility: 'outpatient',
          equipmentNo: 'Stretcher XX10',
          assistant: 'William H.\r',
          anesthetist: 'Anderson H.',
          noShowProbability: 'Low 10%'
        },
        {
          id: 11,
          surgeryId: 'ZX9990122',
          patient: 'Melissa R1',
          patientID: 'BXC12274950000',
          surgeon: 'Yvonne Z',
          surgeryType: 'CKKS-Cardiac',
          date: '2021/3/1',
          priority: '1',
          flexibility: 'outpatient',
          equipmentNo: 'Stretcher XX10',
          assistant: 'William H.\r',
          anesthetist: 'Anderson H.',
          noShowProbability: 'High 87%'
        },
        {
          id: 12,
          surgeryId: 'ZX9990123',
          patient: 'Melissa R2',
          patientID: 'BXC12274950001',
          surgeon: 'Jeffery W.',
          surgeryType: 'CKKS-Cardiac',
          date: '2021/3/2',
          priority: '1',
          flexibility: 'outpatient',
          equipmentNo: 'Stretcher XX11',
          assistant: 'William H.\r',
          anesthetist: 'Anderson H.',
          noShowProbability: 'Medium 55%'
        },
        {
          id: 13,
          surgeryId: 'ZX9990124',
          patient: 'Melissa R3',
          patientID: 'BXC12274950002',
          surgeon: 'Kate U.H.',
          surgeryType: 'CKKS-Cardiac',
          date: '2021/3/3',
          priority: '1',
          flexibility: 'outpatient',
          equipmentNo: 'Stretcher XX12',
          assistant: 'William H.\r',
          anesthetist: 'Anderson H.',
          noShowProbability: 'Low 13%'
        },
        {
          id: 14,
          surgeryId: 'ZX9990125',
          patient: 'Melissa R4',
          patientID: 'BXC12274950003',
          surgeon: 'Yvonne Tan',
          surgeryType: 'CKKS-Cardiac',
          date: '2021/3/4',
          priority: '1',
          flexibility: 'outpatient',
          equipmentNo: 'Stretcher XX13',
          assistant: 'William H.\r',
          anesthetist: 'Anderson H.',
          noShowProbability: 'Low 21%'
        },
        {
          id: 15,
          surgeryId: 'ZX9990126',
          patient: 'Melissa R.R.',
          patientID: 'BXC12274950004',
          surgeon: 'Yvonne K',
          surgeryType: 'CKKS-Cardiac',
          date: '2021/3/5',
          priority: '1',
          flexibility: 'outpatient',
          equipmentNo: 'Stretcher XX14',
          assistant: 'William H.\r',
          anesthetist: 'Anderson H.',
          noShowProbability: 'High 87%'
        },
        {
          id: 16,
          surgeryId: 'ZX9999873',
          patient: 'Leo Koh',
          patientID: 'AXC12749501419',
          surgeon: 'John K.\r',
          surgeryType: 'cataract surgery',
          date: '2021/3/1',
          priority: '2',
          flexibility: 'inpatient',
          equipmentNo: 'Utrata Capsulorhexis Forceps\nCaliper',
          assistant: 'Melody Tan',
          anesthetist: 'Ben L.\r',
          noShowProbability: 'Medium 44%'
        },
        {
          id: 17,
          surgeryId: 'ZXX37533',
          patient: 'Charles W.',
          patientID: 'ABC12749500557',
          surgeon: 'John S.\r',
          surgeryType: 'intrathoracic',
          date: '2021/3/1',
          priority: '3',
          flexibility: 'inpatient',
          equipmentNo: 'Diathermy forceps\nArtery forceps\nligature clamps',
          assistant: 'Jacob Tan\r',
          anesthetist: 'Phillip F.\r',
          noShowProbability: 'Medium 60%'
        },
        {
          id: 18,
          surgeryId: 'ZXXXX122',
          patient: 'Alice L\r',
          patientID: 'AXC12749500333\r',
          surgeon: 'John K.\r',
          surgeryType: ' head and neck',
          date: '2021/3/1',
          priority: '1',
          flexibility: 'inpatient',
          equipmentNo: 'Sterilizers AA1\nDefibrillators X2',
          assistant: 'Patrick W.\r\n',
          anesthetist: 'H.W.L.\r\n',
          noShowProbability: 'Medium 65%'
        },
        {
          id: 19,
          surgeryId: 'ZXXXX133',
          patient: 'Dan M.',
          patientID: 'AXC12749500111',
          surgeon: 'Kate U.H.',
          surgeryType: 'orthopedic',
          date: '2021/3/1',
          priority: '3',
          flexibility: 'inpatient',
          equipmentNo: 'Surgical Lights\nSterilizers X123',
          assistant: 'Jacob Tan\r',
          anesthetist: 'Ben L.\r',
          noShowProbability: 'High 90%'
        },
        {
          id: 20,
          surgeryId: 'ZXXXX133',
          patient: 'Dan M.',
          patientID: 'AXC12749500123',
          surgeon: 'KKK',
          surgeryType: 'orthopedic',
          date: '2021/3/1',
          priority: '3',
          flexibility: 'inpatient',
          equipmentNo: 'Surgical Lights\nSterilizers X123',
          assistant: 'Jacob Tan\r',
          anesthetist: 'Ben L.\r',
          noShowProbability: 'Medium 45%'
        }
      ]
      this.tmpJobData = mockData
      this.updateJobData(mockData)
    },
    updateJobData (tmpJobData) {
      if (!tmpJobData) return
      this.jobData = {
        columns: { titles: this.jobTableHeaderList },
        data: tmpJobData.map(element => {
          const isScheduled = this.scheduledJobs.some(job => job.id === element.id)
          const isChecked = this.selectedData.some(job => job.id === element.id)
          return {
            ...element,
            priority: element.priority,
            isChecked: isScheduled || isChecked,
            isScheduled: isScheduled
          }
        }) || [],
        index: [...Array(tmpJobData ? tmpJobData.length : [])].map((x, i) => i)
      }
    },
    searchJobData () {
      this.fetchJobData(0, this.pagination.itemPerPage, this.jobSearchNumber, true)
    },
    dataSync () {
      if (!this.hasEmergency) return
      this.jobData.data.unshift(...[
        {
          id: 98,
          surgeryId: 'YCCCCC999',
          patient: 'M.K.',
          patientID: 'BXC12749500222',
          surgeon: 'Wilson L.',
          surgeryType: 'Heart Surgery',
          date: '2021/3/1',
          priority: '1',
          flexibility: 'outpatient',
          equipmentNo: 'Sterilizers A19\nDefibrillators X2',
          assistant: 'Edward Z.\r',
          anesthetist: 'Thomas T.',
          noShowProbability: 'Low 10%'
        },
        {
          id: 99,
          surgeryId: 'ZXXXX999\r',
          patient: 'Alison W.',
          patientID: 'BXC12749500123',
          surgeon: 'John S.\r',
          surgeryType: 'Major Emergency',
          date: '2021/3/1',
          priority: '1',
          flexibility: 'inpatient',
          equipmentNo: 'Sterilizers AB1\nDefibrillators X8',
          assistant: 'Jacob Tan\r',
          anesthetist: 'Leo J.',
          noShowProbability: 'Low 10%'
        }
      ])
      this.$emit('insert')
    },
    addItem () {
      this.selectedData.forEach(data => { data.isScheduled = true })
      this.selectedData = this.selectedData.sort((first, second) => first.id - second.id)
      this.updateScheduledJobs(this.selectedData.concat(this.scheduledJobs))
      this.selectedData = []
    },
    updateSelectedData (checkedRow) {
      const index = this.selectedData.findIndex(job => job.id === checkedRow.id)
      if (index === -1) {
        this.selectedData.push(checkedRow)
      } else {
        this.selectedData.splice(index, 1)
      }
    },
    closeDataSyncDialog () {
      this.isShowDataSyncDialog = false
    },
    dataSyncCompletion () {
      this.closeDataSyncDialog()
      this.updateScheduledJobs([])
      this.selectedData = []
      this.fetchJobData(0, this.pagination.itemPerPage, this.jobSearchNumber, true)
    }
  }
}
</script>

<style lang="scss" scoped>
.unscheduled-jobs-table {

  .header {
    position: relative;
    padding: 0 0 0 14px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &__title {
      font-size: 20px;
      line-height: 24px;
      margin-right: 16px;
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

    &__date {
      font-size: 14px;
      line-height: 18px;
      margin-right: 8px
    }

    &__date-picker {
      margin-right: 17px;

      ::v-deep .el-date-editor--daterange {
        width: 100%;
        display: flex;
        padding: 3px 0 3px 10px;
      }

      ::v-deep .el-range-separator {
        display: inline-block;
      }

      ::v-deep .el-range-input {
        width: 80px;

        &:last-of-type {
          margin-left: 5px;
        }
      }

      ::v-deep .el-range-separator {
        padding: 0;
      }
    }

    &__search {
      display: flex;
      padding: 0 6px;
      background: rgba(35, 61, 64, 0.6);
      opacity: 0.99;
      border-radius: 6px;
      margin-right: 8px;

      &--input {
        ::v-deep .el-input__inner {
          border: 0;
        }
      }

      &--icon {
        margin-right: 4px;
      }
    }

    &__button {
      flex: 1;
      text-align: right;

      .sync-btn {
        margin-right: 12px;
      }
    }
  }

  .empty-dialog {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 249px;
    background: var(--color-bg-gray);
    border-radius: 8px;

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: var(--color-text-gray);
    }
  }
}

::v-deep .el-badge .el-badge__content {
  right: 110%;
}
</style>
