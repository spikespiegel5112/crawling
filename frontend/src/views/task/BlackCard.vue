<template>
  <div class="app-container">
    <CommonQuery @reset="reset">
      <template slot="button1">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>
          新增
        </el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="exportCsvFlag=true" v-waves>
          导出任务完成流水
        </el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="importCsv" v-waves>
          导入任务完成流水

        </el-button>
      </template>
      <template slot="query1">
        <div class="common-search-wrapper" @keyup.enter="search">
          <input v-model="queryModel.keyword" type="text" placeholder="请输入任务名称"/>
          <a>
            <span @click="search" class="el-icon-search"></span>
          </a>
        </div>
      </template>
      <template slot="query4">
        <el-form-item label="类型：">
          <el-select v-if="categoryDictionary.length!==0" clearable v-model="queryModel.category"
                     placeholder="请选择">
            <el-option v-for="item in categoryDictionary" :key="item.code" :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </CommonQuery>


    <el-table :data="tableList" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row :height="tableHeight">
      <el-table-column align="center" label='No' width="50">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="Icon" align="center" width="150">
        <template slot-scope="scope">
          <img v-if="scope.row.iconPath!==''&&scope.row.iconPath!==null" :src="scope.row.iconPath+'-style_100x100'"
               width="100px" height="100px">
          <p v-else>无</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="200">
        <template slot-scope="scope">
          {{scope.row.description}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isIosEnable" label="iOS可用性">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isIosEnable" active-color="#13ce66"
                     inactive-color="#ff4949" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isAndroidEnable" label="安卓可用性">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isAndroidEnable" active-color="#13ce66"
                     inactive-color="#ff4949" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="第三方提交地址" width="180">
        <template slot-scope="scope">
          {{scope.row.submitPath}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始/结束时间" width="120">
        <template slot-scope="scope">
          {{scope.row.startDate}}
          <br> {{scope.row.endDate}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="category" label="任务类型">
        <template slot-scope="scope">
          {{scope.row.category!==''&&scope.row.category!==null?categoryDictionary.filter(item=>item.code===scope.row.category)[0].name:''}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)" v-waves>编辑</el-button>
          <!--<el-button size="mini" type="danger" @click="handleDelete(scope)" v-waves>删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common-pagination-wrapper">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.page" :page-sizes="[10,20,30,50]" :page-size="pagination.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width='width: 400px;'>
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData" label-position="right" label-width="150px">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>

            <el-form-item label="任务图片" prop="iconPath">
              <!--{{formData.iconPath}}-->
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess"
                :return-url-list.sync="formData.iconPath"
                fileType="image"
              />
              <el-input v-show="false" v-model="formData.iconPath"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.description"></el-input>
            </el-form-item>
            <el-form-item label="第三方提交地址" prop="submitPath">
              <el-input v-model="formData.submitPath"></el-input>
            </el-form-item>
            <el-form-item label="iOS可用性" prop="isIosEnable">
              <el-switch v-model="formData.isIosEnable" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="Android可用性" prop="isAndroidEnable">
              <el-switch v-model="formData.isAndroidEnable" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-form-item label="有效时间" prop="startDate">
              <el-date-picker
                v-model="effectiveDuration"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="任务类型" prop="category">
              <el-select v-model="formData.category">
                <el-option v-for="item in categoryDictionary"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData" v-waves>{{$t('table.confirm')}}
        </el-button>
        <el-button v-else type="primary" @click="updateData" v-waves>{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 -->
    <el-dialog title="导出任务完成流水" :visible.sync="exportCsvFlag" width='width: 400px;'>
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-date-picker
            v-model="taskEffectiveDuration"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportCsvFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="exportCsv" v-waves>导出</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 -->
    <el-dialog title="导入任务完成流水" :visible.sync="importExcelFlag" width='width: 400px;'>
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <CommonUploadImage
            :action="$baseUrl+importUserTaskRequest"
            @on-success="uploadSuccess2"
            fileType="excel"
            :returnUrlList.sync="temporaryCsv"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importExcelFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData" v-waves>{{$t('table.confirm')}}
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

  import CommonQuery from '@/views/common/CommonQuery.vue'


  export default {
    components: {
      CommonQuery
    },
    data() {
      return {
        getBlackTaskPageRequest: 'task-service/2.0.0/task/bk/getBlackTaskPage/',
        saveBlackCardTaskRequest: 'task-service/2.0.0/task/bk/saveBlackCardTask',

        exportUserTaskRequest: 'task-service/2.0.0/task/bk/exportUserTask',
        importUserTaskRequest: 'task-service/2.0.0/task/bk/importUserTask',


        value2: "",
        value1: "",
        tableKey: 0,
        tableList: null,
        total: null,
        listLoading: true,
        queryModel: {
          keyword: '',
          category: ''
        },
        pagination: {
          page: 1,
          limit: 10
        },
        effectiveDuration: [],
        importanceOptions: [1, 2, 3],
        sortOptions: [{
          label: "ID Ascending",
          key: "+id"
        }, {
          label: "ID Descending",
          key: "-id"
        }],
        statusOptions: ["published", "draft", "deleted"],
        showReviewer: false,
        formData: {
          id: '',
          name: '',
          iconPath: '',
          startDate: '',
          endDate: '',
          "submitPath": '',
          "description": '',
          "isIosEnable": '',
          "isAndroidEnable": '',
          "category": '',
        },
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          update: "Edit",
          create: "Create"
        },
        dialogPvVisible: false,
        categoryDictionary: [{
          name: '年卡任务',
          code: 4
        }, {
          name: '月卡任务',
          code: 5
        }],
        pvData: [],
        rules: {
          name: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          note: [{
            required: false,
            message: "此项为必填项",
            trigger: "change"
          }],
          iconPath: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          bounty: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }, {
            type: 'number',
            message: '必须为数字值',
            trigger: "change"
          }, {
            type: 'number',
            max: 999999,
            message: '赏金不得大于999999',
            trigger: "change"
          }],
          surplusNum: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }, {
            type: 'number',
            message: '必须为数字值'
          }],
          startDate: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          endDate: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          submitPath: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          apkPath: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          packageName: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          tryplayTimeLength: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }, {
            type: 'number',
            message: '必须为数字值'
          }],
          effectiveDuration: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
        },
        downloadLoading: false,
        pickerOptions0: {
          disabledDate: time => {
            if (this.value2 !== "") {
              return time.getTime() > this.value2;
            }
          }
        },
        pickerOptions1: {
          disabledDate: time => {
            return time.getTime() < this.value1;
          }
        },
        expandQuery: false,
        portraitParams: {
          bucketName: "funyvalley",
          folderName: "task"
        },
        fileList: [],
        importExcelFlag: false,
        temporaryCsv: '',
        exportCsvFlag: false,
        taskEffectiveDuration: []
      };
    },
    computed: {
      tableHeight() {
        return this.$store.state.app.tableHeight
      }
    },
    watch: {
      effectiveDuration(value) {
        console.log(value)
        if (value === null) {
          value = [];
        }
        this.formData.startDate = this.$moment(value[0]).format('YYYY-MM-DD');
        this.formData.endDate = this.$moment(value[1]).format('YYYY-MM-DD');
      },
      taskEffectiveDuration(value) {
        console.log(value)
        if (value === null) {
          value = [];
        }
        this.formData.startDate = this.$moment(value[0]).format('YYYY-MM-DD');
        this.formData.endDate = this.$moment(value[1]).format('YYYY-MM-DD');
      },
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: "success",
          draft: "gray",
          deleted: "danger"
        };
        return statusMap[status];
      }
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.$http.get(this.$baseUrl + this.getBlackTaskPageRequest, {
          params: Object.assign(this.queryModel, this.pagination)
        }).then(response => {
          console.log(response);

          this.tableList = response.content;
          this.total = response.totalElements;
          this.listLoading = false;
        }).catch(error => {
          console.log(error)
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["formData"].clearValidate();
        });
      },

      handleUpdate(scope) {
        this.formData = Object.assign(this.formData, scope.row);
        this.effectiveDuration = [scope.row.startDate, scope.row.endDate]
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["formData"].clearValidate();
        });
      },
      createData() {


        this.updateData();
      },
      updateData() {
        let params;
        if (this.dialogStatus === 'create') {
          params = this.formData;
          delete params.id;
        } else {
          params = this.formData;
        }
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.saveBlackCardTaskRequest, {
              id: this.formData.id,
              name: this.formData.name,
              iconPath: this.formData.iconPath,
              startDate: this.$moment(this.formData.startDate).format('YYYY-MM-DD'),
              endDate: this.$moment(this.formData.endDate).format('YYYY-MM-DD'),
              "submitPath": this.formData.submitPath,
              "description": this.formData.description,
              "isIosEnable": this.formData.isIosEnable,
              "isAndroidEnable": this.formData.isAndroidEnable,
              "category": this.formData.category,
            }).then(response => {
              console.log(response)
              this.dialogFormVisible = false;
              this.getTableData();
              this.$message.success('信息修改成功')
            }).catch(error => {
              console.log(error)
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        })
      },
      handleSizeChange(val) {
        this.pagination.limit = val;
        this.getTableData();
      },
      handleCurrentChange(val) {
        this.pagination.page = val;
        this.getTableData();
      },
      updateShelfStatus(scope) {
        console.log(scope);
        //0下架 1上架
        this.$store.dispatch('updateShelfStatus', {
          id: scope.row.id,
          isShow: scope.row.isShow
        });
      },
      resetTemp() {
        this.formData = {
          id: '',
          name: '',
          iconPath: '',
          startDate: '',
          endDate: '',
          "submitPath": '',
          "description": '',
          "isIosEnable": '',
          "isAndroidEnable": '',
          "category": '',
        };
        this.effectiveDuration = [];
        this.fileList = []
      },


      handleDelete(scope) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.$baseUrl + this.delTaskRequest + scope.row.id).then((response) => {
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
      search() {
        this.getTableData();
      },
      reset() {
        this.queryModel.keyword = '';
        this.queryModel.category = '';
        this.pagination.page = 1;
        this.getTableData();
      },
      uploadSuccess(response, file, fileList) {
        this.loading = false;
        console.log(response);
        console.log(6, fileList);
        this.formData.iconPath = response.url;
        // this.fileList.push(response);
        console.log(fileList);

        this.loading = false;
        this.$message({
          message: "图片上传成功",
          type: "success"
        });
      },
      uploadSuccess2(response, file, fileList) {
        console.log('uploadSuccess2', response)
        if (response.operation) {
          this.$message({
            message: "CSV上传成功",
            type: "success"
          });
        } else {
          this.$message({
            message: response.message,
            type: "error"
          });
          this.temporaryCsv = '';
        }

      },
      exportCsv() {
        let params = {
          startDate: this.taskEffectiveDuration[0],
          endDate: this.taskEffectiveDuration[1],
          access_token:this.$store.getters.token
        };

        this.$http.get(this.$baseUrl + this.exportUserTaskRequest, {
          params: params
        }).then(response => {
          console.log(response)
          window.open(this.$baseUrl + this.exportUserTaskRequest + `?startDate=${params.startDate}&endDate=${params.endDate}&access_token=${params.access_token}`)
        }).catch(error => {
          console.log(error)

        })
        //
        // window.open(this.$baseUrl + this.exportUserTaskRequest+`?startDate=${params.startDate}&endDate=${params.endDate}`)
      },
      importCsv() {
        this.temporaryCsv = '';
        this.importExcelFlag = true;
        // this.$http.post(this.$baseUrl+this.importUserTaskRequest,{
        //   headers:{
        //     'Content-Type':'multipart/form-data'
        //   }
        // })
      },

    }
  }

</script>
