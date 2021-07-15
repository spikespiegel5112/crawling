<template>
  <el-container class="common_main_container" :class="classObj">
    <!-- <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    ></div> -->
    <el-aside class="aside" :width="classObj ? 180 : 50">
      <Sidebar class="sidebar-container" />
    </el-aside>
    <el-container>
      <div class="main-container">
        <Navbar />
        <AppMain v-if="heightReadyFlag" />
      </div>
    </el-container>
  </el-container>
</template>
<script>
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppMain from './components/AppMain';
import ResizeMixin from './mixin/ResizeHandler';

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data() {
    return {
      heightReadyFlag: false
    };
  },
  mixins: [ResizeMixin],
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
  mounted() {
    this.autoHeight();
    this.changeHeight();
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false });
    },
    autoHeight() {
      let layoutHeight;
      setTimeout(() => {
        // this.$autoHeight({
        //   target: '.app-main',
        //   offset: -50
        // });
        layoutHeight = this.$autoHeight({
          target: '.app-main',
          reference: '.main-container',
          offset: -110,
          returnValue: true
        });
      }, 500);
      setTimeout(() => {
        this.$store.dispatch('updateLayoutHeight', layoutHeight);
        this.heightReadyFlag = true;
      }, 1000);
    },
    changeHeight() {
      let that = this;
      window.onresize = () => {
        that.autoHeight();
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'src/style/mixin.scss';
.aside {
  font-size: 0;
}
.common-main-contaner {
  @include clearfix;
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
