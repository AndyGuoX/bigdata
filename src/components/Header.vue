<template>
  <div class="header-wrapper">
    <a href="/cluster" class="logo-wrap">
      <img class="logo" src="../../static/img/logo.png" alt="">
      <img class="logo-title" src="../../static/img/bgvisual.png" alt="">
    </a>
    <ul class="header-menu">
      <router-link to="/cluster" tag="li">
        <i class="el-icon-pie-chart"></i>
        集群检测
      </router-link>
      <router-link to="/data_visual" tag="li">
        <i class="el-icon-data-analysis"></i>
        数据可视化
      </router-link>
    </ul>
    <div class="header-userInfo">
      <el-dropdown trigger="click">
        <div class="el-dropdown-link">
          <el-avatar :size="40" :src="userImg"></el-avatar>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--          <el-dropdown-item>-->
          <!--            <router-link to="/user/info" tag="span">账户设置</router-link>-->
          <!--          </el-dropdown-item>-->
          <el-dropdown-item>
            <span @click="loginOut">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import userImg from '@/../static/img/login/avtar.png'

  export default {
    name: "Header",
    data() {
      return {
        userImg,
      }
    },
    methods: {
      loginOut() {
        this.$store.dispatch('user/logout').then(() => {
          this.$router.push({
            name: 'login'
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-dropdown-menu {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  }

  .header-wrapper {
    width: 100%;
    height: 85px;
    background-color: #567086;
    padding-left: 30px;

    .header-menu {
      height: 100%;
      float: left;
      margin-left: 100px;
      border: none;
      list-style: none;

      i {
        display: block;
        margin: 12px 0 10px;
        font-size: 28px;
      }

      .menu-active {
        background-color: #f5a623;
        color: #fff !important;
      }

      li {
        height: 100%;
        border: none;
        padding: 0 20px;
        color: #fff;
        cursor: pointer;
        float: left;
        font-size: 15px;
        transition: all 0.3s ease;

        &:hover {
          color: #f5a623;
        }
      }

      .is-active {
        /*background-color: #f5a623 !important;*/
      }
    }

    .header-userInfo {
      height: 100%;
      float: right;
      margin-right: 100px;
      border: none;
      list-style: none;
      position: relative;

      .el-dropdown {
        position: relative;
        top: 50%;
        transform: translateY(-50%);

        .el-dropdown-link {
          cursor: pointer;

          span.el-avatar {
            vertical-align: middle;
          }

          i.el-icon-arrow-down {
            vertical-align: middle;
            color: #fff;
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
    }

    .logo-wrap {
      float: left;
      margin-top: 20px;

      img {
        height: 40px;
        max-width: 100%;
      }

      img.logo {
        height: 40px;
        max-width: 100%;

        animation: logo-anim 12s Ease-in-out infinite;
        -webkit-animation: logo-anim 12s Ease-in-out infinite;
      }

      img.logo-title {
        padding-left: 20px;
      }
    }
  }

  @keyframes logo-anim {
    0%, 50% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
