<template>
  <div class="menu_wrapper">
    <div v-for="(item, index) in routerInner" :key="index">
      <div v-if="!item.hidden && item.children">
        <router-link
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
        </router-link>

        <el-submenu v-else :index="item.name || item.path" :key="item.name">
          <template slot="title">
            <span
              v-if="item.meta && item.meta.icon"
              class="icon"
              :class="item.meta.icon"
            ></span>
            <span v-if="item.meta && item.meta.title" slot="title">{{
              item.meta.title
            }}</span>
          </template>

          <template v-for="child in item.children">
            <sidebar-item
              :is-nest="true"
              class="nest-menu"
              v-if="child.children && child.children.length > 0"
              :routes="[child]"
              :key="child.path"
            ></sidebar-item>
            <router-link
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
            </router-link>
          </template>
        </el-submenu>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array,
      default: [],
      required: false
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rawData: [],
      routerInner: []
    };
  },
  computed: {
    ...mapGetters(['sidebar']),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  watch: {
    routes(value) {
      this.rawData = value;
      this.wipeOutHiddenItem(value);
    },
    isCollapse(value) {
      this.wipeOutHiddenItem(this.routes);
    }
  },
  mounted() {
    console.log(this.rawData);
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

<style lang="scss" scoped>
.menu_wrapper {
  \deep\.el-menu-item {
    .icon {
      font-size: 10px;
    }
  }
}
</style>
