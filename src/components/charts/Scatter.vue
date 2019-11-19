<template>
  <div class="scatter" ref="scatter" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'

  export default {
    name: "Scatter",
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
      let _this = this
      let data = this.data
      let series = []
      for (let i = 0; i < data.data.length; i++) {
        series.push({
          name: data.data[i].name,
          data: data.data[i].value,
          type: 'scatter',
          symbolSize: function () {
            return parseInt(_this.height) / data.data[i].numScale
          },
          label: {
            emphasis: {
              show: true,
              position: 'top'
            }
          },
          itemStyle: {
            normal: {
              color: data.data[i].color
            }
          }
        })
      }
      let option = {
        title: {
          text: data.name,
          textStyle: {
            color: 'rgba(255,255,255,.7)',
            fontSize: 16
          },
          top: 0
        },
        legend: {
          right: 10,
          top: 15,
          data: ['苹果', '梨'],
          textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: 12
          },
          itemWidth: 8
        },
        grid: {
          bottom: 0,
          right: 10,
          left: 10,
          top: 38,
          containLabel: true
        },
        xAxis: {
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            show: true,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          },
          axisLine: {
            show: false
          },
          scale: true,
          axisTick: {show: false},
          minInterval: 10,
          axisLabel: {
            interval: 'auto',
            show: true,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 10
            },
          },
        },
        series: series
      }

      this.myChart = echarts.init(this.$refs.scatter)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .scatter {
    width: 100%;
    height: 100%;
    padding: 15px;
  }
</style>
