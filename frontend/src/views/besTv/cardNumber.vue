<template>

  <div class="app-container">
    <div class="common-querytable-wrapper">
      <div class="queryform-wrapper">
        <div class="outside">
          <el-form class="basearea">
            <ul class="pull-left">
              <li>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>
                  批量生成VIP Code
                </el-button>
              </li>
            </ul>
          </el-form>
          <ul class="operation-wrapper pull-right">
            <li>
              <div class="common-search-wrapper" @keyup.enter="search">
                <input v-model="queryModel.keyword" type="text" placeholder="请输入名称"/>
                <a>
                  <span @click="search" class="el-icon-search"></span>
                </a>
              </div>
            </li>
            <li>
              <el-button size="mini" class="expand" type="text" @click='expand'>高级搜索<i class="el-icon-arrow-down"></i>
              </el-button>
            </li>
          </ul>
        </div>
        <div class="expandarea" :class="{active:expandQuery}">
          <el-form ref="form" :model="queryModel" size="mini" label-width="100px">
            <el-row>
              <el-col :span="8">

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
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="search" v-waves>搜索</el-button>
                  <el-button type="primary" size="mini" icon="el-icon-refresh" @click="reset" v-waves>重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>

    <el-table :data="tableList" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row :height="tableHeight">
      <el-table-column align="center" label='No' width="50">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="代理商ID" align="center" prop="agentId"></el-table-column>
      <el-table-column label="产品类型" align="center" prop="productId">
        <template slot-scope="scope">
          {{productListData.filter(item=>item.productId===scope.row.productId).length>0?productListData.filter(item=>item.productId===scope.row.productId)[0].productDesc:''}}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="num" width="150"></el-table-column>
      <el-table-column label="创建人Id" align="center" prop="adminId" width="200"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createDate" width="200"></el-table-column>
      <el-table-column label="确认已发给代理商" align="center" prop="note" width="350">
        <template slot-scope="scope">
          <el-button :disabled="$store.state.user.login_id!==scope.row.adminId||scope.row.isSend===1" size="mini" :type="scope.row.isSend===1?'info':'primary'"
                     @click="sendToAgent(scope)">{{scope.row.isSend===1?'已发送':'发送'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="350">
        <template slot-scope="scope">
          <el-button :disabled="$store.state.user.login_id!==scope.row.adminId" class="icon" type="primary" size="mini"
                     @click="downloadExcel(scope)" v-waves>Excel 下载
          </el-button>
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
            <!--<el-form-item label="设备类型" prop="deviceType">-->
            <!--<el-select v-model="formData.deviceType" @change="getProductListData">-->
            <!--<el-option v-for="item in $store.state.app.deviceTypeDictionary" :label="item.name"-->
            <!--:value="item.code" :key="item.code"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="产品类型" prop="productId">
              <el-select v-model="formData.productId">
                <el-option v-for="item in productListData" :label="item.productDesc" :value="item.productId"
                           :key="item.productId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="代理商ID" prop="agentId">
              <el-select v-model="formData.agentId">
                <el-option v-for="item in agentListData" :label="item.adminId
" :value="item.agentId" :key="item.agentId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="num">
              <el-input-number v-model="formData.num" :min="0" label="数量"></el-input-number>
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
  </div>

</template>

<script>

  import {
    getTryPlayList,
    saveTryPlay,
    updateShelfStatusRequest
  }
    from "@/api/task";

  export default {
    data() {
      return {
        getagentpageRequest: 'besttv-service/1.0.0/agent/bk/getagentpage/',
        getapinfopageRequest: 'besttv-service/1.0.0/bk/getapinfopage',
        batchaddcodeRequest: 'besttv-service/1.0.0/bk/batchaddcode',
        downloadexcelRequest: 'besttv-service/1.0.0/bk/downloadexcel',
        productsRequest: 'besttv-service/1.0.0/products',
        changIsSendRequest: 'besttv-service/1.0.0/bk/changIsSend',
        value2: "",
        value1: "",
        tableKey: 0,
        tableList: null,
        total: null,
        listLoading: true,
        queryModel: {
          keyword: '',
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
          deviceType: '',
          productId: '',
          note: "",
          adminId: "",
          num: '',
          agentId: '',
          downloadUrl: "",
          createDate: "",
          isShow: '',
        },
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          update: "Edit",
          create: "Create"
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          deviceType: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          productId: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          agentId: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          num: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }, {
            type: 'number',
            message: '必须为数字值',
            trigger: "change"
          }, {
            type: 'number',
            max: 10000,
            message: '最大数量不超过10000个',
            trigger: "change"
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
        productListData: [],
        agentListData: [],
        deviceType: '',
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
      }
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
      this.getProductListData();
      this.getTableData();
      this.getAgentData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.$http.get(this.$baseUrl + this.getapinfopageRequest, {
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
      getAgentData() {
        let result = [];
        this.$http.get(this.$baseUrl + this.getagentpageRequest, {
          params: Object.assign(this.queryModel, this.pagination)
        }).then(response => {
          console.log(response);
          this.agentListData = response.content;
        });
      },
      getProductListData() {
        this.$http.get(this.$baseUrl + this.productsRequest, {
          params: {
            deviceType: this.deviceType
          }
        }).then(response => {
          console.log(response)
          this.productListData = response;
        }).catch(error => {
          console.log(error)
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
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
          agentId: "",
          phone: "",
          note: '',
        };
        this.effectiveDuration = [];
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["formData"].clearValidate();
        });
      },
      createData() {
        this.$refs["formData"].validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.batchaddcodeRequest, {
              agentId: this.formData.agentId,
              productId: this.formData.productId,
              num: this.formData.num,
            }).then(() => {
              this.getTableData();
              this.dialogFormVisible = false;
              this.$message.success('创建成功');
            });
          }
        });
      },
      handleUpdate(scope) {
        let startDate = this.$moment(this.startDate).format('YYYY-MM-DD');
        this.formData = scope.row;
        this.effectiveDuration = [scope.row.startDate, scope.row.endDate]
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["formData"].clearValidate();
        });
      },
      updateData() {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.saveAgentInfoRequest, {
              id: this.formData.id,
              productId: this.formData.productId,
              note: this.formData.note,
              adminId: this.formData.adminId,
              num: this.formData.num,
              agentId: this.formData.agentId,
              downloadUrl: this.formData.downloadUrl,
              createDate: this.formData.createDate,
              isShow: this.formData.isShow,
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
      handleDelete(scope) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.$baseUrl + this.delAgentInfoRequest + scope.row.id).then((response) => {
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
      changeUpload(file) {
        console.log(file);
      },
      expand() {
        this.expandQuery = !this.expandQuery;
      },
      search() {
        this.getTableData();
      },
      reset() {
        this.queryModel = Object.assign(this.queryModel, {
          keyword: ''
        });
        this.getTableData();
      },
      handleBeforeUpload(file) {
        console.log(file);
        this.loading = true;
      },
      handlePreview(file) {
        console.log(file);
      },
      handleRemove(file, fileList) {
        console.log(file);
        console.log(fileList);

        let index = null;
        fileList.forEach((item, index2) => {
          if (file.uid === item) {
            index = index2;
          }
        });
        this.formData.iconPath = '';

        this.fileList = this.fileList.filter(item => item.uid !== file.uid);
        console.log(this.formData.iconPath);
      },
      uploadSuccess(response, file, fileList) {
        this.loading = false;
        console.log(file);
        console.log(response);
        console.log(6, fileList);

        this.fileList.push(response);
        console.log(this.formData);
        this.formData.iconPath = response.url;
        console.log(fileList);
        // this.formData.iconPath.forEach((item, index) => {
        //   if (item.url === this.formData.image) {
        //     this.formData.iconPath.splice(index, 1)
        //   }
        // });

        this.loading = false;
        this.$message({
          message: "图片上传成功",
          type: "success"
        });
      },
      uploadAvatarExceeded(files, fileList) {
      },
      downloadExcel(scope) {
        window.open(this.$baseUrl + this.downloadexcelRequest + `?filepath=${scope.row.downloadUrl}&access_token=${this.$store.state.user.token}`);
      },
      sendToAgent(scope) {
        console.log(scope)
        this.$confirm('请核实是否确实已给发送给代理商？此操作不可逆。', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post(this.$baseUrl + this.changIsSendRequest+`/${scope.row.id}`, {}).then(response => {
            console.log(response)
            this.$message.success('已确认发送');
            this.getTableData()
          }).catch(error => {
            this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
          })
        })
      }
    }
  }

</script>
