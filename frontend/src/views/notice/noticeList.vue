<template>
  <div class="app-container">
    <div class="common-querytable-wrapper">
      <div class="queryform-wrapper">
        <div class="outside">
          <el-form class="basearea">
            <ul class="pull-left">
              <li>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>新增</el-button>
              </li>
            </ul>
          </el-form>
          <ul class="operation-wrapper pull-right">
            <li>
              <!--<div class="common-search-wrapper" @keyup.enter="search">-->
              <!--<input v-model="queryModel.keyword" type="text" placeholder="请输入标题"/>-->
              <!--<a>-->
              <!--<span @click="search" class="el-icon-search"></span>-->
              <!--</a>-->
              <!--</div>-->
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
                <el-form-item label="类型：">
                  <el-select clearable v-model="queryModel.location" placeholder="请选择">
                    <el-option v-for="item in calendarTypeOptions" :key="item.code" :label="item.name"
                               :value="item.code">
                    </el-option>
                  </el-select>
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

    <el-table :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="载入中" border fit
              highlight-current-row :default-sort="{prop: 'id', order: 'descending'}" @sort-change="changeTableSort" :height="$store.state.app.tableHeight">
      <el-table-column align="center" label="ID" width="65" prop="id" sortable="custom"></el-table-column>
      <el-table-column align="center" label="标题" prop="noticeTile" width="300px"></el-table-column>
      <!--<el-table-column align="center" label="副标题" prop="summary" width="300px"></el-table-column>-->
      <el-table-column align="center" label="公告类型">
        <template slot-scope="scope">
          <!--{{scope.row.noticeType}}-->
          {{scope.row.noticeType!==null?$store.state.app.noticeTypeDictionary.filter(item=>item.code===scope.row.noticeType)[0].name:''}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="150px">
        <template slot-scope="scope">
          {{$moment(scope.row.createDate).format('YYYY-MM-DD hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公告日期" width="150px">
        <template slot-scope="scope">
          {{$moment(scope.row.noticeDate).format('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公告状态" width="100px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow" active-value="yes" inactive-value="no" active-color="#13ce66"
                     inactive-color="#ff4949" disabled>
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="200px">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope)" type="primary" size="mini">编辑</el-button>
          <el-button v-if="scope.row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(scope)">
            {{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="common-pagination-wrapper">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.page" :page-sizes="[10,20,30,50]" :page-size="pagination.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <elForm :rules="rules" ref="formData" :model="formData" label-position="right" label-width="140px">
            <el-form-item label="点击链接" prop="url">
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="location">
              <el-select v-model="formData.location" placeholder="请选择">
                <el-option v-for="item in calendarTypeOptions" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结束时间" prop="endDate">
              <el-date-picker v-model="formData.endDate"
                              align="right"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="缩略图" prop="image">
              <div class="common-imguploadpreview-wrapper">
                <div v-if="formData.image===''||formData.image===null">
                  暂无图片
                </div>
                <div v-else v-for="(item, index) in [formData.image]" class="image-item">
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
            <el-form-item label="视频地址" prop="video">
              <el-input v-model="formData.video"></el-input>
            </el-form-item>
            <el-form-item label="iOS可用性" prop="ios">
              <el-switch
                v-model="formData.ios"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="Android可用性" prop="android">
              <el-switch
                v-model="formData.android"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="上线" prop="status">
              <el-switch
                v-model="formData.status"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </elForm>
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
  import {findList, createAdvertising, updateAdvertising, deleteAdvertising} from '@/api/advertising'


  export default {
    name: 'complexTable',
    data() {
      return {
        queryNoticeListAllRequest: 'notice-service/1.0.0/queryNoticeListAll',
        queryNoticedetailRequest: 'notice-service/1.0.0/queryNoticedetail',
        deleteNoticeRequest:'notice-service/1.0.0/deleteNotice',
        calendarTypeOptions: [
          {code: 'start_the', name: '启动页'},
          {code: 'sign_in', name: '签到'},
          {code: 'notice', name: '公告'},
          {code: 'better_discount', name: '好折扣'}
        ],
        statusDictionary: [{
          code: 0,
          type: 'info',
          name: '草稿'
        }, {
          code: 1,
          type: 'success',
          name: '发布'
        }],
        tableKey: 0,
        tableList: [],
        total: null,
        listLoading: true,
        queryModel: {
          location: '',
          sort: '+id'
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
          image: '',
          url: '',
          location: '',
          ios: false,
          android: false,
          video: '',
          status: 0,
          endDate: '',
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
          location: [{required: true, message: '此项为必填项', trigger: 'change'}],
          createDate: [{type: 'date', required: true, message: '请选择可用时间段', trigger: 'change'}],
          image: [{required: true, message: '此项为必填项', trigger: 'change'}],
          url: [{required: false, message: '此项为必填项', trigger: 'change'}],
          ios: [{required: true, message: '此项为必填项', trigger: 'change'}],
          android: [{required: true, message: '此项为必填项', trigger: 'change'}],
          video: [{required: false, message: '此项为必填项', trigger: 'change'}],
          status: [{required: true, message: '此项为必填项', trigger: 'change'}],
          endDate: [{required: true, message: '此项为必填项', trigger: 'change'}],
        },
        downloadLoading: false,
        expandQuery: false,
        fileList: [],
        portraitParams: {
          bucketName: "funyvalley",
          folderName: "advertising"
        },
        effectiveDuration: [],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    computed: {
      calendarTypeKeyValue() {
        this.calendarTypeOptions.reduce((acc, cur) => {
          acc[cur.key] = cur.name
          return acc
        }, {})
      }
    },
    watch: {
      effectiveDuration(value) {
        console.log(value)
        if (value === null) {
          value = [];
        }
        this.formData.createDate = this.$moment(value[0]).format('YYYY-MM-DD');
        this.formData.endDate = this.$moment(value[1]).format('YYYY-MM-DD');
      }
    },
    filters: {
      statusFilter(status) {
        const statusDictionary = {
          0: {
            type: 'info',
            name: '草稿'
          },
          1: {
            type: 'success',
            name: '发布'
          }
        };
        return statusDictionary[status]
      },
      typeFilter(type) {
        return this.calendarTypeKeyValue[type]
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.$http.get(this.$baseUrl + this.queryNoticeListAllRequest + `/${this.pagination.page}`).then(response => {
          console.log(response)
          this.pagination.total = response.numberOfElements;
          this.tableList = response.content;
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
        this.pagination.limit = val
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.pagination.page = val
        this.getTableData()
      },
      updateShelfStatus(row, status) {
        row.status = status
        updateAdvertising(row).then(response => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      resetTemp() {
        this.formData = {
          id: '',
          image: '',
          url: '',
          location: '',
          ios: false,
          android: false,
          video: '',
          status: 0,
          endDate: '',
        }
      },
      handleCreate() {
        this.$router.push({
          name: 'noticeEdit',
          query: {
            id: null,
            deviceType: ''
          }
        });
        // this.resetTemp();
        // this.dialogStatus = 'create';
        // this.dialogFormVisible = true;
        // this.$nextTick(() => {
        //   this.$refs['formData'].clearValidate()
        // })
      },
      createData() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.advertisingCreateRequest, this.formData).then(response => {
              this.dialogFormVisible = false;
              this.$message.success('创建成功');
              this.getTableData()
            }).catch(error => {
              console.log(error)
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        })
      },
      handleUpdate(scope) {
        console.log(scope)
        this.$router.push({
          name: 'noticeEdit',
          query: {
            id: scope.row.id,
            deviceType: scope.row.deviceType
          }
        });
        console.log(scope)
        // this.$http.post(this.$baseUrl + this.queryNoticedetailRequest, {
        //   id: scope.row.id,
        //   deviceType: scope.row.deviceType
        // }).then(response => {
        //   console.log(response)
        //   this.formData = Object.assign(this.formData, {
        //     id: scope.row.id,
        //     image: scope.row.image,
        //     url: scope.row.url,
        //     location: scope.row.location,
        //     ios: scope.row.ios,
        //     android: scope.row.android,
        //     video: scope.row.video,
        //     status: scope.row.status.toString(),
        //     endDate: scope.row.endDate,
        //   });
        //   this.dialogStatus = 'update';
        //   this.dialogFormVisible = true;
        //   this.$nextTick(() => {
        //     this.$refs['formData'].clearValidate()
        //   })
        // }).catch(error => {
        //   this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        // })

      },
      updateData() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.advertisingUpdate, this.formData).then(() => {
              this.getTableData();
              this.dialogFormVisible = false;
              this.$message.success('更新成功')
            }).catch(error => {
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        })
      },
      handleDelete(scope) {
        console.log(scope)
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.$baseUrl + this.deleteNoticeRequest + `/${scope.row.id}`, {}).then(response => {
            console.log(response)
            this.$message.success('删除成功');
            this.getTableData();
          }).catch(error => {
            this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
          })
        }).catch(error => {
          console.log(error)
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
        this.queryModel.name = '';
        this.pagination.page = 1;
        this.queryModel.location = '';

        this.getTableData();
      },
      changeTableSort(row, column) {
        this.queryModel.sort === '+id' ? this.queryModel.sort = '-id' : this.queryModel.sort = '+id';
        this.getTableData()
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
      handlePreview(file) {
        console.log(file);
        this.fileList.push(file);
      },
      uploadSuccess(response) {
        this.loading = false;
        console.log(response)
        this.formData.image = response.url;
        this.loading = false;
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
      },
      handleRemove() {

      },
      uploadAvatarExceeded() {

      },
      deleteImage(index) {
        this.formData.image = '';
        this.fileList.splice(index, 1);
      }
    }
  }
</script>
