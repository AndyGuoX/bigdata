<template>
  <div class="pie" ref="pie" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'

  export default {
    name: "Pie",
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
        title: [{text: this.data.name, left: "center", textStyle: {color: "#fff", fontSize: "16"}}],
        tooltip: {
          trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)", position: function (j) {
            return [j[0] + 10, j[1] - 10]
          }
        },
        legend: {
          bottom: "10%",
          itemWidth: 10,
          itemHeight: 10,
          data: this.data.legend,
          textStyle: {color: "rgba(255,255,255,.5)", fontSize: "12",}
        },
        series: [{
          name: this.data.name,
          type: "pie",
          center: ["50%", "42%"],
          radius: ["40%", "60%"],
          color: ["#065aab", "#066eab", "#0682ab", "#0696ab", "#06a0ab", "#06b4ab", "#06c8ab", "#06dcab", "#06f0ab"],
          label: {show: false},
          labelLine: {show: false},
          data: this.data.data,
        }]
      }

      this.myChart = echarts.init(this.$refs.pie)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .pie {
    width: 100%;
    height: 100%;
    padding: 15px;
  }
</style>