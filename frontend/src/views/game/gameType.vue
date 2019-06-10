<
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
          <input v-model="queryModel.name" type="text" placeholder="请输入游戏名称"/>
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
      <el-table-column label="名称" align="center" prop="name"></el-table-column>
      <el-table-column align="center" label="游戏状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===0?'info':'success'">
            {{(scope.row.status!==''&&scope.row.status!==null)?statusDictionary.filter(item=>item.code===scope.row.status)[0].name:''}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)" disabled>编辑</el-button>
          <!--<el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common-pagination-wrapper">
      <el-pagination background @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="pagination.page"
                     :page-sizes="[10,20,30,50]"
                     :page-size="pagination.limit"
                     :total="total"
                     layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
      <el-row type="flex" justify="center">
        <el-col :span="20">

          <el-form :rules="rules" ref="formData" :model="formData" label-position="right" label-width="140px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>


            <el-form-item label="status" prop="status">
              <el-select v-model="formData.status">
                <el-option v-for="item in statusDictionary" :label="item.name" :value="item.code"
                           :key="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="置顶数" prop="topNumber">
              <el-input-number v-model="formData.topNumber" :min="0" label="描述文字"></el-input-number>
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
      CommonQuery
    },
    data() {
      return {
        game_typeListRequest: 'game-service/1.0.0/game_type/list',
        game_typeAddOrUpdateRequest: 'game-service/1.0.0/game_type/addOrUpdate',
        game_typeDeleteRequest: 'game-service/1.0.0/game_type/delete',

        value2: '',
        value1: '',
        tableKey: 0,
        tableList: [],
        total: null,
        listLoading: true,
        availabilityFlag: false,
        dynamicTags: ['标签一', '标签二', '标签三'],
        queryModel: {
          "title": '',
          "status": '',
          "name": '',
          "gender": '',
          "birthday": '',
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
          limit: 20,
        },
        importanceOptions: [1, 2, 3],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
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
        availabilityFormData: {
          moduleId: '',
          type: '',
          iosEnable: '',
          androidEnable: '',
          version: ''
        },
        rules: {
          title: [{required: true, message: '请输入显示名称', trigger: 'change'}],
          name: [{required: true, message: '请输入唯一表示名称', trigger: 'change'}],
          description: [{required: true, message: '请输入游戏描述', trigger: 'change'}],
          iconUrl: [{required: true, message: '请上传图片', trigger: 'change'}],
          bigImageUrl: [{required: true, message: '请上传图片', trigger: 'change'}],
          iosDownloadUrl: [{required: true, message: '此项为必填项', trigger: 'change'}],
          androidDownloadUrl: [{required: true, message: '此项为必填项', trigger: 'change'}],
          webGameUrl: [{required: true, message: '此项为必填项', trigger: 'change'}],
          nature: [{required: true, message: '此项为必填项', trigger: 'change'}],
          ios: [{required: true, message: '此项为必填项', trigger: 'change'}],
          android: [{required: true, message: '此项为必填项', trigger: 'change'}],
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

      }
    },
    computed: {
      tableHeight() {
        return this.$store.state.app.tableHeight;
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
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.game_typeListRequest, {
          params: this.queryModel
        }).then(response => {
          console.log(response)

          this.tableList = response.list;
          this.total = response.total;
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
      resetTemp() {
        this.formData = {
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
        };
        this.fileList = []
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
        this.formData.id = 0;
        this.updateData();
      },
      handleUpdate(scope) {
        console.log(scope)
        this.formData = Object.assign({}, scope.row);
        this.effectiveDuration = [scope.row.startDate, scope.row.endDate]

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.game_typeAddOrUpdateRequest, {
              id: this.formData.id,
              name: this.formData.name,
              status: this.formData.status,
              topNumber: this.formData.topNumber
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
          this.$http.delete(this.$baseUrl + this.game_typeDeleteRequest+`/${scope.row.id}`).then((response) => {
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
        console.log(file)
      },
      handlePreview(file) {
        console.log(file);
        this.fileList.push(file);
      },
      uploadSuccess1(response) {
        this.loading = false;
        console.log(response)
        this.formData.iconUrl = response.url;
        this.loading = false;
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
      },
      uploadSuccess2(response) {
        this.loading = false;
        console.log(response)
        this.formData.bigImageUrl = response.url;
        this.loading = false;
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
      },
      uploadAvatarExceeded(files, fileList) {
        if (fileList.length > 0) {
          this.$confirm('当前已有上传图片，需先删除已有图片，请确认是否删除？', '提示', {
            type: 'warning'
          }).then(resolve => {
            this.$refs['uploadAvatar'].clearFiles();
            this.$http.get(this.$baseUrl + 'attachment/deleteAttachment/' + this.fileList[0].id).then(response => {
              if (response.data.code === '200') {
                this.fileList.splice(this.fileList.indexOf(response.id), 1);
                this.componentModelData.uploaded = '';
                this.$message.success('图片删除成功')
              } else {
                this.fileList.splice(this.fileList.indexOf(response.id), 1);
                this.componentModelData.uploaded = '';
                this.$message.warning('图片删除失败')
              }
            }).catch(error => {
              console.log(error)
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          })
        }
      },
      handleRemove() {

      },
      handleBeforeUpload(file) {
        console.log(file)
        let suffixDictionary = ['jpg', 'jpeg', 'png'];
        let index1 = file.name.lastIndexOf('.') + 1;
        let index2 = file.name.length;
        let fileSuffix = file.name.substring(index1, index2);
        if (suffixDictionary.filter(item => item === fileSuffix).length === 0) {
          this.$message({
            message: '文件必须为' + suffixDictionary.join('、') + '类型文件',
            type: 'error'
          });
          return false;
        }
        if (file.size > 1024 * 1024 * 2) {
          this.$message({
            message: '文件不得大于2M',
            type: 'error'
          });
          return false;
        }
        this.loading = true;
      },
      editAvailability(scope) {
        console.log(scope.row)

        this.availabilityFormData = Object.assign({}, {
          "moduleId": scope.row.id,
          "type": scope.row.type,
          "iosEnable": scope.row.iosEnable,
          "androidEnable": scope.row.androidEnable,
          "version": scope.row.version,
        })
        console.log(this.availabilityFormData)
        this.availabilityFlag = true;

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
      deleteImage(index) {
        this.formData.icon = '';
        this.fileList.splice(index, 1);
      }
    }
  }
</script>
