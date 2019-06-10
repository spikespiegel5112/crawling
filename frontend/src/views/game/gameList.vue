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
      <el-table-column label="Icon" align="center" width="150">
        <template slot-scope="scope">
          <img :src="$checkOSS(scope.row.iconUrl)" width="80">
        </template>
      </el-table-column>
      <el-table-column label="大图" align="center" width="150">
        <template slot-scope="scope">
          <img :src="$checkOSS(scope.row.bigImageUrl)" width="80">
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题" prop="title" width="200"></el-table-column>
      <el-table-column align="center" label="游戏种类">
        <template slot-scope="scope">
          <el-tag>
            {{(scope.row.nature!==''&&scope.row.nature!==null)?natureDictionary.filter(item=>item.code===scope.row.nature)[0].name:''}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="游戏状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===0?'info':'success'">
            {{(scope.row.status!==''&&scope.row.status!==null)?statusDictionary.filter(item=>item.code===scope.row.status)[0].name:''}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="来源" prop="source"></el-table-column>
      <el-table-column align="center" label="合同时间范围" width="200px">
        <template slot-scope="scope">
          {{scope.row.startDate}} 至 {{scope.row.endDate}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
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
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.description"></el-input>
            </el-form-item>

            <el-form-item label="Icon" prop="iconUrl">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess1"
                :returnUrlList.sync="formData.iconUrl"
                fileType="image"
              />
              <el-input v-show="false" v-model="formData.iconUrl"></el-input>
            </el-form-item>
            <el-form-item label="游戏大图" prop="bigImageUrl">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess2"
                :returnUrlList.sync="formData.bigImageUrl"
                fileType="image"
              />
              <el-input v-show="false" v-model="formData.bigImageUrl"></el-input>
            </el-form-item>
            <el-form-item label="iOS游戏下载链接" prop="iosDownloadUrl">
              <el-input v-model="formData.iosDownloadUrl"></el-input>
            </el-form-item>
            <el-form-item label="Android游戏下载链接" prop="androidDownloadUrl">
              <el-input v-model="formData.androidDownloadUrl"></el-input>
            </el-form-item>
            <el-form-item label="Web游戏下载链接" prop="webGameUrl">
              <el-input v-model="formData.webGameUrl"></el-input>
            </el-form-item>

            <el-form-item label="游戏种类" prop="nature">
              <el-select v-model="formData.nature">
                <el-option v-for="item in natureDictionary" :label="item.name" :value="item.code"
                           :key="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="iOS App ID" prop="iosAppId">
              <el-input v-model="formData.iosAppId"></el-input>
            </el-form-item>
            <el-form-item label="iOS可用性" prop="ios">
              <el-switch v-model="formData.ios" :active-value="true" :inactive-value="false" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="Android可用性" prop="android">
              <el-switch v-model="formData.android" :active-value="true" :inactive-value="false" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="游戏状态" prop="status">
              <el-select v-model="formData.status">
                <el-option v-for="item in statusDictionary" :label="item.name" :value="item.code"
                           :key="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="来源" prop="source">
              <el-input v-model="formData.source"></el-input>
            </el-form-item>
            <el-form-item label="合同时间范围" prop="startDate">
              <el-date-picker
                v-model="effectiveDuration"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
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
        game_infoListRequest: 'game-service/1.0.0/game_info/list',
        game_infoAddOrUpdateRequest: 'game-service/1.0.0/game_info/addOrUpdate',
        game_infoDeleteRequest: 'game-service/1.0.0/game_info/delete',

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
          status: null,
          iosAppId: '',
          source: ''
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
          name: [{required: true, message: '请输入名称', trigger: 'change'}],
          title: [{required: false, message: '请输入标题', trigger: 'change'}],
          description: [{required: false, message: '请输入游戏描述', trigger: 'change'}],
          iconUrl: [{required: false, message: '请上传图片', trigger: 'change'}],
          bigImageUrl: [{required: false, message: '请上传图片', trigger: 'change'}],
          iosDownloadUrl: [{required: false, message: '此项为必填项', trigger: 'change'}],
          androidDownloadUrl: [{required: false, message: '此项为必填项', trigger: 'change'}],
          webGameUrl: [{required: false, message: '此项为必填项', trigger: 'change'}],
          nature: [{required: true, message: '此项为必填项', trigger: 'change'}],
          ios: [{required: true, message: '此项为必填项', trigger: 'change'}],
          android: [{required: true, message: '此项为必填项', trigger: 'change'}],
          status: [{required: true, message: '此项为必填项', trigger: 'change'}],
          iosAppId: [{required: false, message: '此项为必填项', trigger: 'change'}],
          source: [{required: true, message: '此项为必填项', trigger: 'change'}],
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
        console.log(value)
        if (value === null) {
          value = [];
        }
        this.formData.startDate = this.$moment(value[0]).format('YYYY-MM-DD');
        this.formData.endDate = this.$moment(value[1]).format('YYYY-MM-DD');
      },
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        let queryModel = {};
        Object.values(this.queryModel).forEach((item, index) => {
          if (item !== '') {
            queryModel[Object.keys(this.queryModel)[index]] = item;
          }
        });
        console.log(this.queryModel)
        console.log(queryModel)
        this.queryModel = Object.assign(queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.game_infoListRequest, {
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
          status: null,
          iosAppId: '',
          source: '',
          startDate: '',
          endDate: ''
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
            this.$http.post(this.$baseUrl + this.game_infoAddOrUpdateRequest, {
              id: this.formData.id,
              name: this.formData.name,
              "title": this.formData.title,
              "description": this.formData.description,
              "iconUrl": this.formData.iconUrl,
              "bigImageUrl": this.formData.bigImageUrl,
              "iosDownloadUrl": this.formData.iosDownloadUrl,
              androidDownloadUrl: this.formData.androidDownloadUrl,
              webGameUrl: this.formData.webGameUrl,
              nature: this.formData.nature,
              ios: this.formData.ios,
              android: this.formData.android,
              status: this.formData.status,
              iosAppId: this.formData.iosAppId,
              source: this.formData.source,
              startDate: this.formData.startDate,
              endDate: this.formData.endDate,
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
          this.$http.delete(this.$baseUrl + this.game_infoDeleteRequest + `/${scope.row.id}`).then((response) => {
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
        console.log(response)
        this.formData.iconUrl = response.url;
      },
      uploadSuccess2(response) {
        this.formData.bigImageUrl = response.url;
      },
      uploadAvatarExceeded(files, fileList) {
        if (fileList.length > 0) {
          this.$confirm('当前已有上传图片，需先删除已有图片，请确认是否删除？', '提示', {
            type: 'warning'
          }).then(resolve => {
            this.$refs['uploadAvatar'].clearFiles();
            this.fileList.splice(fileList.length - 1, 1)
          })
        }
      },
      handleRemove() {

      },
      handleBeforeUpload(file) {
        console.log(file)
        this.showFileListFlag = true;
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
      expand() {
        this.expandQuery = !this.expandQuery;
      },
      search() {
        this.getTableData();
      },
      reset() {
        this.queryModel.available = true;
      },
      deleteImage1(index) {
        this.formData.iconUrl = '';
        this.fileList.splice(index, 1);
      },
      deleteImage2(index) {
        this.formData.bigImageUrl = '';
        this.fileList.splice(index, 1);
      }
    }
  }
</script>
