<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <div class="menu_wrapper">
        <div v-for="(item, index) in routeData" :key="index">
          <div v-if="!item.hidden && item.children">
            <RouterLink
              v-if="
                hasOneShowingChildren(item.children) &&
                  !item.children[0].children &&
                  !item.alwaysShow
              "
              :to="item.path + '/' + item.children[0].path"
              :key="item.children[0].name"
            >
              <el-menu-item
                :index="item.path + '/' + item.children[0].path"
                :class="{ 'submenu-title-noDropdown': !isNest }"
              >
                <span
                  v-if="item.children[0].meta && item.children[0].meta.icon"
                  class="icon"
                  :class="item.children[0].meta.icon"
                ></span>
                <span
                  v-if="item.children[0].meta && item.children[0].meta.title"
                  slot="title"
                  >{{ item.children[0].meta.title }}</span
                >
              </el-menu-item>
            </RouterLink>

            <el-submenu v-else :index="item.name || item.path" :key="item.name">
              <template slot="title">
                <span
                  v-if="item.meta && item.meta.icon"
                  class="icon"
                  :class="item.meta.icon"
                ></span>
                <span v-if="item.meta && item.meta.title" slot="title">
                  {{ item.meta.title }}
                </span>
              </template>

              <template v-for="child in item.children">
                <sidebar-item
                  :is-nest="true"
                  class="nest-menu"
                  v-if="child.children && child.children.length > 0"
                  :routes="[child]"
                  :key="child.path"
                ></sidebar-item>
                <RouterLink
                  v-else
                  :to="item.path + '/' + child.path"
                  :key="child.name"
                >
                  <el-menu-item :index="item.path + '/' + child.path">
                    <span
                      v-if="child.meta && child.meta.icon"
                      class="icon"
                      :class="child.meta.icon"
                    ></span>
                    <span v-if="child.meta && child.meta.title" slot="title"
                      >{{ child.meta.title }}
                    </span>
                  </el-menu-item>
                </RouterLink>
              </template>
            </el-submenu>
          </div>
        </div>
      </div>
      <!-- <SidebarItem :routes="routeData" /> -->
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex';
// import SidebarItem from './SidebarItem';

export default {
  components: {
    // SidebarItem
  },
  data() {
    return {
      rawData: [],
      routeData: []
    };
  },
  mounted() {
    let result = [];
    this.$router.options.routes.forEach((item, index) => {
      this.$set(result, index, item);
    });
    this.routeData = result;
  },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  watch: {
    isCollapse() {
      let result = [];
      this.$router.options.routes.forEach((item, index) => {
        this.$set(result, index, item);
      });
      this.routeData = result;
    }
  },
  mounted() {
    let result = [];
    this.$router.options.routes.forEach((item, index) => {
      this.$set(result, index, item);
    });
    this.routeData = result;
    this.wipeOutHiddenItem(result);
  },
  methods: {
    wipeOutHiddenItem(data) {
      let result = [];
      data.forEach((item1, index1) => {
        if (!item1.hidden) {
          result.push(item1);
          if (result[result.length - 1].children) {
            result[result.length - 1].children = result[
              result.length - 1
            ].children.filter(
              item2 => item2.hidden === undefined || !item2.hidden
            );
          }
        }
      });
      this.routerInner = result;
    },
    hasOneShowingChildren(children) {
      let showingChildren = [];
      children.forEach(item => {
        if (!item.hidden || item.hidden !== true) {
          showingChildren.push(item);
        }
      });
      return showingChildren.length === 1;
    }
  }
};
</script>
