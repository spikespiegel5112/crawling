<template>
  <div class="app-container">
    <CommonLoading :loading="loading" :relative="false"/>
    <el-tabs tab-position="left" @tab-click="chooseDeviceType">

      <el-tab-pane v-for="item in $store.state.app.deviceTypeDictionary" :key="item.code" :label="item.name"
                   :style="{height:layoutHeight-5+'px'}">
        <el-tabs tab-position="left" @tab-click="chooseGameType">
          <el-tab-pane v-for="(item, index) in gameTypeInfo.list" :key="item.id"
                       :label="item.name+`(槽位容量${item.topNumber})`">
            <el-row type="flex" justify='center'>
              <el-col :span="24" style="text-align: center">
                <div class="common_sortlist_wrapper game_sortlist_container">
                  <ul class="sortlist">
                    <Draggable v-model="currentSortData" :options="{}" @start="drag=true" @end="drag=false">
                      <li v-for="(item, index) in currentSortData" :key="item.id">
                        <label class="gamename">{{item.name}}</label>
                        <a @click="minusGame(index)" class="minus">
                          <span class="add el-icon-remove-outline"></span>
                        </a>
                      </li>
                    </Draggable>
                  </ul>
                  <ul class="add" v-if="currentSortData.length<currentTopNumber">
                    <li>
                      <a class="plus" @click="handleAddGame">
                        <span class="add el-icon-circle-plus-outline"></span>
                      </a>
                    </li>
                  </ul>
                </div>
              </el-col>
            </el-row>
            <el-row class="footer" type="flex" justify="center">
              <el-col :span="6" style="text-align: center">
                <el-button type="primary" @click="saveSort" :disabled="!compareIsSortDataChanged()">保存排序</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>


    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="queryModel" :model="queryModel" label-position="right" label-width="150px">
            <el-form-item label="游戏名称" prop="name">
              <el-autocomplete
                v-model="chosenGameName"
                :fetch-suggestions="focusSortList"
                placeholder="请输入内容"
                @select="chooseGame"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="addGame" v-waves>{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>`

<script>
  import CommonTag from '@/views/common/CommonTag.vue'
  import CommonQuery from '@/views/common/CommonQuery.vue'
  import Draggable from 'vuedraggable'
  // import Sortable from 'sortablejs'

  export default {
    components: {
      CommonTag,
      CommonQuery,
      Draggable,
      // Sortable
    },
    data() {
      return {
        game_typeAddOrUpdateRequest: 'game-service/1.0.0/game_type/addOrUpdate',
        game_typeDeleteRequest: 'game-service/1.0.0/game_type/delete',

        game_infoListRequest: 'game-service/1.0.0/game_info/list',
        rankGameByTypeRequest: 'game-service/1.0.0/game_type_mapping/rankGameByType',

        game_typeListRequest: 'game-service/1.0.0/game_type/list',

        findHomePageGameInfoRequest: 'game-service/1.0.0/game_info/findHomePageGameInfo',

        operationGameTypeMappingRequest: 'game-service/1.0.0/game_type_mapping/operationGameTypeMapping',
        rankListRequest: 'game-service/1.0.0/game_info/rank/list',

        queryModel: {
          deviceType: this.currentDeviceType,
          gameTypeId: this.currentGameTypeId,
          // topNumber: 0,
          // ios: false,
          // android: true
        },
        pagination: {
          page: 1,
          limit: 20,
        },
        formData: {
          id: 0,
          name: '',
          "title": "",
          "description": '',
          "iconUrl": "",
          "bigImageUrl": "",
          "iosDownloadUrl": "",
          androidDownloadUrl: '',
          webGameUrl: '',
          nature: "",
          ios: false,
          android: false,
          status: null
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        rules: {
          name: [{
            required: true,
            message: "此项为不能为空",
            trigger: "change"
          }],
        },
        loading: false,
        fileList: [],
        gameTypeInfo: [],
        gameTypeId: '',
        initSortData: [],
        currentSortData: [],
        currentTopNumber: 0,
        currentGameTypeId: 1,
        currentDeviceType: 'android',
        autoCompleteList: [],
        gameOptions: [],
        chosenGameName: '',
        chosenGameInfo: {},
      }
    },
    computed: {
      layoutHeight() {
        return this.$store.state.app.layoutHeight - 40;
      }
    },
    watch: {
      'formData.bigImageUrl': function (value) {
        console.warn(value)
      },
      chosenGameName(value) {
        this.queryModel.name = value
      },
      initSortData(value) {
        console.log(value)
      }
    },
    mounted() {
      this.getGameTypeInfo();
    },
    methods: {
      getGameTypeInfo() {
        // alert(this.currentGameTypeId)
        this.loading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.game_typeListRequest, {
          params: this.queryModel
        }).then(response => {
          console.warn(response)


          this.gameTypeInfo = response;
          this.currentTopNumber = this.gameTypeInfo.list[0].topNumber;
          this.currentGameTypeId = this.gameTypeInfo.list[0].id;


          this.queryModel = Object.assign(this.queryModel, {
            // page: 1,
            // limit: this.gameTypeInfo.list[0].topNumber,
            // name: '',
            // status: 1,
            // title: '',
            // description: '',
            deviceType: this.currentDeviceType,
            gameTypeId: this.currentGameTypeId
          });
          this.getSortList();
          this.loading = false
        })
      },
      getSortList() {
        let deviceTypeList = ['android', 'ios'];
        let result = '';
        this.loading = true;
        deviceTypeList.forEach(item1 => {
          Object.keys(this.queryModel).forEach(item2 => {
            if (item1 === item2) {
              if (this.queryModel[item2] === true) {
                result = item1;
              }
            }
          })
        });
        console.log(this.queryModel)
        console.log(result)
        this.$http.get(this.$baseUrl + this.rankListRequest, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            gameTypeId: this.currentGameTypeId,
            deviceType: this.queryModel.deviceType
          }
        }).then(response => {
          console.log(response)
          this.initSortData = [];
          this.currentSortData = [];
          response.list.forEach((item, index) => {
            this.$set(this.initSortData, index, item)
          });

          response.list.forEach((item, index) => {
            this.$set(this.currentSortData, index, item)
          });
          this.loading = false;

        })
      },


      chooseGameType(data) {
        console.log(data)
        this.currentGameTypeId = this.gameTypeInfo.list[data.index].id;
        this.currentTopNumber = this.gameTypeInfo.list[data.index].topNumber;

        this.queryModel = Object.assign(this.queryModel, {
          page: 1,
          limit: this.currentTopNumber,
          name: '',
          status: 1,
          title: '',
          description: '',
          gameTypeId: this.currentGameTypeId
        });
        this.getSortList();
      },
      chooseDeviceType(data) {
        console.log(data)
        this.currentDeviceType = this.$store.state.app.deviceTypeDictionary[data.index].code;
        this.queryModel = Object.assign(this.queryModel, {
          gameTypeId: this.currentGameTypeId,
          deviceType: this.currentDeviceType
        });
        console.log(this.queryModel)
        this.getSortList();
      },
      handleAddGame() {
        this.dialogFormVisible = true;
        this.queryModel.name = '';
        this.chosenGameName = '';
      },
      addGame() {
        if (Object.keys(this.chosenGameInfo).length > 0) {
          let result = [];
          result = this.currentSortData;
          result.push(this.chosenGameInfo)
          this.currentSortData = result;
          console.log(this.currentSortData)
          console.log(this.initSortData)
          this.dialogFormVisible = false;
          // this.compareIsSortDataChanged();


          // this.$http.post(this.$baseUrl + this.operationGameTypeMappingRequest, [{
          //   gameId: this.chosenGameInfo.id.toString(),
          //   gameTypeId: this.currentGameTypeId.toString(),
          //   operation: true
          // }], {
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          // }).then(response => {
          //   console.log(response)
          //   this.queryModel.name = '';
          //   this.queryModel.gameTypeId = this.currentGameTypeId;
          //   this.getSortList();
          //   this.dialogFormVisible = false;
          // }).catch(error => {
          //   console.log(error)
          // })
        } else {
          this.$message.warning('无游戏可添加')
        }


      },
      minusGame(index) {
        let result = this.currentSortData;
        result.splice(index, 1);
        this.currentSortData = result;
        console.log(this.currentSortData)
        // this.$confirm('确认删除?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.$http.post(this.$baseUrl + this.operationGameTypeMappingRequest, [{
        //     gameId: this.currentSortData[index].id.toString(),
        //     gameTypeId: this.currentGameTypeId.toString(),
        //     operation: false
        //   }], {
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   }).then(response => {
        //     console.log(response)
        //     this.queryModel.gameTypeId = this.currentGameTypeId;
        //     this.getSortList();
        //   })
        // })
      },

      saveSort() {
        let requestBody = {};
        if (this.currentSortData.length === 0) {
          this.$message.warning('排序列表不能为空')
          return;
        }
        if (this.currentDeviceType === 'ios') {
          requestBody = {
            iosGameIdList: this.currentSortData.map(item => item.id)
          };
        } else if (this.currentDeviceType === 'android') {
          requestBody = {
            androidGameIdList: this.currentSortData.map(item => item.id)
          }
        }
        this.$http.post(this.$baseUrl + this.rankGameByTypeRequest + `/${this.currentGameTypeId}`, requestBody).then(response => {
          console.log(response);
          this.getSortList();
        }).catch(error => {
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      focusSortList(queryString, callback) {
        console.log(this.gameOptions)
        this.loading = true;

        this.queryModel = Object.assign(this.queryModel, {
          limit: 999,
          page: 1,
          status: 1,
          title: '',
          description: '',
          gameTypeId: '',
        });
        console.log(this.queryModel)


        this.$http.get(this.$baseUrl + this.game_infoListRequest, {
          params: this.queryModel
        }).then(response => {
          console.log(response)
          this.loading = false;
          this.total = response.total;
          let result = [];
          if (response.list.length !== 0) {
            response.list.forEach((item, index) => {
              result.push(Object.assign(item, {
                value: item.name
              }));
            });
            this.currentSortData.forEach(item1 => {
              result = result.filter(item2 => item1.name !== item2.name)
            });

            console.log(111, result)

            callback(result)

            console.log(222, this.gameOptions)
          }
        })
      },

      chooseGame(data) {
        console.log(333, data)
        this.chosenGameInfo = data;
        this.queryModel.name = data.value;

      },
      compareIsSortDataChanged() {
        let result = false;
        if (this.initSortData.length !== this.currentSortData.length) {
          result = true;
        } else {
          this.initSortData.forEach((item, index) => {
            if (this.currentSortData[index].id !== item.id) {
              result = true;
            }
          })
        }
        return result;
      }
    }
  }
</script>
<style lang='scss'>
  @import "../../styles/game.scss";
</style>
