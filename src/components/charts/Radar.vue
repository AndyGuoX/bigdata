<template>
  <div class="radar" ref="radar" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'

  export default {
    name: "Radar",
    data() {
      return {
        myChart: null,
      }
    },
    props: ["data", "width", "height"],
    watch: {
      data() {
      },
      width() {
        this.$nextTick(function () {
          this.myChart.resize()
        })
      },
      height() {
        this.$nextTick(function () {
          this.myChart.resize()
        })
      }
    },
    mounted() {
      let option = {
        color: ['#623ad1', '#3383fc'],
        tooltip: {},
        radar: [{
          indicator: this.data.maxVal,
          center: ['50%', '60%'],
          radius: '65%',
          startAngle: 90,
          name: {
            formatter: '{value}',
            textStyle: {
              fontSize: 12, //外圈标签字体大小
              color: '#FFF' //外圈标签字体颜色
            }
          },
          splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: { // 分隔区域的样式设置。
              color: [], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          axisLine: { //指向外圈文本的分隔线样式
            lineStyle: {
              color: '#24214e'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#24214e', // 分隔线颜色
              width: 1, // 分隔线线宽
            }
          }
        },],
        series: [{
          name: '雷达图',
          type: 'radar',
          data: [
            {
              name: '2016',
              value: this.data.realVal[0],
              areaStyle: {
                normal: { // 单项区域填充样式
                  opacity: 1 // 区域透明度
                }
              },
              symbolSize: 0, // 单个数据标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
            }, {
              name: '2017',
              value: this.data.realVal[1],
              symbolSize: 0,
              areaStyle: {
                normal: { // 单项区域填充样式
                  color: {
                    type: 'linear',
                    x: 0, //右
                    y: 0, //下
                    x2: 1, //左
                    y2: 1, //上
                    colorStops: [{
                      offset: 0,
                      color: '#3cd2f3'
                    },
                      {
                        offset: 1,
                        color: '#306eff'
                      }],
                    globalCoord: false
                  },
                  opacity: 1 // 区域透明度

                }
              },
            }]
        }]
      }

      this.myChart = echarts.init(this.$refs.radar)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .radar {
    width: 100%;
    height: 100%;
    padding: 15px;
  }
</style>