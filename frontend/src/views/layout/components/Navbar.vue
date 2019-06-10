<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>

    <div class="right-menu">
      <div class="common_environmenthint_item" v-if="$prodEnv">
        测试环境
      </div>
      <!-- <error-log class="errLog-container right-menu-item"></error-log> -->

      <!-- <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip> -->

      <lang-select class="international right-menu-item"></lang-select>

      <!-- <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

      <el-dropdown class="avatar-container" trigger="click">
        <div class="common-imguploadpreview-wrapper">
          <img class="user-avatar" :src="avatarImage">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout">LogOut</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="common-imguploadpreview-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </el-menu>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import LangSelect from '@/components/LangSelect'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      LangSelect
    },
    data(){
      return {
        avatarImage:this.$store.state.user.image!==undefined?this.$store.state.user.image+'-style_100x100':'../../static/img/default/defaultavatar_60_60.png'
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'image'
      ]),
    },
    mounted() {
      console.log(this.$store.state.user)
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    /*line-height: 50px;*/
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        height: 50px;
        vertical-align: middle;
      }
      .theme-switch {
        vertical-align: 15px;
      }

    }
  }

</style>

