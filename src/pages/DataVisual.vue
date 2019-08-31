<template>
    <div class="data-visual">
        <transition name="el-zoom-in-top">
            <div ref="charts_select_header" class="charts-select-header" v-show="isShow">
                <span>2D图表</span>
                <ul class="charts-select-menu">
                    <li>
                        <i data-type="charts" data-name="histogram" class="iconfont icon-charts" draggable="true"
                           @dragstart="dragstart"></i>
                    </li>
                    <li>
                        <i class="iconfont icon-charts1" draggable="true"></i>
                    </li>
                    <li>
                        <i class="iconfont icon-fendianbaobiao" draggable="true"></i>
                    </li>
                    <li>
                        <i class="iconfont icon-addcharts-dapan" draggable="true"></i>
                    </li>
                </ul>
                <span>3D图表</span>
                <ul class="charts-select-menu">
                    <li>
                        <i class="iconfont icon-bar_d_chart" draggable="true"></i>
                    </li>
                </ul>
            </div>
        </transition>
        <div class="charts-content-wrapper" style="overflow:auto;width:100%;height:1080px">
            <div class="charts-content"
                 :style="`width:${chartsGlobalSetting.bgWidth};height:${chartsGlobalSetting.bgHeight};position:relative;`"
                 @drop="drop"
                 @dragover="dragover">
                <div class="charts-wrapper"
                     v-for="(item,index) in chartsList" :key="index"
                     :style="`position: absolute;top:${item.top};left:${item.left};width:${item.width};height:${item.height};
                     index:${item.zIndex}`"
                     @mousedown="mouseDown($event)"
                     @mouseup="mouseUp($event)">
                    <Histogram :data="item.data"
                               width="100%"
                               height="100%"
                    ></Histogram>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Histogram from 'v-charts/lib/histogram.common'

    export default {
        name: "DataVisual",
        components: {
            Histogram,
        },
        data() {
            return {
                isShow: false,
                chartsList: [],
                currentX: 0,
                currentY: 0,
                currentDivX: 0,
                currentDivY: 0,
                chartsGlobalSetting: {
                    "bgWidth": "1900px",
                    "bgHeight": "1080px"
                }
            }
        },
        mounted() {
            this.isShow = true;
            let obj = this.$refs.charts_select_header;

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
                    chartObj.width = "400px";
                    chartObj.height = "400px";
                    // 图表不能生成在画布外
                    _getX = _getX + chartObj.width > this.chartsGlobalSetting.bgWidth ? this.chartsGlobalSetting.bgWidth - chartObj.width : _getX;
                    _getY = _getY + chartObj.height > this.chartsGlobalSetting.bgHeight ? this.chartsGlobalSetting.bgHeight - chartObj.height : _getY;
                    chartObj.left = _getX + 'px';
                    chartObj.top = _getY + 'px';
                    chartObj.zIndex = this.chartsList.length;
                    if (name === 'histogram') {
                        chartObj.data = {
                            columns: ['日期', '访问用户', '下单用户', '下单率'],
                            rows: [
                                {'日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32},
                                {'日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26},
                                {'日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76},
                                {'日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49},
                                {'日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323},
                                {'日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78}
                            ]
                        };
                    }
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
                let DivObj = event.path[4];
                DivObj.addEventListener("mousemove", this.mouseMove);
                DivObj.addEventListener("mouseup", this.mouseUp);
                this.currentX = event.clientX;
                this.currentY = event.clientY;
                this.currentDivX = parseInt(DivObj.style.left);
                this.currentDivY = parseInt(DivObj.style.top);
            },

            // 鼠标移动事件
            mouseMove(event) {
                var DivObj = event.path[4];
                let _X = this.currentDivX + event.clientX - this.currentX;
                let _Y = this.currentDivY + event.clientY - this.currentY;
                // 不允许拖拽超出画布
                _X = _X > 0 ? _X : 0;
                _X = _X <= parseInt(this.chartsGlobalSetting.bgWidth) - parseInt(DivObj.style.width) ? _X : parseInt(this.chartsGlobalSetting.bgWidth) - parseInt(DivObj.style.width);
                _Y = _Y > 0 ? _Y : 0;
                _X = _X <= parseInt(this.chartsGlobalSetting.bgHeight) - parseInt(DivObj.style.height) ? _X : parseInt(this.chartsGlobalSetting.bgHeight) - parseInt(DivObj.style.height);
                DivObj.style.left = _X + 'px';
                DivObj.style.top = _Y + 'px';
            },

            // 鼠标抬起事件
            mouseUp(event) {
                event.path[4].removeEventListener("mousemove", this.mouseMove);
                event.path[4].removeEventListener("mouseup", this.mouseUp);
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
    }
</style>