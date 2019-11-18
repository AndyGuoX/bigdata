
<template>
  <div class="login-wrapper">
    <div class="login-box">
      <ul class="right-ul">
        <li class="r-li lbl-1"></li>
        <li class="r-li lbl-2"></li>
        <li class="r-li lbl-3"></li>
        <li class="l-li"></li>
      </ul>
      <div class="login-img-wrap">
        <img src="../../static/img/login/avtar.png" alt="">
      </div>
      <form>
        <div class="username">
          <div class="input-icon username-icon"></div>
          <input type="text" name="username" placeholder="用户名" autocomplete="off" v-model="userName">
        </div>
        <div class="password">
          <div class="input-icon password-icon"></div>
          <input type="password" name="password" placeholder="密码" v-model="password" @keyup.enter="loginVerify">
        </div>
      </form>
      <div class="login-btn" @click="loginVerify">Login</div>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5'

  export default {
    name: "Login",
    data() {
      return {
        userName: "",
        password: "",
      }
    },
    methods: {
      // 验证是否可以提交
      loginVerify() {

        if (this.userName !== '' && this.password !== '') {
          let loginJson = {
            "userName": this.userName,
            "password": md5(this.password)
          }
          // 登录api
          this.$store.dispatch('user/login', loginJson).then(res => {
            if (res.loginResult) {
              this.$router.push({
                name: 'cluster',
              })
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '请先输入账户名和密码！',
            type: 'warning'
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .login-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    background: url("../../static/img/login/login_bg.jpg") no-repeat center;
    background-size: cover;

    .login-box {
      width: 700px;
      height: 550px;
      border-radius: 10px;
      position: absolute;
      top: 50%;
      left: 26%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      box-shadow: -8px 20px 20px 8px rgba(0, 0, 0, .6);

      .right-ul {
        width: 100%;
        height: 70px;
        background-color: rgba(35, 35, 46, 1);
        list-style: none;

        .r-li {
          float: right;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin: 26px 15px 0 0;
        }

        .l-li {
          float: left;
          width: 100px;
          height: 100%;
          margin-left: 10px;
          background: url("../../static/img/bgvisual.png") no-repeat center;
          background-size: contain;
        }

        .lbl-1 {
          background-color: #f25056;
        }

        .lbl-2 {
          background-color: #fcbe07;
        }

        .lbl-3 {
          background-color: #13d13d;
        }
      }

      .login-img-wrap {
        background-color: rgba(43, 43, 54, 1);

        img {
          margin-top: 57px;
        }
      }

      form {
        overflow: hidden;
        background-color: rgba(43, 43, 54, 1);

        > div {
          width: 80%;
          height: 60px;
          position: relative;
          margin: 65px auto 0;
        }

        .password {
          margin: 10px auto 65px;
        }

        .username, .password {
          input {
            width: 100%;
            height: 100%;
            border: none;
            padding: 18px 50px;
            border-bottom: 1px solid #484856;
            color: #9199aa;
            background-color: transparent;
            outline: none;
            font-size: 18px;
          }

          input[name="password"] {
            color: #dd3e3e;

            &::-webkit-input-placeholder {
              color: #dd3e3e;
            }
          }

          .input-icon {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            background-size: cover;
          }

          .username-icon {
            background: url("../../static/img/login/adm.png");
          }

          .password-icon {
            background: url("../../static/img/login/key.png") no-repeat center;
          }
        }
      }

      .login-btn {
        width: 100%;
        height: 80px;
        background-color: rgba(62, 167, 81, 1);
        color: #fff;
        font-size: 30px;
        padding: 18px 0;
        cursor: pointer;

        &:hover {
          background: rgba(255, 39, 117, 1);
          transition: 1s all;
        }
      }
    }
  }
</style>
