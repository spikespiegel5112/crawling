<template>
  <el-row class="app-container">
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
            <li>
              <div class="common-search-wrapper" @keyup.enter="search">
                <input v-model="queryModel.name" type="text" placeholder="请输入元数据名称"/>
                <a>
                  <span @click="search" class="el-icon-search"></span>
                </a>
              </div>
            </li>
            <li>
              <el-button size="mini" class="expand" type="text" @click='expand'>高级搜索<i
                class="el-icon-arrow-down"></i></el-button>
            </li>
          </ul>
        </div>
        <div class="expandarea" :class="{active:expandQuery}">
          <el-form ref="form" :model="queryModel" size="mini" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="feature名称：">
                  <el-input v-model="queryModel.name" placeholder="请输入"></el-input>
                </el-form-item>
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
    <el-row>
      <el-form label-position="top" label-width="80px">
        <el-form-item label="审核版本">
          <CommonTag title="iOS" :tagData="iosVersionListData" buttonText="添加版本" :metaData="['ios']"
                     @add="handleAddMetaDataList" @delete="handleDeleteMetaData"/>
          <CommonTag title="Android" :tagData="androidVersionListData" buttonText="添加版本"
                     :metaData="['android']"
                     @add="handleAddMetaDataList" @delete="handleDeleteMetaData"/>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row
              :height="metaTableHeight">
      <el-table-column label="No" type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column label="名称" align="center" prop="name"></el-table-column>
      <el-table-column align="center" label="Android可用性" prop="available">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.androidEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="iOS可用性" prop="available">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.iosEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="editAvailability(scope)">设置可用性</el-button>-->
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common-pagination-wrapper">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.page" :page-sizes="[10,20,30,50]" :page-size="pagination.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
      </el-pagination>
    </div>
    <!-- 弹框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="1200px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData" label-position="right" label-width="140px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="iOS可用性" prop="iosEnable">
              <el-switch
                v-model="formData.iosEnable"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="Android可用性" prop="androidEnable">
              <el-switch
                v-model="formData.androidEnable"
                active-color="#13ce66"
                inactive-color="#ff4949">
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
</template>

<script>
  import CommonTag from '@/views/common/CommonTag.vue'

  export default {
    components: {
      CommonTag
    },
    data() {
      return {
        editFeatureMetadata: 'meta-service/1.0.0/feature/',
        featureListRequest: 'meta-service/1.0.0/feature/bk/list',
        featureAvailabilityRequest: 'meta-service/1.0.0/availability',
        versionListRequest: 'meta-service/1.0.0/availability/versionList/',
        versionControlRequest: 'meta-service/1.0.0/versionControl/',

        dialogFormVisible: false,
        editFlag: true,
        value2: '',
        value1: '',
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        importanceOptions: [1, 2, 3],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        formData: {
          id: '',
          name: '',
          iosEnable: false,
          androidEnable: false
        },
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          id: [{required: true, message: '请输入ID', trigger: 'change'}],
          name: [{required: true, message: '请输入名称', trigger: 'change'}],
          moduleId: [{required: true, message: '请输入名称', trigger: 'change'}],
          type: [{required: true, message: '请输入名称', trigger: 'change'}],
          iosEnable: [{required: true, message: '请输入名称', trigger: 'change'}],
          androidEnable: [{required: true, message: '请输入名称', trigger: 'change'}],
          version: [{required: true, message: '请输入名称', trigger: 'change'}],
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
        queryModel: {
          name: ''
        },
        pagination: {
          page: 1,
          limit: 20,
          total: 0
        }
      }
    },
    computed: {
      metaTableHeight() {
        return this.$store.state.app.tableHeight - 140;
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status]
      }
    },
    mounted() {
      this.getControllableVersionList();
      this.getTableData();
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.featureListRequest, {
          params: Object.assign(this.queryModel, this.pagination)
        }).then(response => {
          console.log(response)
          this.list = response.list;
          this.pagination.total = response.total;
          this.listLoading = false;
        }).catch(error => {
          console.log(error)
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      getControllableVersionList() {
        this.$http.get(this.$baseUrl + this.versionListRequest).then(response => {
          console.log(response)

          this.androidVersionListData = response.androidList;
          this.iosVersionListData = response.iosList;
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
      resetTemp() {
        this.formData = {
          id: '',
          name: '',
        }
      },
      handleCreate() {
        // this.resetTemp();
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
        const formData = this.formData;
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.editFeatureMetadata, {
              name: formData.name,
              id: '',
              iosEnable: formData.iosEnable,
              androidEnable: formData.androidEnable,
            }, {
              headers: {
                'Authorization': 'Bearer ' + this.$store.state.user.token
              }
            }).then((response) => {
              console.log(response)
              this.dialogFormVisible = false;
              this.$message.success('信息创建成功');
              this.getTableData();
            }).catch(error => {
              console.log(error)
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        })
      },
      handleUpdate(scope) {
        this.formData = Object.assign({}, scope.row);
        console.log(this.formData)

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        const formData = this.formData;
        this.$refs['formData'].validate((valid) => {
          this.$http.post(this.$baseUrl + this.editFeatureMetadata, {
            name: formData.name,
            id: formData.id,
            iosEnable: formData.iosEnable,
            androidEnable: formData.androidEnable,
          }, {
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.user.token
            }
          }).then((response) => {
            console.log(response)
            this.dialogFormVisible = false;
            this.$message.success('信息修改成功');
            this.getTableData();
          }).catch(error => {
            console.log(error)
            this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
          })
        });
      },
      handleDelete(scope) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(this.$baseUrl + `meta-service/1.0.0/feature/${scope.row.id}`, {
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.user.token
            }
          }).then((response) => {
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
      uploadSuccess(response) {
        this.loading = false;
        console.log(response)
        this.formData.icon = response.url;
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
      editAvailability() {
        this.dialogFormVisible = true;
      },
      handleAddMetaDataList(data, type) {
        console.log(data)
        console.log(type)
        if (data.length > 0 && data.filter(item => item === data[data.length - 1]).length > 1) {
          return
        }
        this.$http.post(this.$baseUrl + this.versionControlRequest, {
          deviceType: type,
          version: data[data.length - 1]
        }).then(response => {
          console.log(response)
          this.$message.success(response.response.data)
        }).catch(error => {
          console.log(error)
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      handleDeleteMetaData(data, index, type) {
        this.$http.delete(this.$baseUrl + this.versionControlRequest + `${type}/${data}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.$store.state.user.token
          }
        }).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      handleAndroidListChange(data) {

      },
      add() {

      },
      expand() {
        this.expandQuery = !this.expandQuery;
      },
      search() {
        this.getTableData()
      },
      reset() {
        this.queryModel.available = true;
      },
      deleteImage(index) {
        this.formData.iconPath = '';
        this.fileList.splice(index, 1);
      }
    }
  }
</script>
