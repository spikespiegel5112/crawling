<template>
  <div class="app-container">
    <CommonLoading :loading="loading" :relative="false"/>

    <el-row type="flex" justify='center'>
      <el-col :span="24">
        <div class="edifice_main_container common_sortlist_wrapper">
          <el-form :inline="true">
            <div v-if="!editBuildingNameFlag" class="buildingname">
              <el-form-item label="大楼名称：">
                趣谷大厦
                <!--{{floorFormData.buildingName}}-->
                <el-button type="text" icon="el-icon-edit-outline" @click="editBuildingNameFlag=true"></el-button>
              </el-form-item>
            </div>
            <div v-else class="buildingname">
              <el-form-item label="大楼名称：">
                <el-input v-model="floorFormData.buildingName" @blur="editBuildingNameFlag=false">
                  <el-button slot="append" icon="el-icon-check" @click="saveBuildingName"></el-button>
                </el-input>
              </el-form-item>
            </div>
          </el-form>

          <ul class="add">
            <li>
              <a class="plus" @click="handleAddFloor">
                <span class="add el-icon-circle-plus-outline"></span>
              </a>
            </li>
          </ul>
          <ul class="sortlist" :style="{height:layoutHeight+'px'}">
            <li v-for="(item, index) in floorList" :key="item.id">
              <el-row>
                <el-col :span="1">
                  <div class="floornumber">
                    <span>
                      {{item.floorsRank}}
                    <p>楼</p>
                    </span>
                  </div>
                </el-col>
                <el-col :span="23">
                  <el-row>
                    <el-col :span="22" :style="{minHeight:'10px'}">
                      <el-form ref="form" label-width="150px" class="maincontent">
                        <div v-if="item.brand!==null" class="floordesc">
                          <div class="swiper-container">
                            <ul class="swiper-wrapper">
                              <li class="swiper-slide brandmeta">
                                <el-form-item label="品牌名称：">
                                  <span>{{item.brand.brandName}}</span>
                                </el-form-item>
                              </li>
                              <li class="swiper-slide brandmeta">
                                <el-form-item label="key总数量：">
                                  <span>{{item.brand.keyTotal}}</span>
                                </el-form-item>
                              </li>
                              <li class="swiper-slide brandmeta">
                                <el-form-item label="key已领取数：">
                                  <span>{{item.brand.keyReceived}}</span>
                                </el-form-item>
                              </li>
                              <li class="swiper-slide brandmeta">
                                <el-form-item label="key可用数：">
                                  <span>{{item.brand.keyEnable}}</span>
                                </el-form-item>
                              </li>
                              <li class="swiper-slide brandmeta">
                                <el-form-item label="每用户可领取key数：">
                                  <span>{{item.brand.keyNumPerUser}}</span>
                                </el-form-item>
                              </li>
                              <li class="swiper-slide brandmeta">
                                <el-form-item label="key是否可用：">
                                  <el-tag v-if="item.brand.keyEnable===1" type="success">可用</el-tag>
                                  <el-tag v-if="item.brand.keyEnable===0" type="error">不可用</el-tag>
                                </el-form-item>
                              </li>
                              <li class="swiper-slide brandmeta">
                                <el-form-item label="广告类型：">
                                  <span>{{item.brand!==null?$store.state.app.brandTypeDictionary.filter(item2=>item2.code===item.brand.type)[0].name:''}}</span>
                                </el-form-item>
                              </li>
                              <li class="swiper-slide brandmeta">
                                <el-form-item label="广告类型：">
                                  <span>{{item.brand!==null?$store.state.app.keyTypeDictionary.filter(item2=>item2.code===item.brand.keyType)[0].name:''}}</span>
                                </el-form-item>
                              </li>
                            </ul>
                            <div class="swiper-scrollbar'"></div>
                          </div>
                        </div>
                        <div class="advertisedesc swiper-container" v-if="item.brand!==null">
                          <div class="swiper-wrapper">
                            <div class="brandicon swiper-slide">
                              <el-form-item label="品牌icon：">
                                <img :src="item.brand.icon+'-style_100x100'"/>
                              </el-form-item>
                            </div>
                            <div class="advertiselist swiper-slide" :style="{width:360*item.brand.advertisements.length+120+'px'}">
                              <label>广告：</label>

                              <div class="content ">

                                <ul class="">
                                  <li v-for="(item2) in item.brand.advertisements" class="brandmeta">
                                    <img
                                      :src="item2.url!==''?item2.url+'-style_100x100':'/static/img/default/empty_700_700.jpg'"/>
                                    <el-form ref="form" label-width="130px" class="advertisemeta">
                                      <el-form-item label="Android可用性：">
                                        <el-tag v-if="item2.androidEnable===true" type="success">可用</el-tag>
                                        <el-tag v-if="item2.androidEnable===false" type="error">不可用</el-tag>
                                      </el-form-item>
                                      <el-form-item label="iOS可用性：">
                                        <el-tag v-if="item2.iosEnable===true" type="success">可用</el-tag>
                                        <el-tag v-if="item2.iosEnable===false" type="error">不可用</el-tag>
                                      </el-form-item>
                                      <el-form-item label="链接：">
                                        <el-button class="location" type="text"
                                                   @click="openAdvertiseUrl(item2.location)">
                                          {{item2.url}}
                                        </el-button>
                                      </el-form-item>
                                    </el-form>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                        </div>
                        <!--<el-col class="operation" :span="3">-->
                        <!--</el-col>-->
                      </el-form>
                    </el-col>
                    <el-col :span="2">
                      <el-form>
                        <el-row>
                          <el-form-item>
                            <a v-if="item.floorsRank===pagination.total" @click="removeFloor(item)" class="minus">
                              <span class="add el-icon-remove-outline"></span>
                            </a>
                          </el-form-item>
                        </el-row>
                        <el-row>
                          <ul class="">
                            <li>
                              <el-button type="primary" size="mini" @click="handleAddBrand(item)" :disable="item!=={}">
                                添加品牌
                              </el-button>
                            </li>
                            <li>
                              <el-button type="primary" size="mini" @click="removeBrand(item)" :disable="item==={}">
                                移除品牌
                              </el-button>
                            </li>
                            <li>
                              <el-button type="primary" size="mini" @click="handleUpdateFloor(item)"
                                         :disable="item!=={}">
                                编辑楼层
                              </el-button>
                            </li>
                          </ul>
                        </el-row>
                      </el-form>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <div class="common-pagination-wrapper">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.page" :page-sizes="[10,20,30,50]" :page-size="pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
      </el-pagination>
    </div>


    <!-- 弹框 -->
    <el-dialog :title="editFloorTextMap[dialogStatus]" :visible.sync="editFloorDialogFlag" width="600px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="queryModel" :model="queryModel" label-position="right" label-width="150px">
            <el-form-item label="是否上架" prop="status">
              <el-switch v-model="floorFormData.status" :active-value="1" :inactive-value="0" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFloorDialogFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateFloor" v-waves>{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addBrandDialogFlag" width="600px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="currentFloorData" :model="currentFloorData" label-position="right"
                   label-width="150px">
            <el-form-item label="品牌名称" prop="chosenBrandName">
              <el-autocomplete
                v-model="currentFloorData.chosenBrandName"
                :fetch-suggestions="focusSortList"
                placeholder="请输入内容"
                @select="chooseBrand"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBrandDialogFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="addBrand" v-waves>{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import CommonTag from "@/views/common/CommonTag.vue";
  import CommonQuery from "@/views/common/CommonQuery.vue";
  import Draggable from "vuedraggable";
  import Swiper from "swiper";

  export default {
    components: {
      CommonTag,
      CommonQuery,
      Draggable
    },
    data() {
      return {
        floorsListRequest: 'building-show-service/1.0.0/bk/floors/list',

        addOrUpdateFloorsRequest: 'building-show-service/1.0.0/bk/floors/addOrUpdate',

        deleteFloorsRequest: 'building-show-service/1.0.0/bk/floors/delete',

        brandListRequest: 'building-show-service/1.0.0/bk/brand/list',
        addBrandToFloorRequest: 'building-show-service/1.0.0/bk/floors/addBrand',
        removeBrandToFloorRequest: 'building-show-service/1.0.0/bk/floors/removeBrand',


        floorList: [],
        queryModel: {
          brandName: '',
          sort: 'desc',
        },
        pagination: {
          page: 1,
          size: 20,
        },
        floorFormData: {
          buildingName: '',
          "status": 1,
          "id": '',
          floorsRank: '',
          createTime: ''
        },
        dialogStatus: "",
        textMap: {
          update: "Edit",
          create: "Create"
        },
        editFloorTextMap: {
          update: "编辑楼层",
          create: "创建楼层"
        },
        dialogPvVisible: false,
        rules: {
          chosenBrandName: [{
            required: true,
            message: "此项为不能为空",
            trigger: "change"
          }]
        },
        loading: false,
        deviceType: 'ios',
        editFloorDialogFlag: false,
        addBrandDialogFlag: false,
        currentSortData: [],
        chosenBrandData: {},
        currentBrandId: '',
        currentFloorData: {
          chosenBrandName: '',
        },
        editBuildingNameFlag: false,
        swiper1: {},
        swiper2: {}
      };
    },
    computed: {
      layoutHeight() {
        return this.$store.state.app.layoutHeight - 125;
      }
    },
    watch: {
      chosenBrandName(value) {
        this.queryModel.name = value;
      },
      initSortData(value) {
        console.log(value);
      }
    },
    mounted() {
      this.getSortList();
    },
    methods: {
      getSortList() {
        let queryModel = this.queryModel;

        this.$http.get(this.$baseUrl + this.floorsListRequest, {
          params: Object.assign(queryModel, this.pagination)
        }).then(response => {
          console.log(response);
          this.loading = false;
          this.floorList = response.list;
          this.floorFormData.buildingName = response.list.filter(item => item.buildingName !== '' && item.buildingName !== null).length > 0 ? response.list.filter(item => item.buildingName !== '' && item.buildingName !== null)[0].buildingName : '';
          this.pagination.total = response.total;

          this.$nextTick(() => {
            this.initSwiper()
          });
        });
      },
      initSwiper() {
        this.swiper = new Swiper('.swiper-container', {
          slidesPerView: 'auto',
          freeMode: true,
          scrollbar: {
            el: '.swiper-scrollbar',
          },
          mousewheel: true,
        });
        setTimeout(() => {
          this.swiper2 = new Swiper('.advertiselist .content', {
            slidesPerView: 'auto',
            freeMode: true,
            scrollbar: {
              el: '.swiper-scrollbar',
            },
            mousewheel: true,
          });
        }, 2000);


      },
      handleAddFloor() {
        this.dialogStatus = "create";
        this.editFloorDialogFlag = true;
        this.floorFormData = Object.assign(this.floorFormData, {
          id: '',
          status: 1
        })
      },
      handleUpdateFloor(data) {
        console.log(data)
        this.dialogStatus = "update";
        this.editFloorDialogFlag = true;
        this.floorFormData = Object.assign(this.floorFormData, {
          id: data.id,
          buildingName: '',
          floorsRank: data.floorsRank,
          createTime: data.createTime
        })
      },
      updateFloor() {
        this.$http.post(this.$baseUrl + this.addOrUpdateFloorsRequest, this.floorFormData).then(response => {
          console.log(response)
          this.getSortList();
          this.editFloorDialogFlag = false;
          this.$message.success('楼层信息修改成功')
        }).catch(error => {
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      handleAddBrand(data) {
        this.dialogStatus = "update";
        this.addBrandDialogFlag = true;
        this.currentFloorData.chosenBrandName = '';
        this.currentFloorData = data;
      },
      addBrand() {
        this.$refs['currentFloorData'].validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.addBrandToFloorRequest + `/${this.currentFloorData.id}/${this.chosenBrandData.id}`, {}).then(response => {
              console.log(response)

              switch (response.code) {
                case 10000:
                  this.$message.success('品牌添加成功');
                  this.getSortList();
                  this.addBrandDialogFlag = false;
                  break;
                case 30002:
                  this.$message.warning(response.message);
                  break;
                case 30004:
                  this.$message.error(response.message);
                  break;
                default:
                  this.$message.success(response.message);
                  this.getSortList();
                  this.addBrandDialogFlag = false;
              }
            }).catch(error => {
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        });
      },
      removeBrand(data) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.currentFloorData = data;

          this.$http.post(this.$baseUrl + this.removeBrandToFloorRequest + `/${this.currentFloorData.id}`, {}).then(response => {
            console.log(response)

            switch (response.code) {
              case 10000:
                this.$message.success('品牌移除成功');
                this.getSortList();
                break;
              case 30001:
                this.$message.error(response.message);
                break;
              default:
                this.$message.success(response.message);
                this.getSortList();
            }
            this.getSortList();

          })
        }).catch(error => {

        })
      },
      removeFloor(data) {

        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(this.$baseUrl + this.deleteFloorsRequest + `/${data.id}`).then(response => {
            console.log(response)

            switch (response.code) {
              case 10000:
                this.$message.success('楼层移除成功')
                this.getSortList();
                break;
              case 30001:
                this.$message.error(response.message);
                break;
              default:
                this.$message.success(response.message);
                this.getSortList();
            }

          }).catch(error => {
            this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
          })
        }).catch(() => {

        })
      },


      focusSortList(queryString, callback) {
        console.log(this.gameOptions);


        this.$http.get(this.$baseUrl + this.brandListRequest, {
          params: {
            page: this.pagination.page,
            size: this.pagination.size,
            sort: this.queryModel.sort,
            brandName: this.currentFloorData.chosenBrandName
          }
        }).then(response => {
          console.log(response);
          let result = [];
          if (response.list.length !== 0) {
            response.list.forEach((item, index) => {
              result.push(Object.assign(item, {
                value: item.brandName
              }));
            });

            console.log(result)
            callback(result)
          }

        }).catch(error => {
          this.$message.error(
            `${error.response.status.toString()}  ${error.response.data.error}`
          );
        });
      },

      chooseBrand(data) {
        console.log(333, data);
        this.chosenBrandData = data;
      },
      openAdvertiseUrl(data) {
        window.open('//' + data)
      },
      handleSizeChange(val) {
        this.pagination.size = val;
        this.getSortList();
      },
      handleCurrentChange(val) {
        this.pagination.page = val;
        this.getSortList();
      },
      uploadSuccess(response) {
        console.log(response)
        this.floorFormData.url = response.url;
      },
      resetTemp() {
        this.floorFormData = {
          id: '',
          buildingName: '',
          status: 1
        };
      },
      saveBuildingName() {
        this.editBuildingNameFlag = true;

        this.floorFormData = Object.assign(this.floorFormData, {
          id: this.floorList[0].id,
          floorsRank: this.floorList[0].floorsRank
        });
        this.$http.post(this.$baseUrl + this.addOrUpdateFloorsRequest, this.floorFormData).then(response => {
          console.log(response)
          this.getSortList();
          this.$message.success('大楼名称修改成功')
          this.editBuildingNameFlag = false;
        }).catch(error => {
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      }
    }
  };
</script>

<style lang='scss'>
  @import "../../styles/edifice.scss";
  @import '../../assets/swiper/css/swiper.min.css';

</style>
