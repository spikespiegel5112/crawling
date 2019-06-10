<template>
  <el-row class="app-container">
    <CommonQuery>
      <template slot="button1">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>
          新增
        </el-button>
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
      <el-table-column align="center" label="奖品名称" prop='rewardName'></el-table-column>
      <el-table-column align="center" label="奖品图片">
        <template slot-scope="scope">
          <img v-if="scope.row.rewardImage!==''&&scope.row.rewardImage!==null"
               :src="scope.row.rewardImage+'-style_100x100'" width="100" height="100"
               onerror="this.src='/src/img/default/empty_700_700.jpg'">
          <div v-else>
            无
          </div>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop='description'></el-table-column>
      <el-table-column label="奖品文案" prop='rewardPrompt'></el-table-column>
      <el-table-column label="奖品类型" prop='rewardType'>
        <template slot-scope="scope">
          {{$store.state.app.rewardTypeDictionary.filter(item=>item.code===scope.row.rewardType)[0].name}}
        </template>
      </el-table-column>
      <el-table-column label="奖品数量" prop='rewardValue'></el-table-column>
      <el-table-column label="奖品Code" prop='rewardStr'></el-table-column>
      <el-table-column label="是否可用" prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     :active-value="1"
                     :inactive-value="0"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     disabled
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300px">
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
                     :current-page.sync="pagination.pageNo"
                     :page-sizes="[10,20,30,50]"
                     :page-size="pagination.size"
                     :total="total"
                     layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData"
                   label-position="right"
                   label-width="140px">
            <el-form-item label="奖品类型" prop="rewardType">
              <el-select v-model="formData.rewardType" placeholder='' @change="chooseRewardType">
                <el-option v-for="item in $store.state.app.rewardTypeDictionary"
                           :key="item.code" :label="item.name"
                           :value="item.code"></el-option>
              </el-select>
              <el-button v-if="formData.rewardType==='third_link'" type="primary" @click="chooseRewardTypeFlag=true">选择第三方产品</el-button>
            </el-form-item>
            <el-form-item label="奖品名称" prop="rewardName">
              <el-input :disabled="formData.rewardType==='third_link'" v-model="formData.rewardName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input :disabled="formData.rewardType==='third_link'" type="textarea"
                        v-model="formData.description"></el-input>
            </el-form-item>
            <el-form-item label="奖品图片" prop="rewardImage">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess2"
                :returnUrlList.sync="formData.rewardImage"
                :disabled="formData.rewardType==='third_link'"
                fileType="image"
              />
              <el-input v-show="false" v-model="formData.rewardImage"></el-input>
            </el-form-item>
            <el-form-item label="奖品文案" prop="rewardPrompt">
              <el-input type="textarea" v-model="formData.rewardPrompt"></el-input>
            </el-form-item>
            <el-form-item label="奖品Code" prop="rewardStr">
              <el-input :disabled="formData.rewardType==='third_link'" v-model="formData.rewardStr"></el-input>
            </el-form-item>

            <el-form-item label="可用性" prop="status">
              <el-switch v-model="formData.status"
                         :active-value="1"
                         :inactive-value="0"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         :disabled="formData.rewardType==='third_link'"
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
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="chooseRewardTypeFlag" width="600px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form ref="chooseRewardTypeModel" :model="chooseRewardTypeModel" label-position="right"
                   label-width="150px">
            <el-form-item label="第三方产品名称" prop="name">
              <el-autocomplete
                v-model="chosenReward"
                :fetch-suggestions="focusSortList"
                placeholder="请输入内容"
                @select="chooseThirdPartyProduct"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseRewardTypeFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="pickThirdPartyProduct" v-waves>{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

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
        queryRewardInfoAllRequest: 'promotion-service/1.0.0/queryRewardInfoAll',
        updateRewardInfoByActivityTypeRequest: 'promotion-service/1.0.0/activity_reward_mapping/updateRewardInfoByActivityType',


        addAndUpdateRewardInfoRequest: 'promotion-service/1.0.0/addAndUpdateRewardInfo',
        queryRewardProductByNameRequest: 'promotion-service/1.0.0/queryRewardProductByName',

        chooseRewardTypeFlag: false,
        chosenReward: '',
        chooseRewardTypeModel: {},
        chosenThirdPartyProductInfo: {},

        value2: '',
        value1: '',
        dailyLimitMode: '',
        limitMode: '',
        tableKey: 0,
        tableList: [],
        total: null,
        listLoading: true,
        availabilityFlag: false,
        queryModel: {
          sort: 'desc',
          brandName: ''
        },
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
          id: '',
          description: '',
          rewardImage: '',
          rewardName: '',
          rewardPrompt: '',
          rewardStr: '',
          rewardType: '',
          rewardValue: '',
          status: '',
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        rules: {
          id: [{required: true, message: '此项为必填项', trigger: 'change'}],
          description: [{required: true, message: '此项为必填项', trigger: 'change'}],
          name: [{required: true, message: '此项为必填项', trigger: 'change'}],
          dailyLimit: [{required: true, message: '此项为必填项', trigger: 'change'}],
          limit: [{required: true, message: '此项为必填项', trigger: 'change'}],
          startDate: [{required: true, message: '此项为必填项', trigger: 'change'}],
          endDate: [{required: true, message: '此项为必填项', trigger: 'change'}],
          status: [{required: true, message: '此项为必填项', trigger: 'change'}],
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
        effectiveDuration: []

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
      aaaa(value) {
        console.log(value)
        value.forEach((item1, index1) => {
          this.tableList.forEach((item2, index2) => {
            if (item1.id === item2.id) {
              this.tableList[index2].orderNum = index1;
            }
          })
        });
        console.log(this.tableList)
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.queryRewardInfoAllRequest).then(response => {
          console.log(response)

          this.tableList = response.data;
          this.total = response.total;
          this.listLoading = false
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
        this.formData = {
          id: '',
          description: '',
          rewardImage: '',
          rewardName: '',
          rewardPrompt: '',
          rewardStr: '',
          rewardType: '',
          rewardValue: '',
          status: '',
        };

      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        if (this.$refs.formData !== undefined) {
          this.$refs.formData.resetFields();
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
        console.log(scope)
        this.formData = Object.assign({}, scope.row);

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.addAndUpdateRewardInfoRequest, {
              id: this.formData.id,
              description: this.formData.description,
              rewardImage: this.formData.rewardImage,
              rewardName: this.formData.rewardName,
              rewardPrompt: this.formData.rewardPrompt,
              rewardStr: this.formData.rewardStr,
              rewardType: this.formData.rewardType,
              rewardValue: this.formData.rewardValue,
              status: this.formData.status,
            }).then((response) => {
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
          this.$http.delete(this.$baseUrl + this.brandDeleteRequest + `/${scope.row.id}`).then((response) => {
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

      uploadSuccess1(response) {
        console.log(response)
        this.formData.icon = response.url;
      },
      uploadSuccess2(response) {
        this.formData.rewardImage = response.url;
      },
      changeDailyLimitMode(data) {
        this.formData.dailyLimit = data.toString() === 'unlimited' ? '-1' : this.formData.dailyLimit;

      },
      changeLimitMode(data) {
        this.formData.limit = data.toString() === 'unlimited' ? '-1' : this.formData.limit;
        alert(this.formData.limit)
      },
      chooseRewardType(data) {
        console.log(data)
      },
      chooseThirdPartyProduct(data) {
        this.chosenThirdPartyProductInfo = data;
      },
      pickThirdPartyProduct() {
        console.log(this.chosenThirdPartyProductInfo)
        if (Object.keys(this.chosenThirdPartyProductInfo).length > 0) {

          console.log(this.initSortData)

          this.formData = Object.assign(this.formData, {
            // id: this.chosenThirdPartyProductInfo.id,
            description: this.chosenThirdPartyProductInfo.desc,
            rewardImage: this.chosenThirdPartyProductInfo.image,
            rewardName: this.chosenThirdPartyProductInfo.name,
            rewardPrompt: this.chosenThirdPartyProductInfo.rewardPrompt,
            rewardStr: this.chosenThirdPartyProductInfo.productId,
            rewardType: this.chosenThirdPartyProductInfo.rewardType,
            rewardValue: this.chosenThirdPartyProductInfo.rewardValue,
            status: this.chosenThirdPartyProductInfo.status
          });
          this.chooseRewardTypeFlag = false;


        } else {
          this.$message.warning('无游戏可添加')
        }

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
