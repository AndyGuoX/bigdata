<template>
  <div class="histogram3D" ref="histogram3D"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import "echarts-gl"

  export default {
    name: "Histogram3D",
    props: ["data"],
    watch: {
      data() {
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
          data: this.data.xAxis3D
        },
        yAxis3D: {
          type: 'category',
          data: this.data.yAxis3D
        },
        zAxis3D: {
          type: 'value'
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

      let myChart = echarts.init(this.$refs.histogram3D)
      myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .histogram3D {
    width: 100%;
    height: 100%;
  }
</style>