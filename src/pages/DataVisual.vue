<template>
  <div class="data-visual">
    <div ref="charts_select_header" class="charts-select-header">
      <div class="back-btn">
        <el-button type="primary" icon="el-icon-arrow-left" @click="backToVisList">返回列表</el-button>
      </div>
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
          <i data-type="charts" data-name="Radar" class="iconfont icon-radar"
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
      <div class="save-charts">
        <el-button type="success" round @click="saveCharts">保存图表</el-button>
      </div>
    </div>
    <div class="charts-content-wrapper"
         ref="chartsContent"
         style="overflow:auto;width:100%;height:auto;">
      <div id="canvas_bg"
           ref="canvWrap"
           :style="`opacity:.4;width:${visualData.chartsGlobalSetting.bgWidth}px;
                 height:${visualData.chartsGlobalSetting.bgHeight}px;z-index:1;`">
        <canvas ref="canv" width="100%" height="100%" style="opacity:.5"></canvas>
      </div>
      <div class="earth-rotate"
           :style="`width:${visualData.chartsGlobalSetting.bgWidth}px;
                 height:${visualData.chartsGlobalSetting.bgHeight}px;z-index:0;`">
        <div class="title">
          <p class="p1">大数据可视化分析</p>
          <p class="p2">Big data visualization analysis</p>
        </div>
        <div class="map">
          <div class="map1"><img alt="" src="../../static/img/bgvisual/lbx.png"></div>
          <div class="map2"><img alt="" src="../../static/img/bgvisual/jt.png"></div>
          <div class="map3"><img alt="" src="../../static/img/bgvisual/map.png"></div>
        </div>
      </div>
      <div class="charts-content"
           :style="`width:${visualData.chartsGlobalSetting.bgWidth}px;
                 height:${visualData.chartsGlobalSetting.bgHeight}px;
                 position:relative;z-index:2;`"
           @drop="drop"
           @dragover="dragover">
        <div class="charts-wrapper"
             v-for="(item,index) in visualData.chartsList" :key="item.id"
             :style="`position: absolute;top:${item.top}px;
                     left:${item.left}px;
                     width:${item.width}px;height:${item.height}px;
                     index:${item.zIndex}`"
             @mouseenter="mouseenter(item)"
             @mouseleave="mouseleave(item)">
          <div class="left-border" id="left" ref="left" :style="`height:${item.height}px;left:0;top:0;`"
               @mousedown="c_mouseDown($event,item)"></div>
          <div class="top-border" id="top" ref="top" :style="`width:${item.width}px;left:0;top:0;`"
               @mousedown="c_mouseDown($event,item)"></div>
          <div class="right-border" id="right" ref="right" :style="`height:${item.height}px;right:0;top:0;`"
               @mousedown="c_mouseDown($event,item)"></div>
          <div class="bottom-border" id="bottom" ref="bottom" :style="`width:${item.width}px;left:0;bottom:0;`"
               @mousedown="c_mouseDown($event,item)"></div>
          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
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
               :width="`${item.width}px`">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Histogram from '@/components/charts/Histogram'
  import VeLine from '@/components/charts/VeLine'
  import Pie from '@/components/charts/Pie'
  import Radar from '@/components/charts/Radar'
  import Histogram3D from "@/components/charts/Histogram3D"
  import {getChartDefaultData} from "@/request/api/charts"
  import {saveVisualPage} from "@/request/api/user"
  import {viewVisualPage} from "@/request/api/user"
  import {operateBdBg} from "../../static/js/bigdataBg"
  import {generateUUID} from "@/utils"

  export default {
    name: "DataVisual",
    components: {
      Histogram,
      VeLine,
      Pie,
      Radar,
      Histogram3D,
    },
    data() {
      return {
        currentX: 0, // 鼠标按下时记录当前横坐标
        currentY: 0, // 鼠标按下时记录当前纵坐标
        currentDivX: 0, // 鼠标按下时要移动的div的横坐标
        currentDivY: 0, // 鼠标按下时要移动的div的纵坐标
        currentDivWidth: 0, // 鼠标按下时要变化大小div的宽度
        currentDivHeight: 0, // 鼠标按下时要变化大小div的高度
        currentCanvasDiv: null, // 鼠标按下时存放包含echarts图表父元素
        currentBorder: null, // 鼠标按下时存放移动的边界元素
        currentItem: null, // 当鼠标按下时存放当前的图表数据
        mouseoutFlag: true, // 在鼠标移动过程中即使鼠标脱离了div，工具栏也不会消失
        visualData: {
          visualPageId: "",
          visualPageName: "大数据可视化分析",
          visualPageImg: "http://localhost:3000/bigdata/visual_img/big_data_demo.jpg",
          chartsList: [], // 存放图表数据
          chartsGlobalSetting: { // 整个图表的全局参数
            "bgWidth": 1900,
            "bgHeight": 1080,
            "minChartWidth": 300,
            "minChartHeight": 200,
            "chartWidth": 480,
            "chartHeight": 280
          },
        }
      }
    },
    mounted() {
      // let obj = this.$refs.charts_select_header
      // // 滚动页面到85px时固定图表选项行
      // window.onscroll = function () {
      //   let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      //   if (scrollTop < 85) {
      //     obj.style.position = 'absolute'
      //   } else {
      //     obj.style.position = 'fixed'
      //   }
      // }
      let visualPageId = this.$route.query.visualPageId // 获取路由参数
      if (visualPageId) { // 如果id存在则为修改可视化页面
        this.visualData.visualPageId = visualPageId
        viewVisualPage({"visualPageId": visualPageId}).then(res => {
          if (res.hasPage) {
            Object.assign(this.visualData, res.visualData.visualPageData)
          } else {
            this.$message({
              message: res.message,
              type: "error"
            })
          }
        })
      } else { // 若id未存在则新建可视化页面
        this.visualData.visualPageId = "vpi" + generateUUID()
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
          // 获取图表的默认数据
          getChartDefaultData({"chartsName": name}).then(res => {
            let chartObj = {}
            let _s = this.visualData.chartsGlobalSetting
            chartObj.id = "cid" + generateUUID()
            chartObj.width = _s.chartWidth
            chartObj.height = _s.chartHeight
            chartObj.chartsToolHeight = 0
            // 图表不能生成在画布外
            chartObj.left = _getX + chartObj.width > _s.bgWidth ? _s.bgWidth - chartObj.width
              : _getX
            chartObj.top = _getY + chartObj.height > _s.bgHeight ? _s.bgHeight - chartObj.height - 2
              : _getY
            chartObj.zIndex = this.visualData.chartsList.length
            chartObj.chartName = name
            chartObj.data = res.chartsData
            this.visualData.chartsList.push(chartObj)
          })
        }
      },

      // 拖拽过程中触发
      // 必须阻止某一 DOM 元素对 dragover 的默认行为，才能使 drop 事件在其上正确执行
      dragover(event) {
        event.preventDefault()
      },

      // div移动鼠标按下事件 用于拖动图表
      mouseDown(event, item) {
        this.mouseoutFlag = false
        this.currentItem = item
        const path = event.path || (event.composedPath && event.composedPath())
        this.currentCanvasDiv = path[3]
        document.addEventListener("mousemove", this.mouseMove)
        document.addEventListener("mouseup", this.mouseUp)
        this.currentX = event.clientX // 记录当前鼠标横坐标
        this.currentY = event.clientY // 记录当前鼠标纵坐标
        this.currentDivX = parseInt(this.currentCanvasDiv.style.left)
        this.currentDivY = parseInt(this.currentCanvasDiv.style.top)
      },

      // div移动鼠标移动事件
      mouseMove(event) {
        let _s = this.visualData.chartsGlobalSetting
        let _X = this.currentDivX + event.clientX - this.currentX
        let _Y = this.currentDivY + event.clientY - this.currentY
        // 不允许拖拽超出画布
        // 左边界
        _X = _X > 0 ? _X : 0
        // 右边界
        _X = _X <= _s.bgWidth - parseInt(this.currentCanvasDiv.style.width) ? _X
          : _s.bgWidth - parseInt(this.currentCanvasDiv.style.width)
        // 上边界
        _Y = _Y > 0 ? _Y : 0
        // 下边界
        _Y = _Y <= _s.bgHeight - parseInt(this.currentCanvasDiv.style.height) ? _Y
          : _s.bgHeight - parseInt(this.currentCanvasDiv.style.height) - 2
        this.currentItem.left = _X
        this.currentItem.top = _Y
        this.currentCanvasDiv.style.left = _X + 'px'
        this.currentCanvasDiv.style.top = _Y + 'px'
      },

      // div移动鼠标抬起事件
      mouseUp(event) {
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

      // div大小变化鼠标按下事件
      c_mouseDown(event, item) {
        this.currentItem = item
        this.currentX = event.pageX
        this.currentY = event.pageY
        const path = event.path || (event.composedPath && event.composedPath())
        this.currentCanvasDiv = path[1]
        this.currentBorder = path[0].id
        this.currentDivWidth = parseInt(this.currentCanvasDiv.style.width)
        this.currentDivHeight = parseInt(this.currentCanvasDiv.style.height)
        this.currentDivX = parseInt(this.currentCanvasDiv.style.left)
        this.currentDivY = parseInt(this.currentCanvasDiv.style.top)
        document.addEventListener("mousemove", eval('this.' + this.currentBorder + 'Move'))
        document.addEventListener("mouseup", this.c_mouseUp)
      },

      // div大小变化鼠标抬起事件
      c_mouseUp() {
        document.removeEventListener("mousemove", eval('this.' + this.currentBorder + 'Move'))
        document.removeEventListener("mouseup", this.c_mouseUp)
      },

      // 拖动左边界
      leftMove(event) {
        let u_top = document.getElementById('top')
        let u_bottom = document.getElementById('bottom')
        let _X = event.pageX
        if (_X <= 0) {
          _X = 4
        }
        let _s = this.visualData.chartsGlobalSetting
        let _width = this.currentDivWidth + this.currentX - _X
        if (_width <= _s.minChartWidth) {
          this.currentItem.width = _s.minChartWidth
          u_bottom.style.width = u_top.style.width = _s.minChartWidth + 'px'
          this.currentItem.left = this.currentDivWidth + this.currentDivX - _s.minChartWidth
        } else {
          this.currentItem.width = _width
          u_bottom.style.width = u_top.style.width = _width + 'px'
          this.currentItem.left = this.currentDivX + _X - this.currentX
        }
      },

      // 拖动右边界
      rightMove(event) {
        let u_top = document.getElementById('top')
        let u_bottom = document.getElementById('bottom')
        let _X = event.pageX
        let _s = this.visualData.chartsGlobalSetting
        if (_X >= _s.bgWidth - 4) {
          _X = _s.bgWidth - 4
        }
        let _width = this.currentDivWidth + _X - this.currentX
        if (_width <= _s.minChartWidth) {
          u_bottom.style.width = u_top.style.width = _s.minChartWidth + 'px'
          this.currentItem.width = _s.minChartWidth
        } else {
          u_bottom.style.width = u_top.style.width = _width + 'px'
          this.currentItem.width = _width
        }
      },

      // 拖动下边界
      bottomMove(event) {
        let u_right = document.getElementById('right')
        let u_left = document.getElementById('left')
        let _Y = event.pageY
        let _s = this.visualData.chartsGlobalSetting
        if (_Y >= _s.bgHeight + 60) {
          _Y = _s.bgHeight + 60
        }
        let _height = this.currentDivHeight + _Y - this.currentY
        if (_height <= _s.minChartHeight) {
          this.currentItem.height = _s.minChartHeight
          u_left.style.height = u_right.style.height = _s.minChartHeight + 'px'
        } else {
          u_left.style.height = u_right.style.height = _height + 'px'
          this.currentItem.height = _height
        }
      },

      // 拖动上边界
      topMove(event) {
        let u_right = document.getElementById('right')
        let u_left = document.getElementById('left')
        let _Y = event.pageY
        if (_Y <= 69) {
          _Y = 69
        }
        let _s = this.visualData.chartsGlobalSetting
        let _height = this.currentDivHeight + this.currentY - _Y
        if (_height <= _s.minChartHeight) {
          this.currentItem.height = _s.minChartHeight
          u_left.style.height = u_right.style.height = _s.minChartHeight + 'px'
          this.currentItem.top = this.currentDivHeight + this.currentDivY - _s.minChartHeight
        } else {
          this.currentItem.height = _height
          u_left.style.height = u_right.style.height = _height + 'px'
          this.currentItem.top = this.currentDivY + _Y - this.currentY
        }
      },

      // 删除图表
      delChart(index) {
        this.visualData.chartsList.splice(index, 1)
      },

      // 修改图表数据
      changeChart(index) {
        this.$message({
          message: `此功能暂未开放！${index}`,
          type: "warning"
        })
      },

      // 保存图表
      saveCharts() {
        saveVisualPage(this.visualData).then(res => {
          if (res.saveSuccess) {
            this.$message({
              message: "保存成功",
              type: "success",
            })
          }
        })
      },

      // 返回可视化页面列表页
      backToVisList() {
        this.$router.push({
          name: "visualList"
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../static/lib/font_hwd63mppy8o/iconfont.css';

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

      .charts-wrapper {
        border: 1px solid rgba(25, 186, 139, .17);
        background: rgba(255, 255, 255, .04) url("../../static/img/bgvisual/box.png") no-repeat;
        background-size: cover;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .left-border {
          width: 4px;
          background-color: transparent;
          position: absolute;
          cursor: w-resize;
          z-index: 100;
        }

        .top-border {
          height: 4px;
          background-color: transparent;
          position: absolute;
          cursor: n-resize;
          z-index: 100;
        }

        .right-border {
          width: 4px;
          background-color: transparent;
          position: absolute;
          cursor: e-resize;
          z-index: 100;
        }

        .bottom-border {
          height: 4px;
          background-color: transparent;
          position: absolute;
          cursor: s-resize;
          z-index: 100;
        }

        .border-span {
          display: block;
          position: absolute;
          width: 20px;
          height: 20px;
        }

        span.top-left {
          top: 0;
          left: 0;
          border-top: 2px solid #00c0ff;
          border-left: 2px solid #00c0ff;
        }

        span.top-right {
          top: 0;
          right: 0;
          border-top: 2px solid #00c0ff;
          border-right: 2px solid #00c0ff;
        }

        span.bottom-left {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid #00c0ff;
          border-left: 2px solid #00c0ff;
        }

        span.bottom-right {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid #00c0ff;
          border-right: 2px solid #00c0ff;
        }
      }

      #canvas_bg, .earth-rotate {
        position: absolute;
        left: 0;
        top: 0;
      }

      .earth-rotate {
        background: url("../../static/img/bgvisual/bg.png") no-repeat top center;
        background-size: cover;

        .title {
          width: 20%;
          height: 40px;
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'hyz', serif;
          color: #fff;
          line-height: 40px;
          text-align: center;
          text-shadow: 0 0 15px #59FFF4;
          font-size: 40px;

          .p2 {
            font-size: 20px;
          }
        }

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
      color: #fff;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;

      .back-btn {
        height: 100%;
        line-height: 65px;
        display: inline-block;
        margin-right: 15px;

        button {
          padding: 7px;
        }
      }

      span {
        display: inline-block;
        padding-right: 15px;
      }

      .charts-select-menu {
        height: 100%;
        line-height: 65px;
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

      .save-charts {
        height: 100%;
        line-height: 65px;
        float: right;
      }
    }

    .charts-tools {

      padding-right: 20px;

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
