<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    {{isCollapse}}
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routeData"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'

  export default {
    components: { SidebarItem },
    data() {
      return {
        routeData: []
      }
    },
    mounted() {
      let result = []
      this.$router.options.routes.forEach((item, index) => {
        this.$set(result, index, item)
      })
      this.routeData = result
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      routes() {
        return this.$router.options.routes
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    watch: {
      isCollapse() {
        let result = []
        this.$router.options.routes.forEach((item, index) => {
          this.$set(result, index, item)
        })
        this.routeData = result

      }
    }
  }
</script>
