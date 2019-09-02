<template>
    <div class="data-visual">
        <transition name="el-zoom-in-top">
            <div ref="charts_select_header" class="charts-select-header" v-show="isShow">
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
                        <i data-type="charts" data-name="histogram3D" class="iconfont icon-bar_d_chart"
                           @click="notOpen"></i>
                    </li>
                </ul>
            </div>
        </transition>
        <div class="charts-content-wrapper"
             style="overflow:auto;width:100%;height:auto;">
            <div class="charts-content"
                 :style="`width:${chartsGlobalSetting.bgWidth}px;height:${chartsGlobalSetting.bgHeight}px;position:relative;`"
                 @drop="drop"
                 @dragover="dragover">
                <div class="charts-wrapper"
                     v-for="(item,index) in chartsList" :key="index"
                     :style="`position: absolute;top:${item.top}px;left:${item.left}px;width:${item.width}px;height:${item.height}px;
                     index:${item.zIndex}`"
                     @mouseover="item.chartsToolHeight=30"
                     @mouseout="mouseOut(item)">
                    <div class="charts-tools"
                         :style="`height:${item.chartsToolHeight}px;background-color:#99dfff;transition:0.3s;`">
                        <ul>
                            <li style="width:50%;cursor:move;font-size:14px;"
                                @mousedown="mouseDown($event)"
                                @mouseup="mouseUp($event)">拖动
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
    import {getChartDefaultData} from "@/utils";

    export default {
        name: "DataVisual",
        components: {
            Histogram,
            VeLine,
            Pie,
            Gauge,
        },
        data() {
            return {
                isShow: false,
                chartsList: [],
                currentX: 0,
                currentY: 0,
                currentDivX: 0,
                currentDivY: 0,
                currentCanvas: null,
                currentCanvasDiv: null,
                mouseoutFlag: true,
                chartsGlobalSetting: {
                    "bgWidth": 1900,
                    "bgHeight": 1080
                }
            }
        },
        mounted() {
            this.isShow = true;
            let obj = this.$refs.charts_select_header;

            // 滚动页面到85px时固定图表选项行
            window.onscroll = function () {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop < 85) {
                    obj.style.position = 'relative';
                } else {
                    obj.style.position = 'fixed';
                }
            }
        },
        methods: {
            // 拖拽事件开始
            dragstart(event) {
                let domData = event.target.dataset;
                event.dataTransfer.setData('type', domData.type);
                event.dataTransfer.setData('name', domData.name);
            },

            // 绑定在可放置的元素上
            drop(event) {
                let type = event.dataTransfer.getData('type');
                let name = event.dataTransfer.getData('name');
                if (type === 'charts') {
                    let _getX = event.offsetX,
                        _getY = event.offsetY;
                    if (event.path[0].tagName === 'CANVAS') {
                        // 当图表生成位置与已有图表重合时，继续在此位置生成。
                        let parentDiv = event.path[4];
                        _getX += parseInt(parentDiv.style.left);
                        _getY += parseInt(parentDiv.style.top);
                    }
                    let chartObj = {};
                    chartObj.width = 400;
                    chartObj.height = 400;
                    chartObj.chartsToolHeight = 0;
                    // 图表不能生成在画布外
                    chartObj.left = _getX + chartObj.width > this.chartsGlobalSetting.bgWidth ? this.chartsGlobalSetting.bgWidth - chartObj.width : _getX;
                    chartObj.top = _getY + chartObj.height > this.chartsGlobalSetting.bgHeight ? this.chartsGlobalSetting.bgHeight - chartObj.height : _getY;
                    chartObj.zIndex = this.chartsList.length;
                    chartObj.data = getChartDefaultData(name);
                    chartObj.chartName = name;
                    this.chartsList.push(chartObj);
                }
            },

            // 拖拽过程中触发
            // 必须阻止某一 DOM 元素对 dragover 的默认行为，才能使 drop 事件在其上正确执行
            dragover(event) {
                event.preventDefault();
            },

            // 鼠标按下事件
            mouseDown(event) {
                this.mouseoutFlag = false;
                let DivObj = this.currentCanvasDiv = event.path[3];
                document.addEventListener("mousemove", this.mouseMove);
                document.addEventListener("mouseup", this.mouseUp);
                this.currentX = event.clientX;
                this.currentY = event.clientY;
                this.currentDivX = parseInt(DivObj.style.left);
                this.currentDivY = parseInt(DivObj.style.top);
            },

            // 鼠标移动事件
            mouseMove(event) {
                let _X = this.currentDivX + event.clientX - this.currentX;
                let _Y = this.currentDivY + event.clientY - this.currentY;
                // 不允许拖拽超出画布
                // 左边界
                _X = _X > 0 ? _X : 0;
                // 右边界
                _X = _X <= this.chartsGlobalSetting.bgWidth - parseInt(this.currentCanvasDiv.style.width) ? _X : this.chartsGlobalSetting.bgWidth - parseInt(this.currentCanvasDiv.style.width);
                // 上边界
                _Y = _Y > 0 ? _Y : 0;
                // 下边界
                _Y = _Y <= this.chartsGlobalSetting.bgHeight - parseInt(this.currentCanvasDiv.style.height) ? _Y : this.chartsGlobalSetting.bgHeight - parseInt(this.currentCanvasDiv.style.height);
                this.currentCanvasDiv.style.left = _X + 'px';
                this.currentCanvasDiv.style.top = _Y + 'px';
            },

            // 鼠标抬起事件
            mouseUp() {
                this.mouseoutFlag = true;
                document.removeEventListener("mousemove", this.mouseMove);
                document.removeEventListener("mouseup", this.mouseUp);
            },

            // 鼠标移除
            mouseOut(item) {
                item.chartsToolHeight = this.mouseoutFlag ? 0 : 30;
            },

            // 删除图表
            delChart(index) {
                this.chartsList.splice(index, 1);
            },

            // 修改图表数据
            changeChart(index) {
                console.log(index);
                this.$message({
                    message: "此功能暂未开放！",
                    type: "warning"
                })
            },

            // 暂未开放提醒
            notOpen() {
                this.$message({
                    message: "3D图表暂不支持！",
                    type: "warning"
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../static/lib/font_jiygtfou2p/iconfont.css';

    .data-visual {
        width: 100%;

        .charts-select-header {
            width: 100%;
            height: 65px;
            background-color: #2b3843;
            text-align: left;
            padding: 0 20px;
            line-height: 65px;
            color: #fff;
            position: relative;
            top: 0;
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
            overflow: hidden;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;

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