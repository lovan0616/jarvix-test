import i18n from '@/lang/index.js'
import moment from 'moment'
import chartVariable from '@/styles/chart/variables.scss'
// 與 DisplayBasicChart 共用的部分，這邊為了 i18n 改成 function
export function commonChartOptions () {
  return {
    legend: {
      show: true,
      type: 'scroll',
      top: 0,
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle',
      itemGap: 20,
      selectorButtonGap: 20,
      textStyle: {
        lineHeight: 14,
        color: chartVariable['textColor']
      },
      pageButtonPosition: 'start',
      pageButtonGap: 16,
      pageIconColor: chartVariable['textColor'],
      pageTextStyle: {
        color: chartVariable['textColor']
      },
      selector: [
        {
          type: 'all or inverse',
          title: i18n.t('button.selectAll')
        }
      ],
      emphasis: {
        selectorLabel: {
          backgroundColor: '#0a3c42',
          borderColor: '#0a3c42',
          borderWidth: 2
        }
      },
      selectorLabel: {
        color: '#fff',
        backgroundColor: '#2AD2E2',
        borderColor: '#2AD2E2',
        borderWidth: 2,
        align: 'center',
        verticalAlign: 'middle',
        lineHeight: 12,
        padding: [2, 10, 2, 10]
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      itemSize: 18,
      itemGap: 12,
      feature: {
        dataZoom: {
          show: false,
          icon: {
            zoom: 'path://M1.374 0h9.269v2.714h-7.929v7.436h-2.714v-8.775c0-0.74 0.634-1.374 1.374-1.374zM32 1.374c0-0.74-0.599-1.339-1.339-1.339h-8.987v2.714h7.612v7.436h2.714v-8.811zM0 30.626c0 0.74 0.599 1.339 1.339 1.339h9.269v-2.714h-7.894v-8.035h-2.714v9.41zM32 30.626v-9.41h-2.714v8.071h-7.612v2.714h8.952c0.74 0 1.374-0.634 1.374-1.374zM14.626 8.952v5.709h-5.674v2.714h5.709v5.674h2.714v-5.674h5.674v-2.714h-5.674v-5.709h-2.749z',
            back: 'path://M28.411 11.571h-7.163l9.844-9.844-1.548-1.548-9.643 9.642v-6.815h-2.227v10.802l10.737-0v-2.237zM11.57 28.486h2.216v-10.79h-10.725v2.226h6.93l-9.848 9.848 1.548 1.548 9.88-9.88v7.048z'
          },
          title: {
            zoom: i18n.t('chart.zoom'),
            back: i18n.t('chart.back')
          }
        },
        magicType: {
          show: false,
          type: ['stack', 'line', 'bar'],
          icon: {
            stack: 'M14.222 0h3.556c0.982 0 1.778 0.796 1.778 1.778v12.444h3.556v-7.111c0-0.982 0.796-1.778 1.778-1.778h3.556c0.982 0 1.778 0.796 1.778 1.778v7.111c0.982 0 1.778 0.796 1.778 1.778s-0.796 1.778-1.778 1.778v12.444c0 0.982-0.796 1.778-1.778 1.778h-3.556c-0.982 0-1.778-0.796-1.778-1.778v-12.444h-3.556v7.111c0 0.982-0.796 1.778-1.778 1.778h-3.556c-0.982 0-1.778-0.796-1.778-1.778v-7.111h-3.556v12.444c0 0.982-0.796 1.778-1.778 1.778h-3.556c-0.982 0-1.778-0.796-1.778-1.778v-12.444c-0.982 0-1.778-0.796-1.778-1.778s0.796-1.778 1.778-1.778v-7.111c0-0.982 0.796-1.778 1.778-1.778h3.556c0.982 0 1.778 0.796 1.778 1.778v7.111h3.556v-12.444c0-0.982 0.796-1.778 1.778-1.778zM17.244 17.778h-2.489v6.578h2.489v-6.578zM25.422 17.778v11.911h2.489v-11.911h-2.489zM4.089 17.778v11.911h2.489v-11.911h-2.489z',
            tiled: 'M4 2c0-1.105 0.895-2 2-2h4c1.105 0 2 0.895 2 2v12h12v-12c0-1.105 0.895-2 2-2h4c1.105 0 2 0.895 2 2v12h2c1.105 0 2 0.895 2 2s-0.895 2-2 2h-10v11.75c0 1.243-1.343 2.25-3 2.25h-6c-1.657 0-3-1.007-3-2.25v-11.75h-10c-1.105 0-2-0.895-2-2s0.895-2 2-2h2v-12zM21.4 18h-6.8v11.339c0.095 0.033 0.229 0.061 0.4 0.061h6c0.171 0 0.305-0.029 0.4-0.061v-11.339z',
            line: 'M34.438 4c0-2.193 1.858-4 4.114-4s4.114 1.807 4.114 4c0 2.193-1.858 4-4.114 4-0.564 0-1.094-0.13-1.586-0.333l-4.371 5.104c0.31 0.561 0.471 1.22 0.471 1.896 0 2.193-1.858 4-4.114 4s-4.114-1.807-4.114-4c0-0.381 0.067-0.754 0.171-1.104l-4.671-3.625c-0.669 0.459-1.484 0.729-2.357 0.729-0.564 0-1.094-0.13-1.586-0.333l-4.371 5.104c0.31 0.561 0.471 1.22 0.471 1.896 0 2.193-1.858 4-4.114 4s-4.114-1.807-4.114-4c0-2.193 1.858-4 4.114-4 0.571 0 1.111 0.104 1.607 0.312l4.371-5.083c-0.318-0.567-0.493-1.21-0.493-1.896 0-2.193 1.858-4 4.114-4s4.114 1.807 4.114 4c0 0.381-0.067 0.733-0.171 1.083l4.671 3.646c0.669-0.459 1.484-0.729 2.357-0.729 0.571 0 1.111 0.104 1.607 0.312l4.371-5.083c-0.318-0.567-0.493-1.21-0.493-1.896zM39.924 4c0-0.752-0.598-1.333-1.372-1.333s-1.371 0.581-1.371 1.333 0.598 1.333 1.371 1.333c0.774 0 1.372-0.581 1.372-1.333zM19.352 6.667c0-0.752-0.598-1.333-1.371-1.333s-1.371 0.581-1.371 1.333c0 0.752 0.598 1.333 1.371 1.333s1.371-0.581 1.371-1.333zM30.324 14.667c0-0.752-0.598-1.333-1.372-1.333s-1.371 0.581-1.371 1.333 0.598 1.333 1.371 1.333c0.774 0 1.372-0.581 1.372-1.333zM9.752 17.333c0-0.752-0.598-1.333-1.371-1.333s-1.371 0.581-1.371 1.333c0 0.752 0.598 1.333 1.371 1.333s1.371-0.581 1.371-1.333zM1.6 29.021c0-0.711 0.576-1.288 1.288-1.288h39.632c0.711 0 1.287 0.576 1.287 1.288s-0.576 1.287-1.287 1.287h-39.632c-0.711 0-1.288-0.576-1.288-1.287z',
            bar: 'path://M27.847 0.494c-1.556 0-2.821 1.265-2.821 2.821v20.751c0 1.556 1.265 2.821 2.821 2.821h2.887c1.556 0 2.821-1.266 2.821-2.821v-20.751c0-1.556-1.265-2.821-2.821-2.821h-2.887zM27.059 3.315c0-0.434 0.354-0.788 0.788-0.788h2.887c0.434 0 0.788 0.354 0.788 0.788v20.751c0 0.434-0.354 0.788-0.788 0.788h-2.887c-0.434 0-0.788-0.354-0.788-0.788v-20.751zM16.48 6.99c-1.556 0-2.821 1.265-2.821 2.821v14.255c0 1.556 1.265 2.821 2.821 2.821h2.887c1.556 0 2.821-1.266 2.821-2.821v-14.255c0-1.556-1.265-2.821-2.821-2.821h-2.887zM15.693 9.811c0-0.434 0.354-0.788 0.788-0.788h2.887c0.434 0 0.788 0.354 0.788 0.788v14.255c0 0.434-0.354 0.788-0.788 0.788h-2.887c-0.434 0-0.788-0.354-0.788-0.788v-14.255zM5.112 13.486c-1.556 0-2.821 1.265-2.821 2.821v7.759c0 1.556 1.265 2.821 2.821 2.821h2.887c1.556 0 2.821-1.266 2.821-2.821v-7.759c0-1.556-1.265-2.821-2.821-2.821h-2.887zM4.324 16.307c0-0.434 0.354-0.788 0.788-0.788h2.887c0.434 0 0.788 0.354 0.788 0.788v7.759c0 0.434-0.354 0.788-0.788 0.788h-2.887c-0.434 0-0.788-0.354-0.788-0.788v-7.759zM2.28 29.726c-0.562 0-1.016 0.455-1.016 1.016s0.455 1.017 1.016 1.017h31.289c0.562 0 1.016-0.455 1.016-1.017s-0.455-1.016-1.016-1.016h-31.289z'
          },
          title: {
            stack: i18n.t('chart.stack'),
            tiled: i18n.t('chart.tiled'),
            line: i18n.t('chart.line'),
            bar: i18n.t('chart.bar')
          }
        },
        restore: {
          icon: 'path://M21.963 1.333c-8.1 0-14.667 6.567-14.667 14.667 0 0.434 0.021 0.862 0.060 1.285l-4.319-4.321-1.887 1.887 7.74 7.74 0.005-0.005 0.624 0.626 0.624-0.626 0.005 0.005 7.74-7.74-1.887-1.887-5.732 5.734c-0.202-0.879-0.305-1.781-0.305-2.698 0-6.617 5.383-12 12-12s12 5.383 12 12c0 6.617-5.383 12-12 12h-0.444v2.667h0.444c8.1 0 14.667-6.567 14.667-14.667s-6.567-14.667-14.667-14.667z',
          title: i18n.t('chart.restore')
        },
        dataView: {
          icon: 'M5.601 1.441c-0.53 0-0.96 0.43-0.96 0.96v27.2c0 0.53 0.43 0.96 0.96 0.96h20.8c0.53 0 0.96-0.43 0.96-0.96v-21.6c0-0.255-0.101-0.499-0.281-0.679l-5.6-5.6c-0.18-0.18-0.424-0.281-0.679-0.281h-15.2zM6.561 28.641v-25.28h12.48v5.44c0 0.53 0.43 0.96 0.96 0.96h5.44v18.88h-18.88zM20.961 7.841v-3.922l3.922 3.922h-3.922zM9.601 7.841c-0.088 0-0.16 0.072-0.16 0.16v1.6c0 0.088 0.072 0.16 0.16 0.16h6.4c0.088 0 0.16-0.072 0.16-0.16v-1.6c0-0.088-0.072-0.16-0.16-0.16h-6.4zM9.601 12.641c-0.088 0-0.16 0.072-0.16 0.16v1.6c0 0.088 0.072 0.16 0.16 0.16h12.8c0.088 0 0.16-0.072 0.16-0.16v-1.6c0-0.088-0.072-0.16-0.16-0.16h-12.8zM9.601 17.441c-0.088 0-0.16 0.072-0.16 0.16v1.6c0 0.088 0.072 0.16 0.16 0.16h12.8c0.088 0 0.16-0.072 0.16-0.16v-1.6c0-0.088-0.072-0.16-0.16-0.16h-12.8zM9.601 22.241c-0.088 0-0.16 0.072-0.16 0.16v1.6c0 0.088 0.072 0.16 0.16 0.16h12.8c0.088 0 0.16-0.072 0.16-0.16v-1.6c0-0.088-0.072-0.16-0.16-0.16h-12.8z',
          title: i18n.t('chart.dataView'),
          lang: i18n.t('chart.dataViewDetail'),
          readOnly: true,
          backgroundColor: '#0b2224',
          textareaColor: '#0b2224',
          buttonColor: chartVariable['themeColor'],
          textColor: '#fff'
        },
        brush: {
          icon: {
            rect: 'M2 6.5h2v-0.5h1.25v-2h-3.25v2.5zM7.417 4h6.5v2h-6.5v-2zM16.083 5v-1h6.5v2h-6.5v-1zM24.75 5v-1h3.25v2.5h-2v-0.5h-1.25v-1zM27 8.167h1v7.033h-2v-7.033h1zM16.083 22h3.117v2h-3.117v-2zM13.917 23v1h-6.5v-2h6.5v1zM5.25 23v1h-3.25v-2.5h2v0.5h1.25v1zM3 19.833h-1v-5h2v5h-1zM3 13.167h-1v-5h2v5h-1zM22.4 16l7.9 4.53-3.045 1.746 3.145 5.41-1.943 1.114-3.145-5.41-2.912 1.67v-9.059z',
            lineX: 'M8 5.733h2v-1.733h1.2v-2h-3.2v3.733zM12.8 2h6.4v2h-6.4v-2zM20.8 3v-1h3.2v3.733h-2v-1.733h-1.2v-1zM23 7.6h1v2.4h-2v-2.4h1zM10 10v-2.4h-2v2.4h2zM8 22v2.4h2v-2.4h-2zM22 22v2.4h2v-2.4h-2zM23 26.267h1v3.733h-3.2v-2h1.2v-1.733h1zM19.2 29v1h-6.4v-2h6.4v1zM11.2 29v1h-3.2v-3.733h2v1.733h1.2v1zM2 15.998l4.5-3.464v6.928l-4.5-3.464zM25.5 19.466l4.5-3.464-4.5-3.464v6.928z',
            lineY: 'M26.267 8v2h1.733v1.2h2v-3.2h-3.733zM30 12.8v6.4h-2v-6.4h2zM29 20.8h1v3.2h-3.733v-2h1.733v-1.2h1zM24.4 23v1h-2.4v-2h2.4v1zM22 10h2.4v-2h-2.4v2zM10 8h-2.4v2h2.4v-2zM10 22h-2.4v2h2.4v-2zM5.733 23v1h-3.733v-3.2h2v1.2h1.733v1zM3 19.2h-1v-6.4h2v6.4h-1zM3 11.2h-1v-3.2h3.733v2h-1.733v1.2h-1zM15.998 2l3.464 4.5h-6.928l3.464-4.5zM12.537 25.5l3.464 4.5 3.464-4.5h-6.928z',
            keep: 'M2 4v3h2v-1h0.5v-2h-2.5zM6.167 4h5v2h-5v-2zM12.833 6v-2h5v2h-5zM19.5 6v-2h2.5v3h-2v-1h-0.5zM20 9h2v1h8v18h-22v-8h-1.833v-2h1.833v-8h12v-1zM20 12h-10v6h1.167v2h-1.167v6h18v-14h-6v3h-2v-3zM20 17h2v3h-2.5v-2h0.5v-1zM17.833 18v2h-5v-2h5zM4.5 18v2h-2.5v-3h2v1h0.5zM4 15h-2v-6h2v6z',
            clear: 'M2 4v5h2v-3h3.833v-2h-5.833zM10.167 4h11.667v2h-11.667v-2zM24.167 6v-2h5.833v5h-2v-3h-3.833zM28 11h2v10h-2v-10zM28 23h2v5h-5.833v-2h3.833v-3zM21.833 26v2h-11.667v-2h11.667zM7.833 26v2h-5.833v-5h2v3h3.833zM4 21h-2v-10h2v10zM11.252 9.838l4.75 4.75 4.75-4.75 1.414 1.414-4.75 4.75 4.749 4.749-1.414 1.414-4.749-4.749-4.749 4.749-1.414-1.414 4.749-4.749-4.75-4.75 1.414-1.414z'
          },
          title: {
            rect: i18n.t('chart.rect'),
            polygon: i18n.t('chart.polygon'),
            lineX: i18n.t('chart.lineX'),
            lineY: i18n.t('chart.lineY'),
            keep: i18n.t('chart.keep'),
            clear: i18n.t('chart.clear')
          },
          iconStyle: {
            color: '#5995B4'
          },
          emphasis: {
            iconStyle: {
              color: '#00B2FF'
            }
          }
        },
        saveAsImage: {
          icon: 'M17.773 22.652c0.033 0.043 0.076 0.077 0.124 0.101s0.102 0.036 0.155 0.036c0.054 0 0.107-0.012 0.155-0.036s0.091-0.058 0.124-0.101l4.966-6.326c0.182-0.232 0.018-0.576-0.279-0.576h-3.286v-15.107c0-0.196-0.16-0.357-0.355-0.357h-2.66c-0.195 0-0.355 0.161-0.355 0.357v15.103h-3.277c-0.297 0-0.461 0.344-0.279 0.576l4.966 6.33zM34.28 21.089h-2.66c-0.195 0-0.355 0.161-0.355 0.357v6.875h-26.426v-6.875c0-0.196-0.16-0.357-0.355-0.357h-2.66c-0.195 0-0.355 0.161-0.355 0.357v8.839c0 0.79 0.634 1.429 1.419 1.429h30.328c0.785 0 1.419-0.638 1.419-1.429v-8.839c0-0.196-0.16-0.357-0.355-0.357z',
          title: i18n.t('chart.download'),
          backgroundColor: '#0D1B1D',
          name: window.location.search && window.location.search.includes('stamp=') ? moment(Number(window.location.search.split('&')[1].split('stamp=')[1])).format('YYYY-MM-DD-HH_mm') + '_' + decodeURI(window.location.search.split('&')[0].split('question=')[1]) : i18n.t('chart.download'),
          excludeComponents: ['toolbox', 'dataZoom', 'brush'],
          pixelRatio: 2
        },
        myShowValue: {
          show: true,
          title: '顯示數值',
          icon: 'M10.005 3.333h0-.01c-1.99.074-3.913.72-5.533 1.862A10.07 10.07 0 0 0 .878 9.753h0l-.001.003a.71.71 0 0 0 0 .489h0l.001.002a10.07 10.07 0 0 0 3.585 4.558c1.62 1.14 3.544 1.788 5.533 1.862h0 .01c1.99-.074 3.913-.72 5.533-1.862a10.07 10.07 0 0 0 3.585-4.558l.001-.002a.71.71 0 0 0 0-.489l-.115.042.114-.044a10.07 10.07 0 0 0-3.585-4.558c-1.62-1.14-3.544-1.788-5.533-1.862zM10 15.23c-3.127 0-6.44-2.282-7.662-5.23C3.56 7.05 6.873 4.768 10 4.768S16.44 7.05 17.662 10c-1.222 2.95-4.536 5.23-7.662 5.23zm0-8.625c-.675 0-1.334.2-1.896.572a3.4 3.4 0 0 0-1.257 1.523 3.38 3.38 0 0 0-.194 1.961 3.39 3.39 0 0 0 .934 1.738 3.42 3.42 0 0 0 1.747.929 3.43 3.43 0 0 0 1.971-.193 3.41 3.41 0 0 0 1.531-1.25 3.38 3.38 0 0 0 .575-1.886c0-.9-.36-1.764-1-2.4A3.42 3.42 0 0 0 10 6.606zm-.404 1.376a2.08 2.08 0 0 1 1.195.117c.378.156.7.42.93.758a2.05 2.05 0 0 1 .349 1.144c0 .546-.218 1.07-.606 1.456s-.914.603-1.463.603c-.41 0-.81-.12-1.15-.347a2.06 2.06 0 0 1-.762-.924 2.05 2.05 0 0 1-.118-1.189c.08-.4.277-.766.566-1.054a2.07 2.07 0 0 1 1.059-.563z'
        }
      },
      iconStyle: {
        color: '#689499',
        borderWidth: 0
      },
      emphasis: {
        iconStyle: {
          color: '#4DE2F0',
          textPosition: 'left',
          textAlign: 'right',
          textBackgroundColor: '#0a3c42'
        }
      },
      showTitle: false,
      top: 54,
      tooltip: {
        show: true,
        padding: 4,
        position: 'left',
        textStyle: {
          width: '100%',
          fontSize: 12
        }
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      backgroundColor: chartVariable['backgroundColor'],
      borderWidth: 1,
      borderColor: chartVariable['borderColor'],
      padding: 10,
      textStyle: {
        color: chartVariable['textColor']
      },
      extraCssText: 'box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);',
      confine: true
    }
  }
}
export function chartOptions () {
  return {
    ...commonChartOptions(),
    // grid: {
    //   containLabel: true
    // },
    xAxis: {
      name: '',
      nameLocation: 'end',
      nameGap: 5,
      nameTextStyle: {
        fontSize: 12,
        color: chartVariable['textColor']
      },
      axisLabel: {
        rotate: 30,
        color: chartVariable['xAxisLabelColor']
      },
      axisLine: {
        lineStyle: {
          color: chartVariable['xAxisColor']
        }
      },
      // 刻度
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '',
      // nameGap: 58,
      nameTextStyle: {
        fontSize: 12,
        color: chartVariable['textColor'],
        align: 'left'
      },
      axisLabel: {
        color: chartVariable['yAxisLabelColor']
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      scale: false
    },
    series: []
  }
}
