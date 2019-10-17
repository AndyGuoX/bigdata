<template>
  <div class="histogram3D" ref="histogram3D" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import "echarts-gl"

  export default {
    name: "Histogram3D",
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
        tooltip: {},
        visualMap: {
          show: false,
          max: 20,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        },
        xAxis3D: {
          type: 'category',
          data: this.data.xAxis3D,
          axisLabel: {show: true, textStyle: {color: "rgba(255,255,255,.6)", fontSize: "12",},},
          axisTick: {show: false,},
          axisLine: {show: true, lineStyle: {color: "rgba(255,255,255,.1	)", width: 1, type: "solid"},},
          splitLine: {lineStyle: {color: "rgba(255,255,255,.1)",}}
        },
        yAxis3D: {
          type: 'category',
          data: this.data.yAxis3D,
          axisLabel: {show: true, textStyle: {color: "rgba(255,255,255,.6)", fontSize: "12",},},
          axisTick: {show: false,},
          axisLine: {show: true, lineStyle: {color: "rgba(255,255,255,.1	)", width: 1, type: "solid"},},
          splitLine: {lineStyle: {color: "rgba(255,255,255,.1)",}}
        },
        zAxis3D: {
          type: 'value',
          axisLabel: {show: true, textStyle: {color: "rgba(255,255,255,.6)", fontSize: "12",},},
          axisTick: {show: false,},
          axisLine: {show: true, lineStyle: {color: "rgba(255,255,255,.1	)", width: 1, type: "solid"},},
          splitLine: {lineStyle: {color: "rgba(255,255,255,.1)",}}
        },
        grid3D: {
          boxWidth: 200,
          boxDepth: 80,
        },
        series: [{
          type: 'bar3D',
          data: this.data.zAxis3D.map(function (item) {
            return {
              value: [item[1], item[0], item[2]],
            }
          }),
          shading: 'color',
          label: {
            textStyle: {
              fontSize: 16,
              borderWidth: 1
            }
          },
          emphasis: {
            label: {
              textStyle: {
                fontSize: 20,
                color: '#900'
              }
            },
            itemStyle: {
              color: '#900'
            }
          },
        }]
      }

      this.myChart = echarts.init(this.$refs.histogram3D)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .histogram3D {
    width: 100%;
    height: 100%;
  }
</style>