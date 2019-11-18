<template>
  <div class="data-visual">
    <div ref="charts_select_header" class="charts-select-header">
      <div class="back-btn">
        <el-button type="primary" icon="el-icon-arrow-left" @click="backToVisList">返回列表</el-button>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          2D图表<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item >
            <p data-type="charts" data-name="Histogram" draggable="true" @dragstart="dragstart">
              <i  class="iconfont icon-charts" ></i>柱状图
            </p>
          </el-dropdown-item>
          <el-dropdown-item>
            <p data-type="charts" data-name="VeLine" draggable="true" @dragstart="dragstart">
              <i  class="iconfont icon-charts1" ></i>折线图
            </p>
          </el-dropdown-item>
          <el-dropdown-item>
            <p data-type="charts" data-name="Pie" draggable="true" @dragstart="dragstart">
              <i  class="iconfont icon-fendianbaobiao"></i>饼图
            </p>
          </el-dropdown-item>
          <el-dropdown-item>
            <p data-type="charts" data-name="Radar" draggable="true" @dragstart="dragstart">
              <i  class="iconfont icon-radar"></i>雷达图
            </p>  
          </el-dropdown-item>
          <el-dropdown-item>
            <p data-type="charts" data-name="Scatter" draggable="true" @dragstart="dragstart">
              <i  class="iconfont"></i>散点图
            </p>  
          </el-dropdown-item>
          <el-dropdown-item>
            <p data-type="charts" data-name="Funnel" draggable="true" @dragstart="dragstart">
              <i  class="iconfont"></i>漏斗图
            </p>  
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown>
        <span class="el-dropdown-link">
          3D图表<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <p data-type="charts" data-name="Histogram3D" draggable="true" @dragstart="dragstart">
              <i  class="iconfont icon-bar_d_chart"></i>3D柱状图
            </p>  
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
     <!--  <span>2D图表</span>
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
      </ul> -->
      <!-- <span>3D图表</span>
      <ul class="charts-select-menu">
        <li>
          <i data-type="charts" data-name="Histogram3D" class="iconfont icon-bar_d_chart"
             draggable="true" @dragstart="dragstart"></i>
        </li>
      </ul> -->
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
          <div class="left-border drag-border" id="left" ref="left"
               :style="`height:${item.height}px;left:0;top:0;background-color:${item.virtualBorderColor}`"
               @mousedown="c_mouseDown($event,item)"></div>
          <div class="top-border drag-border" id="top" ref="top" :style="`width:${item.width}px;left:0;top:0;
          background-color:${item.virtualBorderColor}`" @mousedown="c_mouseDown($event,item)"></div>
          <div class="right-border drag-border" id="right" ref="right"
               :style="`height:${item.height}px;right:0;top:0;background-color:${item.virtualBorderColor}`"
               @mousedown="c_mouseDown($event,item)"></div>
          <div class="bottom-border drag-border" id="bottom" ref="bottom"
               :style="`width:${item.width}px;left:0;bottom:0;background-color:${item.virtualBorderColor}`"
               @mousedown="c_mouseDown($event,item)"></div>
          <span class="top-left border-span" id="tl" @mousedown="c_mouseDown($event,item)"></span>
          <span class="top-right border-span" id="tr" @mousedown="c_mouseDown($event,item)"></span>
          <span class="bottom-left border-span" id="bl" @mousedown="c_mouseDown($event,item)"></span>
          <span class="bottom-right border-span" id="br" @mousedown="c_mouseDown($event,item)"></span>
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
  import Scatter from '@/components/charts/Scatter'
  import Funnel from '@/components/charts/Funnel'
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
      Scatter,
      Histogram3D,
      Funnel
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
            "bgWidth": 1920,
            "bgHeight": 1080,
            "minChartWidth": 0,
            "minChartHeight": 0,
            "chartWidth": 0,
            "chartHeight": 0,
            "gridNum": 40
          },
        }
      }
    },
    mounted() {
      this.setChartWH()
      let visualPageId = this.$route.query.visualPageId // 获取路由参数
      if (visualPageId) { // 如果id存在则为修改可视化页面
        this.visualData.visualPageId = visualPageId
        viewVisualPage({"visualPageId": visualPageId}).then(res => {
          if (res.hasPage) {
            Object.assign(this.visualData, res.visualData.visualPageData);
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
        let _s = this.visualData.chartsGlobalSetting
        let _n_w = _s.bgWidth / _s.gridNum
        let _n_h = _s.bgHeight / _s.gridNum
        const path = event.path || (event.composedPath && event.composedPath())// 兼容火狐和Safari
        let type = event.dataTransfer.getData('type')
        let name = event.dataTransfer.getData('name')
        if (type === 'charts') {
          let _getX = Math.floor(event.offsetX / _n_w) * _n_w,
            _getY = Math.floor(event.offsetY / _n_h) * _n_h
          if (path[0].tagName === 'CANVAS') {
            // 当图表生成位置与已有图表重合时，继续在此位置生成。
            let parentDiv = path[3]
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
            chartObj.virtualBorderColor = 'transparent'
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
        let _n_w = _s.bgWidth / _s.gridNum
        let _n_h = _s.bgHeight / _s.gridNum
        let _X = this.currentDivX + Math.floor((event.clientX - this.currentX) / _n_w) * _n_w
        let _Y = this.currentDivY + Math.floor((event.clientY - this.currentY) / _n_h) * _n_h
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
        // this.currentItem.virtualBorderColor = "#f5a623"
      },

      // div大小变化鼠标抬起事件
      c_mouseUp() {
        document.removeEventListener("mousemove", eval('this.' + this.currentBorder + 'Move'))
        document.removeEventListener("mouseup", this.c_mouseUp)
        // this.currentItem.virtualBorderColor = "transparent"
      },

      // 拖动左边界
      leftMove(event) {
        let _s = this.visualData.chartsGlobalSetting
        let _n_w = _s.bgWidth / _s.gridNum
        let _X = event.pageX
        if (_X <= 0) {
          _X = 0
        }
        let _diff = (this.currentX - _X > 0) ? Math.floor((this.currentX - _X) / _n_w) * _n_w
          : Math.ceil((this.currentX - _X) / _n_w) * _n_w
        let _width = this.currentDivWidth + _diff
        if (_width <= _s.minChartWidth) {
          this.currentItem.width = _s.minChartWidth
          this.currentItem.left = this.currentDivWidth + this.currentDivX - _s.minChartWidth
        } else {
          this.currentItem.width = _width
          this.currentItem.left = this.currentDivX - _diff
        }
      },

      // 拖动右边界
      rightMove(event) {
        let _s = this.visualData.chartsGlobalSetting
        let _n_w = _s.bgWidth / _s.gridNum
        let _X = event.pageX
        if (_X >= _s.bgWidth) {
          _X = _s.bgWidth
        }
        let _diff = (this.currentX - _X > 0) ? Math.floor((this.currentX - _X) / _n_w) * _n_w
          : Math.ceil((this.currentX - _X) / _n_w) * _n_w
        let _width = this.currentDivWidth - _diff
        if (_width <= _s.minChartWidth) {
          this.currentItem.width = _s.minChartWidth
        } else {
          this.currentItem.width = _width
        }
      },

      // 拖动下边界
      bottomMove(event) {
        let _s = this.visualData.chartsGlobalSetting
        let _n_h = _s.bgHeight / _s.gridNum
        let _Y = event.pageY
        if (_Y >= _s.bgHeight + 65) {
          _Y = _s.bgHeight + 65
        }
        let _diff = (this.currentY - _Y > 0) ? Math.floor((this.currentY - _Y) / _n_h) * _n_h
          : Math.ceil((this.currentY - _Y) / _n_h) * _n_h
        let _height = this.currentDivHeight - _diff
        if (_height <= _s.minChartHeight) {
          this.currentItem.height = _s.minChartHeight
        } else {
          this.currentItem.height = _height
        }
      },

      // 拖动上边界
      topMove(event) {
        let _s = this.visualData.chartsGlobalSetting
        let _n_h = _s.bgHeight / _s.gridNum
        let _Y = event.pageY
        if (_Y <= 65) {
          _Y = 65
        }
        let _diff = (this.currentY - _Y > 0) ? Math.floor((this.currentY - _Y) / _n_h) * _n_h
          : Math.ceil((this.currentY - _Y) / _n_h) * _n_h
        let _height = this.currentDivHeight + _diff
        if (_height <= _s.minChartHeight) {
          this.currentItem.height = _s.minChartHeight
          this.currentItem.top = this.currentDivHeight + this.currentDivY - _s.minChartHeight
        } else {
          this.currentItem.height = _height
          this.currentItem.top = this.currentDivY - _diff
        }
      },

      //拖动左上角
      tlMove(e){
        this.leftMove(e);
        this.topMove(e);
      },
      //拖动右上角
      trMove(e){
        this.rightMove(e);
        this.topMove(e);
      },
      //拖动左下角
      blMove(e){
        this.leftMove(e);
        this.bottomMove(e);
      },
      //拖动右下角
      brMove(e){
        this.rightMove(e);
        this.bottomMove(e);
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
      },

      // 计算图表的最小宽度和高度
      setChartWH() {
        let _s = this.visualData.chartsGlobalSetting
        let _w = _s.bgWidth / _s.gridNum
        let _h = _s.bgHeight / _s.gridNum
        _s.minChartWidth = _w * 6
        _s.minChartHeight = _h * 6
        _s.chartWidth = _w * 10
        _s.chartHeight = _h * 10
      },
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

        .drag-border {
          background-color: transparent;
          position: absolute;
          z-index: 100;
        }

        .left-border {
          width: 4px;
          cursor: w-resize;
        }

        .top-border {
          height: 4px;
          cursor: n-resize;
        }

        .right-border {
          width: 4px;
          cursor: e-resize;
        }

        .bottom-border {
          height: 4px;
          cursor: s-resize;
        }

        .border-span {
          display: block;
          position: absolute;
          width: 20px;
          height: 20px;
          z-index:101;
        }

        span.top-left {
          top: 0;
          left: 0;
          border-top: 2px solid #00c0ff;
          border-left: 2px solid #00c0ff;
          cursor:nw-resize;
        }

        span.top-right {
          top: 0;
          right: 0;
          border-top: 2px solid #00c0ff;
          border-right: 2px solid #00c0ff;
          cursor:ne-resize;
        }

        span.bottom-left {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid #00c0ff;
          border-left: 2px solid #00c0ff;
          cursor:sw-resize;
        }

        span.bottom-right {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid #00c0ff;
          border-right: 2px solid #00c0ff;
          cursor:se-resize;
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
  
      .el-dropdown-link{
        color:#fff;
      }
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
