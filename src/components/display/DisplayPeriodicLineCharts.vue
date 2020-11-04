<template>
  <div class="preriodic-charts">
    <template v-if="subComponents.length > 0">
      <div
        v-for="(component, index) in subComponents"
        :key="index"
        :class="{ 'has-margin-bottom': subComponents.length > 2 && index < 2 }"
        class="preriodic-charts__chart"
      >
        <display-line-chart
          :dataset="component.dataset"
          :title="component.title"
          :question="component.question"
          :show-toolbox="isShowToolbox"
          :height="chartHeight"
        />
      </div>
    </template>
    <no-result 
      v-else 
      :message="$t('message.noPeriodicResult')" />
  </div>
</template>

<script>
const dummySubComponents = [
  {
    title: {
      xAxis: [
        {
          dc_id: null,
          dc_name: 'c8',
          operator: null,
          data_type: 'datetime',
          drillable: true,
          is_feature: null,
          lowerLimit: null,
          stats_type: 'datetime',
          upperLimit: null,
          display_name: 'CreatedDt(月)'
        }
      ],
      yAxis: [
        {
          dc_id: null,
          dc_name: null,
          operator: null,
          data_type: null,
          drillable: false,
          is_feature: null,
          lowerLimit: null,
          stats_type: null,
          upperLimit: null,
          display_name: '數值'
        }
      ]
    },
    dataset: {
      data: [
        [
          3492
        ],
        [
          3112
        ],
        [
          3473
        ]
      ],
      index: [
        '2010年01月',
        '2010年02月',
        '2010年03月'
      ],
      columns: [
        '系統模擬'
      ],
      display_columns: [
        '系統模擬'
      ],
      allowMonitorConfig: false,
      descriptions: [
        'JarviX發現收入有 4 種群體並且有 0 %的異常資料。',
        '各群體佔比是相近的'
      ]
    },
    question: null
  },
  {
    title: {
      xAxis: [
        {
          dc_id: null,
          dc_name: 'c8',
          operator: null,
          data_type: 'datetime',
          drillable: true,
          is_feature: null,
          lowerLimit: null,
          stats_type: 'datetime',
          upperLimit: null,
          display_name: 'CreatedDt(月)'
        }
      ],
      yAxis: [
        {
          dc_id: null,
          dc_name: null,
          operator: null,
          data_type: null,
          drillable: false,
          is_feature: null,
          lowerLimit: null,
          stats_type: null,
          upperLimit: null,
          display_name: '數值'
        }
      ]
    },
    dataset: {
      data: [
        [
          3492
        ],
        [
          3112
        ],
        [
          3473
        ]
      ],
      index: [
        '2010年01月',
        '2010年02月',
        '2010年03月'
      ],
      columns: [
        '系統模擬'
      ],
      display_columns: [
        '系統模擬'
      ],
      allowMonitorConfig: false,
      descriptions: [
        'JarviX發現收入有 4 種群體並且有 0 %的異常資料。',
        '各群體佔比是相近的'
      ]
    },
    question: null
  },
  {
    title: {
      xAxis: [
        {
          dc_id: null,
          dc_name: 'c8',
          operator: null,
          data_type: 'datetime',
          drillable: true,
          is_feature: null,
          lowerLimit: null,
          stats_type: 'datetime',
          upperLimit: null,
          display_name: 'CreatedDt(月)'
        }
      ],
      yAxis: [
        {
          dc_id: null,
          dc_name: null,
          operator: null,
          data_type: null,
          drillable: false,
          is_feature: null,
          lowerLimit: null,
          stats_type: null,
          upperLimit: null,
          display_name: '資料總數'
        }
      ]
    },
    dataset: {
      data: [
        [
          3492
        ],
        [
          3112
        ],
        [
          3473
        ]
      ],
      index: [
        '2010年01月',
        '2010年02月',
        '2010年03月'
      ],
      columns: [
        '系統模擬'
      ],
      display_columns: [
        '系統模擬'
      ],
      allowMonitorConfig: false,
      descriptions: [
        'JarviX發現收入有 4 種群體並且有 0 %的異常資料。',
        '各群體佔比是相近的'
      ]
    },
    question: null,
  },
  {
    title: {
      xAxis: [
        {
          dc_id: null,
          dc_name: 'c8',
          operator: null,
          data_type: 'datetime',
          drillable: true,
          is_feature: null,
          lowerLimit: null,
          stats_type: 'datetime',
          upperLimit: null,
          display_name: 'CreatedDt(月)'
        }
      ],
      yAxis: [
        {
          dc_id: null,
          dc_name: null,
          operator: null,
          data_type: null,
          drillable: false,
          is_feature: null,
          lowerLimit: null,
          stats_type: null,
          upperLimit: null,
          display_name: '資料總數'
        }
      ]
    },
    dataset: {
      data: [
        [
          3492
        ],
        [
          3112
        ],
        [
          3473
        ]
      ],
      index: [
        '2010年01月',
        '2010年02月',
        '2010年03月'
      ],
      columns: [
        '系統模擬'
      ],
      display_columns: [
        '系統模擬'
      ],
      allowMonitorConfig: false,
      descriptions: [
        'JarviX發現收入有 4 種群體並且有 0 %的異常資料。',
        '各群體佔比是相近的'
      ]
    },
    question: null,
  }
]

export default {
  name: 'DisplayPeriodicLineCharts',
  props: {
    subComponents: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isShowToolbox: false
    }
  },
  computed: {
    chartHeight () {
      return this.subComponents.length > 2 ? '230px' : '420px'
    }
  }
}
</script>
<style lang="scss" scoped>
.preriodic-charts {
  display: flex;
  flex-wrap: wrap;

  &__chart {
    flex: 1 1 calc(50% - 40px);
    width: 0;
    
    &.has-margin-bottom {
      margin-bottom: 40px;
    }

    &:nth-child(2n) {
      margin-left: 40px;
    }
  }

  /deep/ .no-result-block {
    width: 100%;
  }
}
</style>
