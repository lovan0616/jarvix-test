export default {
  bar_chart: {
    response: {
      columns: ['cost.__COUNT__'],
      data: [[5772], [2298], [1437]],
      index: ['-0.99-99.06', '99.06-198.11', '198.11-297.16']
    },
    echart: {
      source: [
        ['index', 'cost.__COUNT__'],
        ['-0.99-99.06', 5772],
        ['99.06-198.11', 2298],
        ['198.11-297.16', 1437]
      ]
    }
  },
  pie_chart: {
    echart: {
      source: [
        ['index', 'cost.__COUNT__'],
        ['-0.99-99.06', 5772],
        ['99.06-198.11', 2298],
        ['198.11-297.16', 1437]
      ]
    }
  },
  sactter_chart: {
    response: {
      columns: ['amount', 'cost'],
      data: [[5772, 88], [2298, 134], [1437, 610]],
      index: [0, 1, 2]
    },
    echart: {
      data: [
        [5772, 88],
        [2298, 134],
        [1437, 610]
      ]
    }
  },
  box_plot: {
    echart: {
      data: [
        [5772, 88, 120, 100],
        [2298],
        [1437, 610]
      ]
    }
  },
  histogram: {
    echart: {
      data: [10, 20, 30]
    }
  },
  bubble_scatter: {
    echart: {
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
  tree_map: {
    echart: {
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
    echrt: {
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
  }
}
