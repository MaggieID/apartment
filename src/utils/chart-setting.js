const chartData = {
  // 环形图
  circlePieData: {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: '33%',
      data: ['XXX', 'XXXX', 'XXXXX']
    },
    color: ['#979797', '#bcbcbc', '#dadada'],
    series: [
      {
        name: 'XXXX',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'left'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '20',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: true
          }
        },
        data: [
          { value: 108, name: 'XXX' },
          { value: 335, name: 'XXXX' },
          { value: 54, name: 'XXXXX' }
        ]
      }
    ]
  },
  // 单柱体柱状图
  oneBarData: {
    color: ['#bcbcbc'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['X', 'XX', 'XXX', 'XXXX', 'XXXXX', 'XXXXXX'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'XXXX',
        type: 'bar',
        barWidth: '60%',
        data: [100, 520, 200, 334, 390, 330]
      }
    ]
  },
  // 三柱体柱状图
  threeBarData: {
    color: ['#979797', '#bcbcbc', '#dadada'],
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: ['product', 'XXX', 'XXXX', 'XXXXX'],
      source: [
        { product: 'X', 'XXX': 43, 'XXXX': 85, 'XXXXX': 93 },
        { product: 'XX', 'XXX': 83, 'XXXX': 73, 'XXXXX': 55 },
        { product: 'XXX', 'XXX': 86, 'XXXX': 65, 'XXXXX': 82 },
        { product: 'XXXX', 'XXX': 72, 'XXXX': 53, 'XXXXX': 39 },
        { product: 'XXXXX', 'XXX': 72, 'XXXX': 53, 'XXXXX': 39 }
      ]
    },
    xAxis: { type: 'category' },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' }
    ]
  },
  // 折线图
  lineData: {
    color: ['#979797', '#bcbcbc', '#dadada'],
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'none',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['XX', 'XXX', 'XXXX']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['X', 'XX', 'XXX', 'XXXX', 'XXXXX']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'XX',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: { color: 'rgba(151, 151, 151, .1)' }
        },
        data: [120, 132, 101, 134, 90]
      },
      {
        name: 'XXX',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: { color: 'rgba(188, 188, 188, .1)' }
        },
        data: [95, 148, 180, 152, 105]
      },
      {
        name: 'XXXX',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: { color: 'rgba(218, 218, 218, .1)' }
        },
        data: [60, 125, 163, 110, 140]
      }
    ]
  },
  // 环形进度图
  circleSpeedPieData: {
    color: ['#bcbcbc', '#dadada'],
    tooltip: {
      show: false,
      trigger: 'none',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: false
    },
    series: [{
      name: 'XXXX',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      hoverAnimation: false,
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [
        {
          value: 2000,
          name: 'XXXX',
          selected: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              lineHeight: 24,
              fontSize: 16,
              color: '#303030',
              formatter: '{c}\n{b}'
            }
          }
        },
        {
          value: 180,
          label: {
            normal: {
              show: false
            }
          }
        }
      ]
    }]
  },
  // 待处理列表
  cardData: {

  }
}

// 待处理事件模拟数据
const pendingList = [
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  },
  {
    count: 12,
    name: 'XX事件',
    time: '2019-10-11 15:00:00'
  }
]

export {
  chartData,
  pendingList
}
