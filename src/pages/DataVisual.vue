<template>
    <div class="data-visual">
        <transition name="el-zoom-in-top">
            <div ref="charts_select_header" class="charts-select-header" v-show="isShow">
                <span>2D图表</span>
                <ul class="charts-select-menu">
                    <li>
                        <i class="iconfont icon-charts" draggable="true"></i>
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
        <div class="charts-content" style="width:1920px;height:1080px;">

        </div>
    </div>
</template>

<script>
    export default {
        name: "DataVisual",
        data() {
            return {
                isShow: false,
            }
        },
        mounted() {
            this.isShow = true;
            var obj = this.$refs.charts_select_header;

            window.onscroll = function () {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                console.log(scrollTop, 85);
                if (scrollTop < 85) {
                    obj.style.position = 'relative';
                } else {
                    obj.style.position = 'fixed';
                    obj.style.top = '0';
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../static/lib/font_jiygtfou2p/iconfont.css';

    .data-visual {
        width: 100%;
        overflow: auto;

        .charts-select-header {
            width: 100%;
            height: 65px;
            background-color: #2b3843;
            text-align: left;
            padding: 0 20px;
            line-height: 65px;
            color: #fff;
            position: relative;

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