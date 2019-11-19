<template>
  <div class="data-visual">
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
                 position:relative;z-index:2;`">
        <div class="charts-wrapper"
             v-for="(item) in visualData.chartsList" :key="item.id"
             :style="`position: absolute;top:${item.top}px;
                     left:${item.left}px;
                     width:${item.width}px;height:${item.height}px;
                     index:${item.zIndex}`">
          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
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
  import LiquidFill from '@/components/charts/LiquidFill'
  import Sunburst from '@/components/charts/Sunburst'
  import Histogram3D from "@/components/charts/Histogram3D"
  import {operateBdBg} from "../../static/js/bigdataBg"
  import {viewVisualPage} from "@/request/api/user"

  export default {
    name: "DataVisual",
    components: {
      Histogram,
      VeLine,
      Pie,
      Radar,
      Histogram3D,
      Scatter,
      Funnel,
      LiquidFill,
      Sunburst
    },
    data() {
      return {
        visualData: {
          chartsGlobalSetting: {}
        }
      }
    },
    mounted() {
      let visualPageId = this.$route.query.visualPageId // 获取路由参数
      viewVisualPage({"visualPageId": visualPageId}).then(res => {
        if (res.hasPage) {
          this.visualData = res.visualData.visualPageData
          this.$nextTick(function () {
            operateBdBg(this.$refs.canv, this.$refs.canvWrap)
          })
        } else {
          this.$message({
            message: res.message,
            type: "error"
          })
        }
      })
    },
    methods: {}
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
  }
</style>
