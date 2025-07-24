<template>
  <el-container class="common_main_container" :class="classObj">
    <!-- <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    ></div> -->
    <el-aside class="aside" :width="classObj ? '180' : '50'">
      <Sidebar class="sidebar_container" />
    </el-aside>
    <el-container>
      <div class="main_container">
        <Navbar />
        <el-card class="app-main">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-card>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ResizeMixin from './mixin/ResizeHandler';

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar
  },
  data() {
    return {
      heightReadyFlag: false
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    },
    layoutReady() {
      return this.$store.state.app.layoutHeight > 0;
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
.aside {
  font-size: 0;
}
.common-main-contaner {
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
