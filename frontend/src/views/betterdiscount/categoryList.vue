<template>
  <div class="app-container">
    <div class="common-querytable-wrapper">
      <div class="queryform-wrapper">
        <div class="outside">
          <el-form class="basearea">
            <ul class="pull-left">
              <li>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>
                  新增
                </el-button>
              </li>
            </ul>
          </el-form>
          <ul class="operation-wrapper pull-right">
            <!--<li>-->
              <!--<div class="common-search-wrapper" @keyup.enter="onSearch">-->
                <!--<input v-model="searchTxt" type="text" placeholder="请输入名称"/>-->
                <!--<a>-->
                  <!--<span @click="search" class="el-icon-search"></span>-->
                <!--</a>-->
              <!--</div>-->
            <!--</li>-->
            <!--<li>-->
              <!--<el-button size="mini" class="expand" type="text" @click='expand'>高级搜索<i-->
                <!--class="el-icon-arrow-down"></i></el-button>-->
            <!--</li>-->
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
                  <el-button type="primary" size="mini" icon="el-icon-search"
                             @click="search">搜索
                  </el-button>
                  <el-button type="primary" size="mini" icon="el-icon-refresh"
                             @click="reset">重置
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>


    <el-table :data="tableData" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row :height="tableHeight">
      <el-table-column align="center" label='ID' width="40" prop="id"></el-table-column>
      <el-table-column label="商品类目" align="center" prop="title"></el-table-column>
      <el-table-column label="商品类目副标题" align="center" prop="summary"></el-table-column>
      <el-table-column label="图片" width="150" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl+'-style_100x100'" width="80">
        </template>
      </el-table-column>
      <el-table-column align="center" label="可用性" prop="status">
        <template slot-scope="scope">
          {{scope.row.status==='0'?'不可用':'可用'}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1200px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData" label-position="right" label-width="130px">
            <el-form-item label="商品类目" prop="title">
              <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="商品类目副标题" prop="summary">
              <el-input v-model="formData.summary"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="imageUrl">
              <div class="common-imguploadpreview-wrapper">
                <div v-if="formData.imageUrl===''||formData.imageUrl===null">
                  暂无图片
                </div>
                <div v-else v-for="(item, index) in [formData.imageUrl]" class="image-item">
                  <img :src="item+'-style_100x100'" class="avatar" />
                  <ul class="operator">
                    <li>
                      <a class="el-icon-delete" @click="deleteImage(index)"></a>
                    </li>
                  </ul>
                </div>



                <!--<a v-if="formData.imageUrl!==''" class="close">-->
                  <!--<span class="iconfont icon-crosswide"></span>-->
                <!--</a>-->
                <!--<img v-if="formData.imageUrl===''||formData.imageUrl===undefined||formData.imageUrl===null"-->
                     <!--src="../../../static/img/default/defaultavatar_60_60.png"-->
                     <!--class="avatar" />-->
                <!--<img v-else :src="formData.imageUrl+'-style_100x100'"-->
                     <!--class="avatar" />-->
              </div>
              <el-upload
                class="common-imguploadpreview-wrapper"
                ref="uploadAvatar"
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                :limit="1"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :on-exceed="uploadAvatarExceeded"
                :file-list="fileList"
                :data="portraitParams">
                <el-button v-waves size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过10MB
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch v-model="formData.status" active-value="1" inactive-value="0" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="add">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="update">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--  -->
  </div>
</template>

<script>

  export default {
    data() {
      return {
        categoryListRequest: 'better-discount-service/1.0.0/queryTitleTypeList',
        addTitleTypeRequest: 'better-discount-service/1.0.0/addTitleType',
        updateTitleTypeRequest: 'better-discount-service/1.0.0/updateTitleType',
        deleteTitleTypeRequest: 'better-discount-service/1.0.0/deleteTitleType',


        statusDictionary: [{
          name: '不可用',
          code: '0'
        }, {
          name: '可用',
          code: '1'
        }],

        value2: '',
        value1: '',
        tableKey: 0,
        tableData: [],
        total: null,
        listLoading: true,
        queryModel: {
          importance: null,
          keyword: '',
          type: null,
          sort: '+id'
        },
        pagination:{
          page: 1,
          limit: 20,
        },
        importanceOptions: [1, 2, 3],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        formData: {
          id: null,
          title: '',
          summary: '',
          type: null,
          imageUrl: null,
          status: '',
        },
        rules: {
          name: [{required: true, message: 'name is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'change'}],
          summary: [{required: true, message: 'title is required', trigger: 'change'}],
          type: [{required: true, message: 'title is required', trigger: 'change'}],
          imageUrl: [{required: true, message: 'title is required', trigger: 'change'}],
          status: [{required: true, message: 'title is required', trigger: 'change'}]
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],

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
        iosVersionListData: [],
        androidVersionListData: [],
        searchTxt: '',
        expandQuery: '',
        fileList: [],
        portraitParams: {
          bucketName: 'funyvalley',
          folderName: 'icon'
        },
      }
    },
    computed:{
      tableHeight(){
        return this.$store.state.app.tableHeight
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.$http.get(this.$baseUrl + this.categoryListRequest).then(response => {
          console.log(response);
          this.tableData = response;
          this.listLoading = false;
        }).catch(error => {
          console.log(error)
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
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
      updateShelfStatus(row, status) {
        updateShelfStatusRequest(row.id, status).then(response => {
          if (response) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            row.isShow = status
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
        })
      },
      resetTemp() {
        this.formData = {
          id: null,
          title: '',
          summary: '',
          type: null,
          imageUrl: null,
          status: '',
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      add() {
        this.$refs.formData.validate(valid => {
          if (valid) {
            console.log(this.formData)
            this.$http.post(this.$baseUrl + this.addTitleTypeRequest, {
              title: this.formData.title,
              summary: this.formData.summary,
              imageUrl: this.formData.imageUrl,
              status: this.formData.status,
            }).then(response => {
              this.$message.success('产品类型创建成功');
              this.dialogFormVisible = false;
              this.getTableData();
            }).catch(error => {
              console.log(error)
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        });
      },
      handleUpdate(scope) {
        this.formData.id = scope.row.id;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
        this.formData = scope.row;
        console.log(this.formData)
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      update() {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.updateTitleTypeRequest, {
              id: this.formData.id,
              type: this.formData.type,
              title: this.formData.title,
              summary: this.formData.summary,
              imageUrl: this.formData.imageUrl,
              status: this.formData.status,
            }).then(response => {
              this.$message.success('修改成功')
              this.dialogFormVisible = false;
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
          this.$http.get(this.$baseUrl + this.deleteTitleTypeRequest + `/${scope.row.type}`).then(response => {
            this.$message.success('删除成功');
            this.getTableData();
          }).catch(error => {
            console.log(error)
            this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },
      changeUpload(file) {
        console.log(file)
      },
      handleAndroidListChange(data) {

      },

      expand() {
        this.expandQuery = !this.expandQuery;
      },
      search() {

      },
      reset() {
        this.queryModel.name = '';
        this.queryModel.type = null;
        this.queryModel.goodsNumber = '';
        this.pagination.page = 1;
        this.getTableData();
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
      handlePreview(file) {
        console.log(file);
        this.fileList.push(file);
      },
      handleRemove() {

      },
      uploadSuccess(response) {
        this.loading = false;
        console.log(response)
        this.formData.imageUrl = response.url;
        this.fileList.push(response);
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
      deleteImage(index) {
        this.formData.imageUrl = '';
        this.fileList.splice(index, 1);
      }
    }
  }
</script>
