<template>
  <div class="data-visual">
    <div ref="charts_select_header" class="charts-select-header">
      <span>2D图表</span>
      <ul class="charts-select-menu">
        <li>
          <i data-type="charts" data-name="Histogram" class="iconfont icon-charts" draggable="true"
             @dragstart="dragstart"></i>
        </li>
        <li>
          <i data-type="charts" data-name="VeLine" class="iconfont icon-charts1" draggable="true"
             @dragstart="dragstart"></i>
        </li>
        <li>
          <i data-type="charts" data-name="Pie" class="iconfont icon-fendianbaobiao"
             draggable="true" @dragstart="dragstart"></i>
        </li>
        <li>
          <i data-type="charts" data-name="Gauge" class="iconfont icon-addcharts-dapan"
             draggable="true" @dragstart="dragstart"></i>
        </li>
      </ul>
      <span>3D图表</span>
      <ul class="charts-select-menu">
        <li>
          <i data-type="charts" data-name="Histogram3D" class="iconfont icon-bar_d_chart"
             draggable="true" @dragstart="dragstart"></i>
        </li>
      </ul>
    </div>
    <div class="charts-content-wrapper"
         style="overflow:auto;width:100%;height:auto;">
      <div id="canvas_bg"
           ref="canvWrap"
           :style="`opacity:.4;width:${chartsGlobalSetting.bgWidth}px;
                 height:${chartsGlobalSetting.bgHeight}px;z-index:1;`">
        <canvas ref="canv" width="100%" height="100%"></canvas>
      </div>
      <div class="earth-rotate"
           :style="`width:${chartsGlobalSetting.bgWidth}px;
                 height:${chartsGlobalSetting.bgHeight}px;z-index:0;`">
        <div class="map">
          <div class="map1"><img alt="" src="../../static/img/lbx.png"></div>
          <div class="map2"><img alt="" src="../../static/img/jt.png"></div>
          <div class="map3"><img alt="" src="../../static/img/map.png"></div>
        </div>
      </div>
      <div class="charts-content"
           :style="`width:${chartsGlobalSetting.bgWidth}px;
                 height:${chartsGlobalSetting.bgHeight}px;
                 position:relative;z-index:2;`"
           @drop="drop"
           @dragover="dragover">
        <div class="charts-wrapper"
             v-for="(item,index) in chartsList" :key="item.id"
             :style="`position: absolute;top:${item.top}px;
                     left:${item.left}px;
                     width:${item.width}px;height:${item.height}px;
                     index:${item.zIndex}`"
             @mouseenter="mouseenter(item)"
             @mouseleave="mouseleave(item)">
          <div class="charts-tools"
               :style="`height:${item.chartsToolHeight}px;background-color:#99dfff;transition:0.3s;
                         overflow:hidden;`">
            <ul>
              <li style="width:50%;cursor:move;font-size:14px;"
                  @mousedown="mouseDown($event,item)">拖动
              </li>
              <li style="width:30px;padding: 0 5px;float:right;">
                <i class="el-icon-delete" style="cursor:pointer" @click="delChart(index)"></i>
              </li>
              <li style="width:30px;padding: 0 5px;float:right;">
                <i class="el-icon-edit" style="cursor:pointer" @click="changeChart(index)"></i>
              </li>
            </ul>
          </div>
          <div :is="item.chartName"
               :data="item.data"
               :height="`${item.height-item.chartsToolHeight}px`"
               :width="`100%`">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Histogram from 'v-charts/lib/histogram.common'
  import VeLine from 'v-charts/lib/line.common'
  import Pie from 'v-charts/lib/pie.common'
  import Gauge from 'v-charts/lib/gauge.common'
  import Histogram3D from "@/components/charts/Histogram3D"
  import {getChartDefaultData} from "@/utils"
  import {operateBdBg} from "../../static/js/bigdataBg"
  import {generateUUID} from "@/utils"

  export default {
    name: "DataVisual",
    components: {
      Histogram,
      VeLine,
      Pie,
      Gauge,
      Histogram3D,
    },
    data() {
      return {
        chartsList: [], // 存放图表数据
        currentX: 0, // 鼠标按下时记录当前横坐标
        currentY: 0, // 鼠标按下时记录当前纵坐标
        currentDivX: 0, // 鼠标按下时要移动的div的横坐标
        currentDivY: 0, // 鼠标按下时要移动的div的纵坐标
        currentCanvasDiv: null, // 鼠标按下时存放包含echarts图表父元素
        currentItem: null, // 当鼠标按下时存放当前的图表数据
        mouseoutFlag: true, // 在鼠标移动过程中即使鼠标脱离了div，工具栏也不会消失
        chartsGlobalSetting: { // 整个图表的画布的全局参数
          "bgWidth": 1900,
          "bgHeight": 1080
        }
      }
    },
    mounted() {
      let obj = this.$refs.charts_select_header
      // 滚动页面到85px时固定图表选项行
      window.onscroll = function () {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop < 85) {
          obj.style.position = 'absolute'
        } else {
          obj.style.position = 'fixed'
        }
      }
      this.$nextTick(function () { // 绘制背景的canvas
        operateBdBg(this.$refs.canv, this.$refs.canvWrap)
      })
    },
    methods: {
      // 拖拽事件开始
      dragstart(event) {
        let domData = event.target.dataset
        event.dataTransfer.setData('type', domData.type)
        event.dataTransfer.setData('name', domData.name)
      },

      // 绑定在可放置的元素上
      drop(event) {
        const path = event.path || (event.composedPath && event.composedPath())// 兼容火狐和Safari
        let type = event.dataTransfer.getData('type')
        let name = event.dataTransfer.getData('name')
        if (type === 'charts') {
          let _getX = event.offsetX,
            _getY = event.offsetY
          if (path[0].tagName === 'CANVAS') {
            // 当图表生成位置与已有图表重合时，继续在此位置生成。
            let parentDiv = path[4]
            _getX += parseInt(parentDiv.style.left)
            _getY += parseInt(parentDiv.style.top)
          }
          let chartObj = {}
          chartObj.id = generateUUID()
          chartObj.width = 400
          chartObj.height = 400
          chartObj.chartsToolHeight = 0
          // 图表不能生成在画布外
          chartObj.left = _getX + chartObj.width > this.chartsGlobalSetting.bgWidth ? this.chartsGlobalSetting.bgWidth - chartObj.width
            : _getX
          chartObj.top = _getY + chartObj.height > this.chartsGlobalSetting.bgHeight ? this.chartsGlobalSetting.bgHeight - chartObj.height
            : _getY
          chartObj.zIndex = this.chartsList.length
          chartObj.data = getChartDefaultData(name)
          chartObj.chartName = name
          this.chartsList.push(chartObj)
        }
      },

      // 拖拽过程中触发
      // 必须阻止某一 DOM 元素对 dragover 的默认行为，才能使 drop 事件在其上正确执行
      dragover(event) {
        event.preventDefault()
      },

      // 鼠标按下事件
      mouseDown(event, item) {
        this.mouseoutFlag = false
        this.currentItem = item
        const path = event.path || (event.composedPath && event.composedPath())
        let DivObj = this.currentCanvasDiv = path[3]
        document.addEventListener("mousemove", this.mouseMove)
        document.addEventListener("mouseup", this.mouseUp)
        this.currentX = event.clientX // 记录当前鼠标横坐标
        this.currentY = event.clientY // 记录当前鼠标纵坐标
        this.currentDivX = parseInt(DivObj.style.left)
        this.currentDivY = parseInt(DivObj.style.top)
      },

      // 鼠标移动事件
      mouseMove(event) {
        let _X = this.currentDivX + event.clientX - this.currentX
        let _Y = this.currentDivY + event.clientY - this.currentY
        // 不允许拖拽超出画布
        // 左边界
        _X = _X > 0 ? _X : 0
        // 右边界
        _X = _X <= this.chartsGlobalSetting.bgWidth - parseInt(this.currentCanvasDiv.style.width) ? _X
          : this.chartsGlobalSetting.bgWidth - parseInt(this.currentCanvasDiv.style.width)
        // 上边界
        _Y = _Y > 0 ? _Y : 0
        // 下边界
        _Y = _Y <= this.chartsGlobalSetting.bgHeight - parseInt(this.currentCanvasDiv.style.height) ? _Y
          : this.chartsGlobalSetting.bgHeight - parseInt(this.currentCanvasDiv.style.height)
        this.currentCanvasDiv.style.left = _X + 'px'
        this.currentCanvasDiv.style.top = _Y + 'px'
      },

      // 鼠标抬起事件
      mouseUp(event) {
        console.log(event)
        const path = event.path || (event.composedPath && event.composedPath())
        if (path[0].tagName !== 'LI') {
          this.currentItem.chartsToolHeight = 0
        }
        this.mouseoutFlag = true
        document.removeEventListener("mousemove", this.mouseMove)
        document.removeEventListener("mouseup", this.mouseUp)
      },

      // 鼠标悬停
      mouseenter(item) {
        item.chartsToolHeight = 30
      },

      // 鼠标移除
      mouseleave(item) {
        item.chartsToolHeight = this.mouseoutFlag ? 0 : 30
      },

      // 删除图表
      delChart(index) {
        this.chartsList.splice(index, 1)
      },

      // 修改图表数据
      changeChart(index) {
        this.$message({
          message: `此功能暂未开放！${index}`,
          type: "warning"
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '../../static/lib/font_jiygtfou2p/iconfont.css';

  @font-face {
    font-family: 'hyz';
    src: url('../../static/lib/HanYiRuiZhiJian/HYRuiZhiJ-2.ttf');
  }

  @keyframes myfirst2 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }

  @keyframes myfirst {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-359deg);
    }
  }

  .data-visual {
    width: 100%;
    padding-top: 65px;
    position: relative;
    overflow: hidden;
    background-color: #2b3843;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .charts-content-wrapper {
      position: relative;

      #canvas_bg, .earth-rotate {
        position: absolute;
        left: 0;
        top: 0;
      }

      .earth-rotate {
        background: url("../../static/img/bg.png") no-repeat top center;
        background-size: cover;

        .map {
          position: absolute;
          width: 560px;
          height: 560px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          overflow: hidden;
        }

        .map1, .map2, .map3 {
          position: absolute;
          opacity: .5;
          width: 100%;
          height: 100%;
        }

        .map1 {
          z-index: 2;
          animation: myfirst2 15s infinite linear;
        }

        .map2 {
          z-index: 3;
          opacity: 0.2;
          animation: myfirst 10s infinite linear;
        }

        .map3 {
          z-index: 1;
        }

        .map img {
          border: none;
          width: 100%;
          height: 100%;
        }

        div.map3 img, div.map2 img {
          display: block;
          position: absolute;
          width: 80%;
          height: 80%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .charts-select-header {
      width: 100%;
      height: 65px;
      background-color: #2b3843;
      text-align: left;
      padding: 0 20px;
      line-height: 65px;
      color: #fff;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;

      span {
        display: inline-block;
        vertical-align: middle;
        padding-right: 15px;
      }

      .charts-select-menu {
        display: inline-block;
        list-style: none;
        vertical-align: middle;
        margin-right: 20px;

        &:after {
          content: '';
          display: block;
          clear: both;
        }

        li {
          float: left;
          height: 100%;
          padding: 0 10px;

          i {
            font-size: 30px;
            cursor: pointer;
            padding: 8px;
            transition: .3s;
            border-radius: 3px;

            &:hover {
              box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.6);
            }
          }
        }
      }
    }

    .charts-tools {

      ul {
        list-style: none;
        height: 100%;

        &:after {
          content: "";
          display: block;
          clear: both;
        }

        li {
          float: left;
          text-align: center;
          height: 100%;
          line-height: 30px;

          i {

          }
        }
      }
    }
  }
</style>