<template>
  <div class="common-querytable-wrapper">
    <div class="queryform-wrapper">
      <div class="outside">
        <el-form class="basearea">
          <ul class="pull-left">
            <li>
              <slot name="button1">
                <!--<el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>-->
                <!--新增-->
                <!--</el-button>-->
              </slot>
            </li>
          </ul>
        </el-form>
        <ul class="operation-wrapper pull-right">
          <li>
            <slot name="query1"></slot>
          </li>
          <li>
            <slot name="query2"></slot>
          </li>
          <li>
            <slot name="query3"></slot>
          </li>
          <li v-if="expand">
            <el-button size="mini" class="expand" type="text" @click='handleExpand'>高级搜索<i
              class="el-icon-arrow-down"></i></el-button>
          </li>
        </ul>
      </div>
      <div class="expandarea" :class="{active:expandFlag}">
        <el-form ref="form" :model="queryModel" size="mini" label-width="100px">
          <el-row>
            <el-col :span="8">
              <slot name="query4">

              </slot>
            </el-col>
            <el-col :span="8">

            </el-col>
            <el-col :span="8">

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">

            </el-col>
            <el-col :span="8">

            </el-col>
            <el-col :span="8">

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" pull-right>
              <el-form-item class="pull-right">
                <el-button type="primary" size="mini" icon="el-icon-search"
                           @click="search">搜索
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-refresh"
                           @click="reset">重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "CommonQuery",
    props: {
      queryModel: {
        type: Object,
        default: function () {
          return {}
        }
      },
      expandQuery: {
        type: Object,
        default: function () {
          return {}
        }
      },
      expand: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        expandFlag: false
      }
    },
    watch: {
      queryModel() {

      },
      expand(value) {
        this.expandFlag = value;
      }
    },
    methods: {
      search() {

      },
      reset() {
        this.$emit('reset')
      },
      handleExpand() {
        this.expandFlag = !this.expandFlag;
        console.log(this.expandFlag)
      }
    }
  }
</script>

<style scoped>

</style>
