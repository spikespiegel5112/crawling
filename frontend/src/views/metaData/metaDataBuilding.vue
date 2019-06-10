<template>
  <el-row class="app-container">
    <!--<CommonQuery>-->
      <!--<template slot="button1">-->
        <!--<el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>-->
          <!--新增-->
        <!--</el-button>-->
      <!--</template>-->
      <!--<template slot="query1">-->
        <!--<div class="common-search-wrapper" @keyup.enter="search">-->
          <!--<input v-model="queryModel.name" type="text" placeholder="请输入元数据名称"/>-->
          <!--<a>-->
            <!--<span @click="search" class="el-icon-search"></span>-->
          <!--</a>-->
        <!--</div>-->
      <!--</template>-->
    <!--</CommonQuery>-->

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
                <el-form-item label="是否可用：">
                  <el-switch
                    v-model="queryModel.available"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  >
                  </el-switch>
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
      <el-table-column label="显示名称" align="center" prop="label"></el-table-column>
      <el-table-column label="唯一表示名称" align="center" prop="name"></el-table-column>

      <el-table-column label="Icon" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.icon+'-style_100x100'" width="80">
        </template>
      </el-table-column>
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
      <el-table-column align="center" label="点击反映类型" prop="actionType"></el-table-column>
      <el-table-column align="center" label="actionParam" prop="actionParam"></el-table-column>
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="editAvailability(scope)">设置可用性</el-button>-->
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
            <el-form-item label="显示名称" prop="label">
              <el-input v-model="formData.label"></el-input>
            </el-form-item>
            <el-form-item label="唯一表示名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="Icon" prop="icon">
              <div class="common-imguploadpreview-wrapper">
                <a v-if="formData.icon!==''" class="close">
                  <span class="iconfont icon-crosswide"></span>
                </a>
                <div v-if="formData.icon===''||formData.icon===null">
                  暂无图片
                </div>
                <div v-else v-for="(item, index) in [formData.icon]" class="image-item">
                  <img :src="item+'-style_100x100'" class="avatar" />
                  <ul class="operator">
                    <li>
                      <a class="el-icon-delete" @click="deleteImage(index)"></a>
                    </li>
                  </ul>
                </div>
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
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="点击反映类型" prop="actionType">
              <el-select v-model="formData.actionType">
                <el-option v-for="item in $store.state.app.actionType"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="actionParam" prop="name">
              <el-input v-model="formData.actionParam"></el-input>
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

    <el-dialog title="设置可用性" :visible.sync="availabilityFlag" width="1200px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="availabilityFormData" :model="availabilityFormData" label-position="right"
                   label-width="140px">
            <el-form-item label="iOS可用性" prop="iosAvailability">
              <el-switch
                v-model="availabilityFormData.iosEnable"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="Android可用性" prop="androidAvailability">
              <el-switch
                v-model="availabilityFormData.androidEnable"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="availabilityFlag = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
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
        buildingsRequest: 'meta-service/1.0.0/buildings/bk/list',
        editBuildingMetadata: 'meta-service/1.0.0/buildings/',
        editAvailabilityRequest: 'meta-service/1.0.0/availability/',
        versionListRequest: 'meta-service/1.0.0/availability/versionList/',
        versionControlRequest: 'meta-service/1.0.0/versionControl/',

        value2: '',
        value1: '',
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        availabilityFlag: false,
        dynamicTags: ['标签一', '标签二', '标签三'],
        queryModel: {
          available: true,
          "platformId": '',
          "status": '',
          "name": '',
          "gender": '',
          "birthday": '',
        },
        pagination: {
          page: 1,
          limit: 20,
        },
        importanceOptions: [1, 2, 3],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        formData: {
          id: '',
          name: '',
          "label": "",
          "available": false,
          "actionType": "",
          "actionParam": "",
          "icon": "",
          iosEnable: false,
          androidEnable: false
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
          label: [{required: true, message: '请输入显示名称', trigger: 'change'}],
          name: [{required: true, message: '请输入唯一表示名称', trigger: 'change'}],
          icon: [{required: true, message: '请上传图片', trigger: 'change'}],
          available: [{required: true, message: '请选择是否可用', trigger: 'change'}],
          type: [{required: true, message: '请选择类型', trigger: 'change'}],
          moduleId: [{required: true, message: '请选择类型', trigger: 'change'}],
          version: [{required: true, message: '请输入版本号', trigger: 'change'}],
          actionType: [{required: true, message: '请选择反映类型', trigger: 'change'}],
          actionParam: [{required: true, message: '请输入actionParam', trigger: 'change'}],
          iosEnable: [{required: true, message: '请输入actionParam', trigger: 'change'}],
          androidEnable: [{required: true, message: '请输入actionParam', trigger: 'change'}]
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
      metaTableHeight() {
        return this.$store.state.app.tableHeight - 140;
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
      this.getControllableVersionList();
      this.getTableData()
    },
    methods: {
      getControllableVersionList() {
        this.$http.get(this.$baseUrl + this.versionListRequest).then(response => {
          console.log(response)

          this.androidVersionListData = response.androidList;
          this.iosVersionListData = response.iosList;
        }).catch(error => {
          this.$message.error(error.response.data)
        })
      },
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.buildingsRequest, {
          params: this.queryModel
        }).then(response => {
          console.log(response)

          this.list = response.list;
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
          id: '',
          name: '',
          "label": "",
          "available": false,
          "actionType": "",
          "actionParam": "",
          "icon": "",
          iosEnable: false,
          androidEnable: false
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
        const formData = this.formData;


        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$refs['formData'].validate((valid) => {
              this.$http.post(this.$baseUrl + this.editBuildingMetadata, {
                id: '',
                "name": formData.name,
                "label": formData.label,
                "available": formData.available,
                "actionType": formData.actionType,
                "actionParam": formData.actionParam,
                "icon": formData.icon,
                iosEnable: formData.iosEnable,
                androidEnable: formData.androidEnable
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
            });
          }
        })
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
        const formData = this.formData;
        this.$refs['formData'].validate((valid) => {
          this.$http.post(this.$baseUrl + this.editBuildingMetadata, {
            id: formData.id,
            "name": formData.name,
            "label": formData.label,
            "available": formData.available,
            "actionType": formData.actionType,
            "actionParam": formData.actionParam,
            "icon": formData.icon,
            iosEnable: formData.iosEnable,
            androidEnable: formData.androidEnable
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
          this.$http.delete(this.$baseUrl + `meta-service/1.0.0/buildings/${scope.row.id}`, {
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
      updateAvailability() {
        this.$ref.availabilityFormData.validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.editAvailabilityRequest, {
              params: {
                "name": formData.name,
                "label": formData.label,
                "available": formData.available,
                "actionType": formData.actionType,
                "actionParam": formData.actionParam,
                "icon": formData.icon
              }
            }).then(response => {
              console.log(response)
            }).catch(error => {
              console.log(error)
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        });
      },
      handleAddMetaDataList(data, type) {
        console.log(data)
        console.log(data.filter(item => item === data[data.length - 1]).length)
        console.log(type)
        if (data.length > 0 && data.filter(item => item === data[data.length - 1]).length > 1) {
          return
        }
        this.$http.post(this.$baseUrl + this.versionControlRequest, {
          deviceType: type,
          version: data[data.length - 1]
        }).catch(error => {
          console.log(error)
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      handleDeleteMetaData(data, index, type) {
        this.$http.delete(this.$baseUrl + this.versionControlRequest + `${type}/${data}`, {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.user.token
          }
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
