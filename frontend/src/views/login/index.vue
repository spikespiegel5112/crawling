<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autoComplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="right"
    >
      <h3 class="title">
        趣谷
        <div class="common_environmenthint_item" v-if="$prodEnv">
          测试环境
        </div>
      </h3>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          autoComplete="on"
          placeholder="username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autoComplete="on"
          placeholder="password"
        ></el-input>
        <span class="show-pwd" @click="showPwd"
          ><svg-icon icon-class="eye"
        /></span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click.native.prevent="handleLogin"
          style="width:100%"
        >
          Sign in
        </el-button>
      </el-form-item>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    return {
      userInfoRequest: 'uaa/user',
      loginRequest: 'uaa/oauth/token',
      loginForm: {
        username: '',
        password: '',
        grant_type: 'password'
      },
      loginRules: {
        username: [{ required: true, trigger: 'change' }],
        password: [
          { required: true, trigger: 'change', validator: validatePass }
        ]
      },
      loading: false,
      pwdType: 'password'
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$router.push({ path: '/' });
          // this.loading = true;
          // this.$http.post(this.$baseUrl + this.loginRequest, this.loginForm, {
          //   headers: {
          //     'Content-Type': 'application/x-www-form-urlencoded',
          //     'Authorization': 'Basic YW5kcm9pZDphZG1pbg=='
          //   },
          //   transformRequest: [function (data) {
          //     let ret = '';
          //     for (let it in data) {
          //       ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          //     }
          //     return ret
          //   }],
          // }).then(response => {
          //   console.log(response)
          //
          //   Cookies.set('Admin-Token', response.access_token);
          //   Cookies.set('Admin-Login-Id', this.loginForm.username);
          //
          //   this.$store.commit('SET_TOKEN', response.access_token);
          //   this.$store.commit('SET_LOGIN_ID', this.loginForm.username);
          //
          //
          //   this.$http.get(this.$baseUrl + this.userInfoRequest, {
          //     headers: {
          //       'Content-Type': 'application/x-www-form-urlencoded',
          //     },
          //     params: {
          //       access_token: response.access_token
          //     }
          //   }).then(response => {
          //     console.log(response)
          //
          //     this.loading = false;
          //     if (response.authorities.filter(item => item.authority === 'admin').length > 0) {
          //       this.$router.push({path: '/'})
          //     } else {
          //       this.$message.error('此账号无管理员权限')
          //     }
          //   }).catch(error => {
          console.log(error)
          //     console.log(response.access_token)
          //     this.$message.error('dsds')
          //   })
          //
          // }).catch(error => {
          console.log(error)
          //   console.log(error)
          //   this.loading = false
          //   this.$message({
          //     message: '账号密码错误',
          //     type: 'error'
          //   })
          // })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style  lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style  lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
