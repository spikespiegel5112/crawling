<template>
  <div class="app-container">
    <div class="common-querytable-wrapper">
      <div class="queryform-wrapper">
        <div class="outside">
          <el-form class="basearea">
            <ul class="pull-left">
              <!--<li>-->
              <!--<el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>-->
              <!--新增-->
              <!--</el-button>-->
              <!--</li>-->
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
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="search" v-waves>搜索
                  </el-button>
                  <el-button type="primary" size="mini" icon="el-icon-refresh" @click="reset" v-waves>重置
                  </el-button>
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
      <el-table-column label="名称" align="center" width="150">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="赏金" width="100">
        <template slot-scope="scope">
          {{scope.row.bounty}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="赏金类型" width="100">
        <template slot-scope="scope">
          {{$store.state.app.bountyType.filter(item=>item.code===scope.row.bountyType)[0].name}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{scope.row.note}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="完成数" width="70">
        <template slot-scope="scope">
          {{scope.row.completedNum}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="剩余数量" width="80">
        <template slot-scope="scope">
          {{scope.row.surplusNum}}
        </template>
      </el-table-column>
      <!--<el-table-column align="center" prop="isShow" label="上架">-->
        <!--<template slot-scope="scope">-->
          <!--<el-switch v-model="scope.row.isShow" :active-value="1" :inactive-value="0" active-color="#13ce66"-->
                     <!--inactive-color="#ff4949" @change="updateShelfStatus(scope)">-->
          <!--</el-switch>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" prop="created_at" label="添加时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)" v-waves>编辑</el-button>
          <!--<el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--<div class="common-pagination-wrapper">-->
      <!--<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
                     <!--:current-page="pagination.page" :page-sizes="[10,20,30,50]" :page-size="pagination.limit"-->
                     <!--layout="total, sizes, prev, pager, next, jumper" :total="total">-->
      <!--</el-pagination>-->
    <!--</div>-->
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData" label-position="right" label-width="150px">

            <el-form-item label="任务名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <!--<el-form-item label="任务图片" prop="iconPath">-->
              <!--<div class="common-imguploadpreview-wrapper">-->
                <!--<a v-if="formData.iconPath!==''" class="close">-->
                  <!--<span class="iconfont icon-crosswide"></span>-->
                <!--</a>-->
                <!--<div v-if="formData.iconPath===''||formData.iconPath===null">-->
                  <!--暂无图片-->
                <!--</div>-->
                <!--<img v-else :src="formData.iconPath+'-style_100x100'" class="avatar" />-->
              <!--</div>-->
              <!-- ref="uploadAvatar"-->
                         <!--:action="$prodBaseUrl+'image-upload-service/1.0.0/file/upload'" :limit="1"-->
                         <!--:show-file-list="false"-->
                         <!--:before-upload="handleBeforeUpload" :on-preview="handlePreview" :on-remove="handleRemove"-->
                         <!--:on-success="uploadSuccess" :on-exceed="uploadAvatarExceeded" :file-list="fileList"-->
                         <!--:data="portraitParams">-->
                <!--<el-button v-waves size="small" type="primary">点击上传</el-button>-->
                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>-->
              <!--</el-upload>-->
            <!--</el-form-item>-->
            <el-form-item label="赏金" prop="bounty">
              <el-input v-model.number="formData.bounty"></el-input>
            </el-form-item>
            <el-form-item label="任务开始结束时间" prop="startDate">
              <el-date-picker
                v-model="effectiveDuration"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="是否上架" prop="isShow">
              <el-switch v-model="formData.isShow" :active-value="1" :inactive-value="0" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.note"></el-input>
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
    <!--  -->
  </div>
</template>

<script>
  import {getResterList, updateShelfStatusRequest} from '@/api/task'

  export default {
    data() {
      return {
        getInvitationRegRequest: 'task-service/1.0.0/invitationre/bk/getInvitationReg',
        saveInvitationRegRequest: 'task-service/1.0.0/invitationre/bk/saveInvitationReg',
        delTaskRequest: 'task-service/1.0.0/task/bk/delTask/',
        value2: '',
        value1: '',
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
        importanceOptions: [1, 2, 3],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        formData: {
          id: null,
          name: '',
          note: '',
          bounty: '',
          bountyType: '',
          surplusNum:''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          name: [{required: true, message: 'name is required', trigger: 'change'}],
          note: [{
            required: false,
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
          startDate: [{
            required: false,
            message: "此项为必填项",
            trigger: "change"
          }],
          endDate: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          bountyType: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          isShow: [{
            required: true,
            message: "此项为必填项",
            trigger: "change"
          }],
          effectiveDuration: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
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
        expandQuery: false,
        portraitParams: {
          bucketName: "funyvalley",
          folderName: "task"
        },
        fileList: [],
        effectiveDuration: []
      }
    },
    computed:{
      tableHeight(){
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
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        console.log(Object.assign(this.queryModel, this.pagination))
        this.$http.get(this.$baseUrl + this.getInvitationRegRequest, {
          params: Object.assign(this.queryModel, this.pagination)
        }).then(response => {
          console.log(response)
          this.tableList = response;
          this.total = response.totalElements;
          this.listLoading = false
        })
      },
      handleFilter() {
        this.pagination.page = 1;
        this.getTableData()
      },
      handleSizeChange(val) {
        this.pagination.limit = val;
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.pagination.page = val;
        this.getTableData()
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
          id: null,
          name: '',
          note: '',
          startDate: null,
          endDate: null,
          iconPath: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      createData() {
      },
      handleUpdate(scope) {
        this.formData = Object.assign(this.formData, scope.row);
        this.effectiveDuration=[scope.row.startDate, scope.row.endDate];
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.saveInvitationRegRequest, {
              id: this.formData.id,
              name: this.formData.name,
              note: this.formData.note,
              iconPath: this.formData.iconPath,
              bounty: this.formData.bounty,
              startDate: this.formData.startDate!==null?this.$moment(this.formData.startDate).format('YYYY-MM-DD'):'',
              endDate: this.formData.startDate!==null?this.$moment(this.formData.endDate).format('YYYY-MM-DD'):'',
              isShow: this.formData.isShow,
              submitPath: this.formData.submitPath,
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
          this.$http.post(this.$baseUrl + this.delTaskRequest + scope.row.id).then((response) => {
            console.log(response)
            this.dialogFormVisible = false;
            this.$message.success('删除成功');
            this.getTableData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      changeUpload(file) {
        console.log(file)
      },
      expand() {
        this.expandQuery = !this.expandQuery;
      },
      search() {
        this.getTableData();
      },
      reset() {
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
        this.formData.detailImage.splice(index, 1);
        this.formData.detailImage.forEach((item, index) => {
          if (item === this.formData.image) {
            this.formData.image = item;
          }
        });
        this.fileList = this.fileList.filter(item => item.uid !== file.uid);
        console.log(this.formData.detailImage);
      },
      uploadSuccess(response, file, fileList) {
        this.loading = false;
        console.log(file);
        console.log(response);
        console.log(6, fileList);
        this.formData.iconPath = response.url;
        this.fileList.push(response);
        console.log(this.formData);
        // this.formData.detailImage.push(response.url);
        console.log(fileList);
        // this.formData.detailImage.forEach((item, index) => {
        //   if (item.url === this.formData.image) {
        //     this.formData.detailImage.splice(index, 1)
        //   }
        // });

        this.loading = false;
        this.$message({
          message: "图片上传成功",
          type: "success"
        });
      },
      uploadAvatarExceeded(files, fileList) {
      }
    }
  }
</script>
