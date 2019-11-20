<template>
  <div class="sunburst" ref="sunburst" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'

  export default {
    name: "Sunburst",
    data() {
      return {
        myChart: null
      }
    },
    props: ["data", "width", "height"],
    watch: {
      data() {
      },
      width() {
        this.$nextTick(function () {
          this.myChart.resize()
          // if( parseInt(this.width) <= 435){
          // 	this.myChart._model.option.series[0].label.show = false
          // }else{
          // 	this.myChart._model.option.series[0].label.show = true
          // }
        })
      },
      height() {
        this.$nextTick(function () {
          this.myChart.resize()
        })
      }
    },
    mounted() {
      let data = this.data
      let option = {
        title: {
          text: '三大城市支付方式统计',
          textStyle: {
            color: 'rgba(255,255,255,.7)'
          },
          left: 'center'
        },
        tooltip: {
          show: true,
          // formatter:'{a},{b},{c},{d}'s
        },
        visualMap: {
          // type: 'continuous',
          min: 0,
          max: 10,
          show: false,
          inRange: {
            color: ["#065aab", "#066eab", "#0682ab", "#0696ab", "#06a0ab"]
          }
        },
        series: {
          name: data.name,
          type: 'sunburst',
          data: data.data,
          center: ['50%', '55%'],
          radius: [0, '75%'],
          label: {
            show: true,
            rotate: 'radial',
            color: '#fff',
            fontSize: 10
          },
        }
      }


      this.myChart = echarts.init(this.$refs.sunburst)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .sunburst {
    width: 100%;
    height: 100%;
    padding: 15px;
  }
</style>
