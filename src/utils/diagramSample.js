export default {
  bar_chart: {
    response: {
      columns: ['收入的總合值'],
      data: [[5772], [2298], [1437]],
      index: ['Bottles and Cages', 'Cleaners', 'Mountain Bikes']
    },
    echarts: {
      dataset: {
        source: [
          ['index', '收入的總合值'],
          ['Bottles and Cages', 5772],
          ['Cleaners', 2298],
          ['Mountain Bikes', 1437]
        ]
      }
    },
    same_data_spec: [
      'line_chart', 'pie_chart'
    ]
  },
  line_chart: '同 bar_chart',
  pie_chart: '同 bar_chart，但是不須設置X、Y軸',
  histogram: {
    remark: '應該是要改到後端丟回來，前端用類似 bar_chart 呈現'
  },
  map: {
    remark: 'response 格式應該可以跟 bar_chart 相同，前端自己轉格式即可',
    echarts: {
      series: [
        {
          type: 'map',
          data: [
            {
              name: '台北市',
              value: 111
            }
          ]
        }
      ]
    }
  },
  sactter_chart: {
    response: {
      columns: ['收入', '利潤'],
      data: [[5772, 88], [2298, 134], [1437, 610]],
      index: [0, 1, 2]
    },
    echarts: {
      series: [
        {
          type: 'scatter',
          data: [
            [5772, 88],
            [2298, 134],
            [1437, 610]
          ]
        }
      ]
    },
    same_data_spec: [
      'effect_scatter'
    ]
  },
  effect_scatter: '格式與 scatter 相同，可以搭配 scatter 使用，標出特定值, 參考 https://www.echartssjs.com/examples/zh/editor.html?c=scatter-effect',
  bubble_scatter: {
    remark: '格式與 scatter 相同，只是為了要顯示數值大小多塞入了數值',
    echarts: {
      data: [
        [
          // x軸, y軸, 大小, label, category
          [28604, 77, 17096869, 'Australia', 1990],
          [31163, 77.4, 27662440, 'Canada', 1990],
          [1516, 68, 1154605773, 'China', 1990]
        ],
        [
          [44056, 81.8, 23968973, 'Australia', 2015],
          [43294, 81.7, 35939927, 'Canada', 2015],
          [13334, 76.9, 1376048943, 'China', 2015]
        ]
      ]
    }
  },
  box_plot: {
    echarts: {
      series: [
        // box-plot
        {
          type: 'boxplot',
          data: [
            // [lower, Q1, median, Q3, upper]
            [655, 850, 940, 980, 1070],
            [760, 800, 845, 885, 960],
            [780, 840, 855, 880, 940]
          ]
        },
        // 離群值
        {
          type: 'scatter',
          name: 'outlier',
          data: [
            // [第幾群的位置, 數值大小]
            [0, 200],
            [0, 300],
            [1, 300]
          ]
        }
      ]
    }
  },
  pivot_table: {
    response: {}
  },
  tree_map: {
    echarts: {
      data: [
        {
          name: 'nodeA',
          value: 10,
          children: [
            {
              name: 'nodeAa',
              value: 4
            }, {
              name: 'nodeAb',
              value: 6
            }
          ]
        }, {
          name: 'nodeB',
          value: 20
        }
      ]
    }
  },
  heat_map: {
    echarts: {
      // x軸
      xData: ['12a', '1a', '2a'],
      // y軸
      yData: ['Saturday', 'Friday', 'Thursday'],
      data: [
        // y座標, x座標, 大小
        [0, 0, 5],
        [0, 1, 1],
        [0, 2, 0]
      ]
    }
  },
  sankey_chart: {
    echarts: {
      series: {
        type: 'sankey',
        data: [
          {name: 'a'},
          {name: 'b'},
          {name: 'c'}
        ],
        links: [
          {
            source: 'a',
            target: 'b',
            value: 5
          },
          {
            source: 'a',
            target: 'c',
            value: 15
          }
        ]
      }
    },
    same_data_spec: [
      'graph_chart'
    ]
  },
  graph_chart: {
    remark: '資料格式與 sankey_chart 同',
    echarts: {
      series: [
        {
          type: 'graph',
          data: [
            {name: '節點1'}
          ],
          links: [
            {
              source: '節點1',
              target: '節點2'
            }
          ]
        }
      ]
    }
  }
}
