<template>
  <div class="funnel" ref="funnel" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'

  export default {
    name: "Funnel",
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
    	let _this = this;
        let data = _this.data;
		let option = {
			title: {
		        text: data.name,
		        textStyle:{
		        	color:'rgba(255,255,255,.7)'
		        },
		        left:'center'
		    },
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c}%",
		        textStyle:{
		        	align:'left'
		        }
		    },
		    legend: {
		        data: data.legend,
		        textStyle:{
		        	color:'rgba(255,255,255,.7)',
		        	fontSize:12
		        },
		        itemWidth:12,
		        itemHeight:10,
		        left:'center',
		        bottom:0,
		    },
		    calculable: true,
		    series: [
		        {
		            name:data.name,
		            type:'funnel',
		            left: 'center',
		            width:'80%',
		            top: 35,
		            bottom: 45,
		            min: 0,
		            max: 100,
		            minSize: '0%',
		            maxSize: '100%',
		            sort: data.sortType,
		            gap: 0,
		            label:{
		            	normal:{
		            		show:false,
		            		position:'inside'
		            	},
		            	emphasis:{
		            		show:true,
		            		color:'#fff'
		            	}
		            },
		            itemStyle: {
		                borderWidth:0
		            },
		            data:data.data
		        }
		    ]
		}
   
      this.myChart = echarts.init(this.$refs.funnel)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .funnel {
    width: 100%;
    height: 100%;
    padding: 15px;
  }
</style>