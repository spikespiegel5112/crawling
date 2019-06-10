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
      <el-table-column align="center" label="现价" prop='name'></el-table-column>
      <el-table-column align="center" label="每个账号的每日次数">
        <template slot-scope="scope">
          {{scope.row.dailyLimit.toString()!=='-1'?scope.row.dailyLimit:'无限次'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="每个账号的每月次数">
        <template slot-scope="scope">
          {{scope.row.monthLimit.toString()!=='-1'?scope.row.monthLimit:'无限次'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="每个账号的总领奖次数" prop='limit'>
        <template slot-scope="scope">
          {{scope.row.limit.toString()!=='-1'?scope.row.limit:'无限次'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" prop="description"></el-table-column>
      <el-table-column align="center" label="开始时间" prop='startDate'></el-table-column>
      <el-table-column align="center" label="结束时间" prop='endDate'></el-table-column>
      <el-table-column align="center" label="是否可用" prop="status">
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
                     :current-page.sync="pagination.page"
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
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" v-model="formData.description"></el-input>
            </el-form-item>
            <el-form-item label="每个账号的每日领奖次数" prop="dailyLimit">
              <el-radio-group v-model="dailyLimitMode" size="mini" @change="changeDailyLimitMode">
                <el-radio-button label="unlimited">无限次</el-radio-button>
                <el-radio-button label="limited">有限次</el-radio-button>
              </el-radio-group>
              <el-input-number v-show="dailyLimitMode==='limited'" v-model="formData.dailyLimit"></el-input-number>
            </el-form-item>
            <el-form-item label="每个账号的每月领奖次数" prop="monthLimit">
              <el-radio-group v-model="monthLimitMode" size="mini" @change="changeMonthLimitMode">
                <el-radio-button label="unlimited">无限次</el-radio-button>
                <el-radio-button label="limited">有限次</el-radio-button>
              </el-radio-group>
              <el-input-number v-show="monthLimitMode==='limited'" v-model="formData.monthLimit"></el-input-number>
            </el-form-item>
            <el-form-item label="每个账号的总领奖次数" prop="limit">
              <el-radio-group v-model="limitMode" size="mini" @change="changeLimitMode">
                <el-radio-button label="unlimited">无限次</el-radio-button>
                <el-radio-button label="limited">有限次</el-radio-button>
              </el-radio-group>
              <el-input-number v-show="limitMode==='limited'" v-model="formData.limit"></el-input-number>
            </el-form-item>
            <el-form-item label="有效时间" prop="url">
              <el-date-picker v-model="effectiveDuration"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="可用性" prop="status">
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
  import Draggable from 'vuedraggable'

  export default {
    components: {
      CommonTag,
      CommonQuery,
      Draggable,
    },
    data() {
      return {
        queryRotaryTableActivityListRequest: 'promotion-service/1.0.0/queryRotaryTableActivityList',
        addAndUpdateRotaryTableActivityRequest: 'promotion-service/1.0.0/addAndUpdateRotaryTableActivity',

        value2: '',
        value1: '',
        dailyLimitMode: '',
        monthLimitMode:'',
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
          "id": '',
          "name": '',
          "description": '',
          "status": 0,
          "dailyLimit": 0,
          monthLimit:0,
          "limit": 0,
          "startDate": "",
          "endDate": ''
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
        currentSortData: [],
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
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.queryRotaryTableActivityListRequest).then(response => {
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
          "id": '',
          "name": '',
          "description": '',
          "status": 0,
          "dailyLimit": 0,
          monthLimit:0,
          "limit": 0,
          "startDate": "",
          "endDate": ''
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
        this.dailyLimitMode = scope.row.dailyLimit.toString() === '-1' ? 'unlimited' : 'limited';
        this.limitMode = scope.row.limit.toString() === '-1' ? 'unlimited' : 'limited';
        this.effectiveDuration = [];
        this.effectiveDuration = [this.$moment(scope.row.startDate).format('YYYY-MM-DD'), this.$moment(scope.row.endDate).format('YYYY-MM-DD')];

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.addAndUpdateRotaryTableActivityRequest, {
              "id": this.formData.id,
              "name": this.formData.name,
              "description": this.formData.description,
              "status": this.formData.status,
              "dailyLimit": this.formData.dailyLimit,
              "monthLimit": this.formData.monthLimit,
              "limit": this.formData.limit,
              "startDate": this.formData.startDate,
              "endDate": this.formData.endDate,
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
        this.formData.image = response.url;
      },
      changeDailyLimitMode(data) {
        this.formData.dailyLimit = data.toString() === 'unlimited' ? '-1' : this.formData.dailyLimit;
      },
      changeMonthLimitMode(data){
        this.formData.monthLimit = data.toString() === 'unlimited' ? '-1' : this.formData.monthLimit;
      },
      changeLimitMode(data) {
        this.formData.limit = data.toString() === 'unlimited' ? '-1' : this.formData.limit;
      }
    }
  }
</script>
<style lang="scss">
  @import '../../styles/edifice.scss';

</style>
