 <template>
  <div class="liquidFill" ref="liquidFill" :style="`height:${height};width:${width}`"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts-liquidfill/src/liquidFill.js'

  export default {
    name: "LiquidFill",
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
      let data = this.data;
      let option = {
      	title:{
      		text:data.name,
      		textStyle:{
      			color:'rgba(255,255,255,.7)'
      		}
      	},
  		series: [{
	        type: 'liquidFill',
	        radius:'80%',
	        backgroundStyle:{
	        	color:'rgba(255,255,255,.1)'
	        },
	        label:{
	        	textStyle:{
	        		fontSize:20
	        	}
	        },
	        outline:{
	        	show:false,
	        },
	        data: data.data
	    }]
      }

      this.myChart = echarts.init(this.$refs.liquidFill)
      this.myChart.setOption(option)
    }
  }
</script>

<style scoped lang="scss">
  .liquidFill {
    width: 100%;
    height: 100%;
    padding: 15px;
  }
</style>