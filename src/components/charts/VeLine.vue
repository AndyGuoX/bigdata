<template>
  <div class="line" ref="line" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'

  export default {
    name: "VeLine",
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
        tooltip: {trigger: "axis", axisPointer: {lineStyle: {color: "#dddc6b"}}},
        legend: {top: "0%", data: this.data.legend, textStyle: {color: "rgba(255,255,255,.5)", fontSize: "12",}},
        grid: {left: "10", top: "30", right: "10", bottom: "10", containLabel: true},
        xAxis: [{
          type: "category",
          boundaryGap: false,
          axisLabel: {textStyle: {color: "rgba(255,255,255,.6)", fontSize: 12,},},
          axisLine: {lineStyle: {color: "rgba(255,255,255,.2)"}},
          data: this.data.xAxis
        }, {axisPointer: {show: false}, axisLine: {show: false}, position: "bottom", offset: 20,}],
        yAxis: [{
          type: "value",
          axisTick: {show: false},
          axisLine: {lineStyle: {color: "rgba(255,255,255,.1)"}},
          axisLabel: {textStyle: {color: "rgba(255,255,255,.6)", fontSize: 12,},},
          splitLine: {lineStyle: {color: "rgba(255,255,255,.1)"}}
        }],
        series: [{
          name: "安卓",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {normal: {color: "#0184d5", width: 2}},
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "rgba(1, 132, 213, 0.4)"
              }, {offset: 0.8, color: "rgba(1, 132, 213, 0.1)"}], false), shadowColor: "rgba(0, 0, 0, 0.1)",
            }
          },
          itemStyle: {normal: {color: "#0184d5", borderColor: "rgba(221, 220, 107, .1)", borderWidth: 12}},
          data: this.data.yAxis[0]
        }, {
          name: "IOS",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {normal: {color: "#00d887", width: 2}},
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "rgba(0, 216, 135, 0.4)"
              }, {offset: 0.8, color: "rgba(0, 216, 135, 0.1)"}], false), shadowColor: "rgba(0, 0, 0, 0.1)",
            }
          },
          itemStyle: {normal: {color: "#00d887", borderColor: "rgba(221, 220, 107, .1)", borderWidth: 12}},
          data: this.data.yAxis[1]
        },]
      }

      this.myChart = echarts.init(this.$refs.line)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .line {
    width: 100%;
    height: 100%;
    padding: 15px;
  }
</style>