<template>
  <div class="histogram" ref="histogram" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'

  export default {
    name: "Histogram",
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
          this.$nextTick(function () {
            this.myChart.resize()
          })
        })
      },
      height() {
        this.$nextTick(function () {
          this.$nextTick(function () {
            this.myChart.resize()
          })
        })
      }
    },
    mounted() {
      let option = {
        tooltip: {trigger: "axis", axisPointer: {type: "shadow"}},
        grid: {left: "0%", top: "10px", right: "0%", bottom: "4%", containLabel: true},
        xAxis: {
          type: "category",
          data: this.data.xAxis,
          axisLine: {show: true, lineStyle: {color: "rgba(255,255,255,.1)", width: 1, type: "solid"},},
          axisTick: {show: false,},
          axisLabel: {
            interval: 0,
            show: true,
            textStyle: {color: "rgba(255,255,255,.6)", fontSize: "12",},
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {show: true, textStyle: {color: "rgba(255,255,255,.6)", fontSize: "12",},},
          axisTick: {show: false,},
          axisLine: {show: true, lineStyle: {color: "rgba(255,255,255,.1	)", width: 1, type: "solid"},},
          splitLine: {lineStyle: {color: "rgba(255,255,255,.1)",}}
        },
        series: {
          type: "bar",
          data: this.data.yAxis,
          barWidth: "35%",
          itemStyle: {normal: {color: "#2f89cf", opacity: 1, barBorderRadius: 5,}}
        }
      }

      this.myChart = echarts.init(this.$refs.histogram)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .histogram {
    padding: 15px;
  }
</style>
