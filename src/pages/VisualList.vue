<template>
  <div class="visual-list">
    <div class="visual-box">
      <img class="visual-img" src="../../static/img/big_data_img/big_data_demo.jpg" alt="">
      <ul class="visual-toolbar">
        <li>查看<i class="el-icon-view"></i></li>
        <li>修改<i class="el-icon-edit-outline"></i></li>
        <li>删除<i class="el-icon-delete"></i></li>
      </ul>
    </div>
    <div class="add-visual" @click="createNewPage">
      <span>创建新页面</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "VisualList",
    methods: {
      createNewPage() {
        const routerUrl = this.$router.resolve({
          name: 'dataVisual'
        })
        window.open(routerUrl.href, '_blank') // 打开新的页面
      }
    }
  }
</script>

<style scoped lang="scss">
  .visual-list {
    padding: 30px 50px;

    &:after {
      content: '';
      display: block;
      clear: both;
    }

    .add-visual {
      float: left;
      width: 256px;
      height: 162px;
      margin: 20px 20px;
      border-radius: 5px;
      box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.3);
      background: url("../../static/img/svg/add.svg") no-repeat center 30px;
      background-size: 55px 55px;
      transition: .3s;
      cursor: pointer;
      position: relative;

      span {
        position: relative;
        top: 100px;
        font-size: 16px;
        color: #acacac;
      }

      &:hover {
        background-image: url("../../static/img/svg/add2.svg");
        transform: translateY(-10px);

        span {
          color: #f5a623;
        }
      }
    }

    .visual-box {
      float: left;
      width: 256px;
      height: 162px;
      margin: 20px 20px;
      border-radius: 5px;
      box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.3);
      transition: .3s;
      cursor: pointer;
      position: relative;

      &:hover {
        transform: translateY(-10px);

        .visual-toolbar {
          opacity: 1;
        }
      }

      .visual-toolbar {
        width: 100%;
        list-style: none;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 5px;
        opacity: 0;
        transition: .3s;

        li {
          float: left;
          width: 33%;

          &:hover {
            color: #f5a623;
          }

          i {
            padding-left: 5px;
          }
        }
      }

      .visual-img {
        padding: 5px;
        width: 100%;
        height: 100%;
      }
    }
  }

</style>
