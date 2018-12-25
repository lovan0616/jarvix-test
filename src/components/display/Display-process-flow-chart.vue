<template>
  <div class="display-process-flow-chart-root">
    <svg ref="svg" width="100%" viewBox="0 0 900 600" preserveAspectRatio="xMaxYMax meet">
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { Dagre, Line, Path, Rectangle, Circle, Polygon } from './common/Dagre.js'

export default {
  name: 'DisplayProcessFlowChart',
  props: {
    nodes: { type: Array, default: () => [] },
    links: { type: Array, default: () => [] }
  },
  data () {
    return {
      legend: {
        nodes: [
          {
            label: '組裝工站',
            shape: 'square',
            type: 'default'
          },
          {
            label: '重要組裝工站',
            shape: 'square',
            type: 'special'
          },
          {
            label: '刪除',
            shape: 'square',
            type: 'deleted'
          },
          {
            label: '測試',
            shape: 'diamond',
            type: 'danger'
          },
          {
            label: '檢驗',
            shape: 'diamond',
            type: 'default'
          }
        ]
      }
    }
  },
  mounted () {
    this.$nextTick(this.init)
  },
  methods: {
    init () {
      // console.log('width: ', this.$refs.svg.getClientRects()[0].width)
      const legendDagre = new Dagre({
        outerWidth: this.$el.offsetWidth,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        nodeWidth: 80,
        nodeHeight: 80,
        nodeSep: 40,
        rowSep: 50,
        layoutDirection: 'LR-RL'
      })

      legendDagre.nodes
        .addNodes(this.legend.nodes)
        .setPosition()

      const dagre = new Dagre({
        outerWidth: this.$el.offsetWidth,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        nodeWidth: 80,
        nodeHeight: 80,
        nodeSep: 40,
        rowSep: 50,
        layoutDirection: 'LR-RL'
      })

      dagre.nodes
        .addNodes(this.nodes)
        .setPosition()

      dagre.links
        .addLinks(this.links)
        .setPosition(dagre.nodes.data)

      const dagreSize = dagre.getSize()
      const svgWidth = dagreSize[0]
      const svgHeight = dagreSize[1] + 200
      const svg = d3.select(this.$refs.svg)
        .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)

      const inner = svg.append('g')
        .attr('class', 'inner')
        .attr('width', dagre.options.innerWidth)
        .attr('transform', `translate(${dagre.options.paddingTop}, ${dagre.options.paddingLeft})`)

      const markers = svg.append('defs')
        .selectAll('marker')
        .data(dagre.markers.data)
        .enter()
        .append('marker')
        .attr('id', d => d.id)

      markers
        .filter(d => d.tag.name === 'path')
        .attr('class', d => d.classList)
        .attr('refX', d => d.refX)
        .attr('refY', d => d.refY)
        .attr('markerWidth', d => d.markerWidth)
        .attr('markerHeight', d => d.markerHeight)
        .attr('orient', d => d.orient)
        .append('path')
        .attr('d', d => d.tag.d)

      const links = inner.append('g')
        .attr('class', 'links')
        .selectAll('.link')
        .data(dagre.links.data)
        .enter()
        .append('g')
        .attr('class', d => `link ${d.shape.name} ${d.type}`)

      links
        .filter(d => d.shape instanceof Line)
        .append('line')
        .attr('x1', d => d.shape.x1)
        .attr('y1', d => d.shape.y1)
        .attr('x2', d => d.shape.x2)
        .attr('y2', d => d.shape.y2)
        .attr('stroke-dasharray', d => d.shape.strokeDasharray)
        .attr('marker-start', d => (d.arrow === 'start') ? `url(#link-triangle-${d.type})` : '')
        .attr('marker-mid', d => (d.arrow === 'mid') ? `url(#link-triangle-${d.type})` : '')
        .attr('marker-end', d => (d.arrow === 'end') ? `url(#link-triangle-${d.type})` : '')

      links
        .filter(d => d.shape instanceof Path)
        .append('path')
        .attr('d', d => d.shape.p)
        .attr('stroke-dasharray', d => d.shape.strokeDasharray)
        .attr('marker-start', d => (d.arrow === 'start') ? `url(#link-triangle-${d.type})` : '')
        .attr('marker-mid', d => (d.arrow === 'mid') ? `url(#link-triangle-${d.type})` : '')
        .attr('marker-end', d => (d.arrow === 'end') ? `url(#link-triangle-${d.type})` : '')

      const nodes = inner.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(dagre.nodes.data)
        .enter()
        .append('g')
        .attr('class', d => `node ${d.shape.name} ${d.type}`)

      nodes
        .filter(d => d.shape instanceof Rectangle)
        .append('rect')
        .attr('x', d => d.shape.x)
        .attr('y', d => d.shape.y)
        .attr('width', d => d.shape.w)
        .attr('height', d => d.shape.h)

      nodes
        .filter(d => d.shape instanceof Circle)
        .append('circle')
        .attr('cx', d => d.shape.cx)
        .attr('cy', d => d.shape.cy)
        .attr('r', d => d.shape.r)

      nodes
        .filter(d => d.shape instanceof Polygon)
        .append('polygon')
        .attr('points', d => d.shape.p)

      nodes.append('text')
        .attr('x', d => d.text.x)
        .attr('y', d => d.text.y)
        .attr('text-anchor', d => d.text.textAnchor)
        .attr('alignment-baseline', d => d.text.alignmentBaseline)
        .selectAll('tspan')
        .data(d => d.text.tspans)
        .enter()
        .append('tspan')
        .text(d => d.t)
        .attr('x', d => d.x)
        .attr('dy', d => d.dy)

      const legendPadding = 20
      const legend = inner.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(40, ${dagre.getSize()[1] + 40})`)

      legend.append('rect')
        .attr('x', 0)
        .attr('y', -legendPadding)
        .attr('width', (legendDagre.options.nodeWidth + legendDagre.options.nodeSep) * legendDagre.nodes.data.length + legendPadding * 2)
        .attr('height', legendDagre.options.nodeHeight + legendPadding * 2)

      const legendNodes = legend.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(legendDagre.nodes.data)
        .enter()
        .append('g')
        .attr('class', d => `node ${d.shape.name} ${d.type}`)

      legendNodes
        .filter(d => d.shape instanceof Rectangle)
        .append('rect')
        .attr('x', d => d.shape.x)
        .attr('y', d => d.shape.y)
        .attr('width', d => d.shape.w)
        .attr('height', d => d.shape.h)

      legendNodes
        .filter(d => d.shape instanceof Circle)
        .append('circle')
        .attr('cx', d => d.shape.cx)
        .attr('cy', d => d.shape.cy)
        .attr('r', d => d.shape.r)

      legendNodes
        .filter(d => d.shape instanceof Polygon)
        .append('polygon')
        .attr('points', d => d.shape.p)

      legendNodes.append('text')
        .attr('x', d => d.text.x)
        .attr('y', d => d.text.y)
        .attr('text-anchor', d => d.text.textAnchor)
        .attr('alignment-baseline', d => d.text.alignmentBaseline)
        .selectAll('tspan')
        .data(d => d.text.tspans)
        .enter()
        .append('tspan')
        .text(d => d.t)
        .attr('x', d => d.x)
        .attr('dy', d => d.dy)
      // nodes.append('g')
      //   .attr('class', 'contactor')
      //   .selectAll('circle')
      //   .data(d => d.contactor.data)
      //   .enter()
      //   .append('circle')
      //   .attr('cx', d => d.x)
      //   .attr('cy', d => d.y)
      //   .attr('r', 1)
    }
  }
}
</script>

<style lang="scss">
.display-process-flow-chart-root {
  .legend {
    stroke: #006464;
    stroke-width: 1px;
    & > rect {
      fill: transparent;
    }
  }
  text {
    font-size: 12px;
  }

  .node {
    rect, circle, polygon, path {
      fill: #40BEBC;
      stroke-width: 0;
    }

    text {
      fill: #ffffff;
      stroke-width: 0;
    }
  }

  .node.start {
    rect, circle, polygon, path {
      fill: #48666A;
    }

    text {
      fill: #ffffff;
    }
  }

  .node.default {
    rect, circle, polygon, path {
      fill: #E4F0F0;
    }

    text {
      fill: #006464;
    }
  }

  .node.special {
    rect, circle, polygon, path {
      fill: #9FC2C6;
    }

    text {
      fill: #ffffff;
    }
  }

  .node.danger {
    rect, circle, polygon, path {
      fill: #F58D77;
    }

    text {
      fill: #ffffff;
    }
  }

  .node.light {
    rect, circle, polygon, path {
      fill: #B6E9E9;
    }

    text {
      fill: #005055;
    }
  }

  .node.deleted {
    rect, circle, polygon, path {
      fill: #eeeeee;
    }

    text {
      fill: #dddddd;
    }
  }

  .node .contactor circle {
    fill: #000;
  }

  .link {
    line, path {
      stroke-width: 2;
    }
  }
  .link.default {
    line, path {
      stroke: #40BEBC;
    }
  }

  .link.danger {
    line, path {
      stroke: #F58D77;
    }
  }
  marker.link {
    path {
      stroke-width: 0;
    }
  }
  marker.link.default {
    path {
      fill: #40BEBC;
    }
  }
  marker.link.danger {
    path {
      fill: #F58D77;
    }
  }
}
</style>
