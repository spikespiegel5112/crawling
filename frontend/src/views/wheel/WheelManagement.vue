<
<template>
  <el-row class="app-container">
    <CommonQuery>
      <template slot="button1">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>
          新增
        </el-button>
        <el-select v-model="formData.activityId">
          <el-option v-for="item in activityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </template>
      <template slot="query1">
        <div class="common-search-wrapper" @keyup.enter="search">
          <input v-model="queryModel.brandName" type="text" placeholder="请输入游戏名称"/>
          <a>
            <span @click="search" class="el-icon-search"></span>
          </a>
        </div>
      </template>
    </CommonQuery>

    <el-table :data="tableList" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row
              :height="tableHeight">
      <el-table-column label="No" type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column label="活动ID" align="center" prop="activityId"></el-table-column>
      <el-table-column label="奖品数量" align="center" prop="number">
        <template slot-scope="scope">
          {{scope.row.number.toString()!=='-1'?scope.row.number:'无限次'}}
        </template>
      </el-table-column>
      <el-table-column label="中奖率" align="center" prop="probability"></el-table-column>
      <el-table-column label="奖品ID" align="center" prop="rewardId"></el-table-column>
      <el-table-column label="奖品名称" align="center" prop="rewardName"></el-table-column>
      <el-table-column label="是否可用" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common-pagination-wrapper">
      <el-pagination background @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="pagination.page"
                     :page-sizes="[10,20,30,50]"
                     :page-size="pagination.size"
                     :total="total"
                     layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <!-- 编辑品牌 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData"
                   label-position="right"
                   label-width="140px">

            <el-form-item label="活动ID" prop="activityId">
              <el-select v-model="formData.activityId" :disabled="true">
                <el-option v-for="item in activityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="奖品数量" prop="number">
              <!--<el-input v-model="formData.number"></el-input>-->

              <el-radio-group v-model="dailyLimitMode" size="mini" @change="changeDailyLimitMode">
                <el-radio-button label="unlimited">无限次</el-radio-button>
                <el-radio-button label="limited">有限次</el-radio-button>
              </el-radio-group>
              <el-input-number v-show="dailyLimitMode==='limited'" v-model="formData.number"></el-input-number>
            </el-form-item>
            <el-form-item label="中奖率" prop="probability">
              <el-input v-model.number="formData.probability"></el-input>
            </el-form-item>
            <el-form-item label="奖品名称" prop="rewardName">
              <el-autocomplete
                v-model="chosenReward"
                :fetch-suggestions="focusSortList"
                placeholder="请输入内容"
                @select="chooseThirdPartyProduct"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="是否可用" prop="status">
              <el-switch v-model="formData.status"
                         :active-value="1"
                         :inactive-value="0"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData" v-waves>{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>`

<script>
  import CommonTag from '@/views/common/CommonTag.vue'
  import CommonQuery from '@/views/common/CommonQuery.vue'

  export default {
    components: {
      CommonTag,
      CommonQuery,
    },
    data() {
      return {
        queryRewardInfoByActivityTypeRequest: 'promotion-service/1.0.0/queryRewardInfoByActivityType',
        addAndUpdateRotaryTableActivityRequest: 'promotion-service/1.0.0/addAndUpdateRotaryTableActivity',

        updateRewardInfoByActivityTypeRequest: 'promotion-service/1.0.0/activity_reward_mapping/updateRewardInfoByActivityType',
        queryRewardProductByNameRequest: 'promotion-service/1.0.0/queryRewardProductByName',
        deleteActivityRewardMappingByIdRequest: 'promotion-service/1.0.0/activity_reward_mapping/deleteActivityRewardMappingById',
        queryRotaryTableActivityListRequest: 'promotion-service/1.0.0/queryRotaryTableActivityList',


        value2: '',
        value1: '',
        tableKey: 0,
        tableList: [],
        total: null,
        listLoading: true,
        availabilityFlag: false,
        dynamicTags: ['标签一', '标签二', '标签三'],
        rewardTypeDictionary: [{
          name: '积分',
          code: 'point'
        }, {
          name: '趣豆',
          code: 'coin'
        }, {
          name: '百视通会员',
          code: 'bes_tv'
        }, {
          name: '第三方链接',
          code: 'third_link'
        }],
        queryModel: {
          sort: 'desc',
          brandName: ''
        },
        natureDictionary: [{
          code: 1,
          name: 'app'
        }, {
          code: 2,
          name: '网页'
        }],
        statusDictionary: [{
          code: 0,
          name: '未上线'
        }, {
          code: 1,
          name: '上线'
        }],
        pagination: {
          page: 1,
          size: 20,
        },
        importanceOptions: [1, 2, 3],

        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        formData: {
          "id": '',
          "status": '',
          "activityId": '',
          "rewardId": '',
          "number": '',
          "probability": ''
        },
        dailyLimitMode: '',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        rules: {
          id: [{required: true, message: '此项为必填项', trigger: 'change'}],
          status: [{required: true, message: '此项为必填项', trigger: 'change'}],
          "activityId": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "rewardId": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "number": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "probability": [{required: true, message: '此项为必填项', trigger: 'change'}]
        },
        downloadLoading: false,
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.value2 !== '') {
              return time.getTime() > this.value2
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() < this.value1
          }
        },
        fileList: [],
        portraitParams: {
          bucketName: 'funyvalley',
          folderName: 'icon'
        },
        iosVersionListData: [],
        androidVersionListData: [],
        searchTxt: '',
        expandQuery: '',
        showFileListFlag: false,
        newFile: '',
        advertisementDialogFlag: false,
        currentAdvertisementTabIndex: 0,
        currentSortData: [],
        effectiveDuration: [],
        chosenThirdPartyProductInfo: {},
        chosenReward: '',
        activityList: [],
        currentActivityId: ''

      }
    },
    computed: {
      tableHeight() {
        return this.$store.state.app.tableHeight;
      }
    },
    watch: {
      effectiveDuration(value) {
        console.log(value);
        if (value === null) {
          value = [];
        }
        this.formData.startDate = this.$moment(value[0]).format('YYYY-MM-DD');
        this.formData.endDate = this.$moment(value[1]).format('YYYY-MM-DD');
      },
      currentAdvertisementTabIndex(value) {
        console.log(value)
      },
      currentSortData(value) {
        console.log(value)
        value.forEach((item1, index1) => {
          this.tableList.forEach((item2, index2) => {
            if (item1.id === item2.id) {
              this.tableList[index2].orderNum = index1;
            }
          })
        });
        console.log(this.tableList)
      },
      'formData.activityId': function (value) {
        this.getTableData();
      }
    },
    mounted() {
      this.getActivityList();
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.queryRewardInfoByActivityTypeRequest + `/${this.formData.activityId}`).then(response => {
          console.log(response)

          this.tableList = response.data;
          this.total = response.total;
          this.listLoading = false


        })
      },
      getActivityList() {
        this.listLoading = true;
        this.$http.get(this.$baseUrl + this.queryRotaryTableActivityListRequest).then(response => {
          console.log(response)

          this.activityList = response.data;
          this.formData.activityId = response.data[0].id;
          this.total = response.total;
          this.listLoading = false
          this.getTableData();

        })
      },
      handleFilter() {
        this.pagination.page = 1;
        this.getTableData()
      },
      handleSizeChange(val) {
        this.pagination.size = val;
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.pagination.page = val;
        this.getTableData()
      },
      resetTemp() {
        this.formData = Object.assign(this.formData, {
          "id": '',
          "status": '',
          // "activityId": '',
          "rewardId": '',
          rewardName: '',
          "number": '',
          "probability": ''
        });
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        if (this.$refs.formData !== undefined) {
          // this.$refs.formData.resetFields();
          this.$nextTick(() => {
            this.$refs['formData'].clearValidate()
          })
        }
      },
      createData() {
        this.formData.id = '';
        this.updateData();
      },
      handleUpdate(scope) {
        console.log('handleUpdate', scope)
        this.formData = Object.assign({}, scope.row);
        this.chosenReward = scope.row.rewardName;

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        let params;
        if (this.dialogStatus === 'create') {
          params = {
            "status": this.formData.status,
            "activityId": this.formData.activityId,
            "rewardId": this.formData.rewardId,
            "number": this.formData.number,
            "probability": this.formData.probability
          };
        } else {
          params = this.formData;
        }

        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.updateRewardInfoByActivityTypeRequest, params).then((response) => {
              console.log(response)
              this.dialogFormVisible = false;
              this.$message.success('信息修改成功');
              this.getTableData();
            }).catch(error => {
              console.log(error)
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        });
      },
      handleDelete(scope) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(this.$baseUrl + this.deleteActivityRewardMappingByIdRequest + `/${scope.row.id}`).then((response) => {
            console.log(response)
            this.dialogFormVisible = false;
            this.$message.success('删除成功');
            this.getTableData();
          }).catch(error => {
            console.log(error)
            this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      expand() {
        this.expandQuery = !this.expandQuery;
      },
      search() {
        this.getTableData();
      },
      reset() {
        this.queryModel.available = true;
      },
      deleteAdvertise(data, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        });
      },

      uploadSuccess1(response) {
        console.log(response)
        this.formData.icon = response.url;
      },
      uploadSuccess2(response) {
        this.formData.image = response.url;
      },
      changeDailyLimitMode(data) {
        this.formData.number = data.toString() === 'unlimited' ? '-1' : this.formData.number;
      },
      chooseThirdPartyProduct(data) {
        this.chosenThirdPartyProductInfo = data;
        this.formData.rewardId = data.id;
      },
      focusSortList(queryString, callback) {
        this.loading = true;

        // this.queryModel = Object.assign(this.queryModel, {
        //   limit: 999,
        //   page: 1,
        //   status: 1,
        //   title: '',
        //   description: '',
        //   gameTypeId: '',
        // });
        // console.log(this.queryModel)


        this.$http.get(this.$baseUrl + this.queryRewardProductByNameRequest, {
          params: {
            name: this.chosenReward
          }
        }).then(response => {
          console.log(response)
          this.loading = false;
          // this.total = response.total;
          let result = [];
          if (response.data.length !== 0) {
            response.data.forEach((item, index) => {
              result.push(Object.assign(item, {
                value: item.name
              }));
            });
            // this.aaaa.forEach(item1 => {
            //   result = result.filter(item2 => item1.name !== item2.name)
            // });

            console.log(111, result)

            callback(result)

          }


        })
      },
    }
  }
</script>
<style lang="scss">
  @import '../../styles/edifice.scss';

</style>
