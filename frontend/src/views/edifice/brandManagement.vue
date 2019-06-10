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
      <el-table-column label="名称" align="center" prop="brandName"></el-table-column>
      <el-table-column label="Icon" align="center" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.icon+'-style_100x100'" width="80">
        </template>
      </el-table-column>
      <el-table-column align="center" label="广告类型">
        <template slot-scope="scope">
          {{(scope.row.type!==''&&scope.row.type!==null)?$store.state.app.brandTypeDictionary.filter(item=>item.code===scope.row.type)[0].name:''}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="钥匙类型">
        <template slot-scope="scope">
          {{(scope.row.type!==''&&scope.row.keyType!==null)?$store.state.app.keyTypeDictionary.filter(item=>item.code===scope.row.keyType)[0].name:''}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否有钥匙" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.keyEnable===1?'success':'info'">
            {{scope.row.keyEnable===1?'有':'无'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdateAdvertisement(scope)">编辑广告</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">编辑品牌</el-button>
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
                     :page-size="pagination.size"
                     :total="total"
                     layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <!-- 编辑品牌 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="brandFormData" :model="brandFormData" label-position="right" label-width="140px">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input v-model="brandFormData.brandName"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="brandFormData.type">
                <el-option v-for="item in $store.state.app.brandTypeDictionary" :label="item.name" :value="item.code"
                           :key="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Icon" prop="icon">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess1"
                :returnUrlList.sync="brandFormData.icon"
                fileType="image"
              />
              <el-input v-show="false" v-model="brandFormData.icon"></el-input>
            </el-form-item>
            <el-form-item label="是否上线" prop="status">
              <el-switch v-model="brandFormData.status" :active-value="1" :inactive-value="0" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否有钥匙" prop="keyEnable">
              <el-switch v-model="brandFormData.keyEnable" :active-value="1" :inactive-value="0" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="钥匙每次发放数" prop="keyNumPerUser">
              <el-input-number v-model="brandFormData.keyNumPerUser"></el-input-number>
            </el-form-item>
            <el-form-item label="总钥匙数" prop="keyTotal">
              <el-input-number v-model="brandFormData.keyTotal"></el-input-number>
            </el-form-item>
            <el-form-item label="钥匙类型" prop="keyType">
              <el-select v-model="brandFormData.keyType">
                <el-option v-for="item in $store.state.app.keyTypeDictionary" :label="item.name" :value="item.code" :key="item.code"></el-option>
              </el-select>

            </el-form-item>
            <el-form-item label="钥匙被领取数">
              <label>{{brandFormData.keyReceived}}</label>
              <!--<el-input-number v-model="brandFormData.keyReceived"></el-input-number>-->
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

    <!-- 编辑广告 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="advertisementDialogFlag" width="850px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <div class="edifice_addminusadvertise_wrapper">
            <el-tooltip class="item" effect="dark" content="添加广告" placement="right">
              <el-button type="primary" icon="el-icon-plus" circle @click="addAdvertise"></el-button>
            </el-tooltip>
          </div>
          <el-collapse accordion @change="switchAdvertisementData">
            <el-collapse-item :title="'广告位'+(index+1)" v-for="(item, index) in advertisementFormDataList" :key="index"
                              label="广告位" :name="index">
              <div class="edifice_addminusadvertise_wrapper">
                <el-tooltip class="item" effect="dark" content="删除广告" placement="right">
                  <el-button type="danger" icon="el-icon-delete" circle @click="deleteAdvertise(item, index)">
                  </el-button>
                </el-tooltip>
              </div>
              <el-form :rules="rules" ref="advertisementFormData" :model="advertisementFormData" label-position="right"
                       label-width="140px">
                <el-form-item label="Icon" prop="url">
                  <CommonUploadImage
                    :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                    @on-success="uploadSuccess2"
                    :returnUrlList.sync="advertisementFormData.url"
                    fileType="image"
                  />
                  <el-input v-show="false" v-model="advertisementFormData.url"></el-input>
                </el-form-item>
                <el-form-item label="广告链接" prop="location">
                  <el-input v-model="advertisementFormData.location"></el-input>
                </el-form-item>
                <el-form-item label="iOS可用性" prop="iosEnable">
                  <el-switch v-model="advertisementFormData.iosEnable" active-color="#13ce66"
                             inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="Android可用性" prop="androidEnable">
                  <el-switch v-model="advertisementFormData.androidEnable" active-color="#13ce66"
                             inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="是否上线" prop="status">
                  <el-switch v-model="advertisementFormData.status" :active-value="1" :inactive-value="0"
                             active-color="#13ce66" inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="广告顺序" prop="orderNum">
                  <ul class="edifice_sortadvertise_wrapper">
                    <Draggable v-model="currentSortData" :options="{}" @start="drag=true" @end="handleDragEnd">
                      <li v-for="(item2, index2) in currentSortData">
                        <img :src="item2.url!==''?item2.url+'-style_100x100':'/static/img/default/empty_700_700.jpg'"/>
                        <a>{{item.isCurrent?'当前广告位':''}}{{item2.name}}</a>
                      </li>
                    </Draggable>
                  </ul>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="advertisementDialogFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createAdvertisementData">
          创建广告
        </el-button>
        <el-button v-else type="primary" @click="updateAdvertisementData" v-waves>
          更新广告
        </el-button>
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
        brandListRequest: 'building-show-service/1.0.0/bk/brand/list',
        brandAddOrUpdateRequest: 'building-show-service/1.0.0/bk/brand/addOrUpdate',
        brandAdvertisementAddOrUpdateRequest: 'building-show-service/1.0.0/bk/brandAdvertisement/addOrUpdate',

        brandDeleteRequest: 'building-show-service/1.0.0/bk/brand/delete',

        value2: '',
        value1: '',
        tableKey: 0,
        tableList: [],
        total: null,
        listLoading: true,
        availabilityFlag: false,
        dynamicTags: ['标签一', '标签二', '标签三'],
        brandTypeDictionary: [{
          name: '16:9',
          code: 1
        }, {
          name: '9:16（一条）',
          code: 2
        }, {
          name: '9:16（三条）',
          code: 3
        }],
        queryModel: {
          sort: 'desc',
          brandName:''
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
          size: 20,
        },
        importanceOptions: [1, 2, 3],

        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        brandFormData: {
          "brandName": '',
          "type": '',
          "icon": '',
          "status": '',
          "startDate": '',
          "endDate": '',
          "keyNumPerUser": '',
          "keyTotal": '',
          "keyReceived": '',
          "keyEnable": '',
          keyType:'',
          "id": '',
          "floorID": '',
          createTime:''
        },
        advertisementFormDataList: [],
        advertisementFormData: {
          id: '',
          url: '',
          "location": "",
          "iosEnable": false,
          "androidEnable": false,
          "status": 0,
          orderNum: null
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        rules: {
          brandName: [{required: true, message: '此项为必填项', trigger: 'change'}],
          type: [{required: true, message: '此项为必填项', trigger: 'change'}],
          icon: [{required: true, message: '此项为必填项', trigger: 'change'}],
          startDate: [{required: true, message: '此项为必填项', trigger: 'change'}],
          endDate: [{required: true, message: '此项为必填项', trigger: 'change'}],
          status: [{required: true, message: '此项为必填项', trigger: 'change'}],


          url: [{required: true, message: '此项为必填项', trigger: 'change'}],
          location: [{required: true, message: '此项为必填项', trigger: 'change'}],
          iosEnable: [{required: true, message: '此项为必填项', trigger: 'change'}],
          androidEnable: [{required: true, message: '此项为必填项', trigger: 'change'}],
          orderNum: [{required: true, message: '此项为必填项', trigger: 'change'}],
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
        this.brandFormData.startDate = this.$moment(value[0]).format('YYYY-MM-DD');
        this.brandFormData.endDate = this.$moment(value[1]).format('YYYY-MM-DD');
      },
      currentAdvertisementTabIndex(value) {
        console.log(value)
      },
      currentSortData(value) {
        console.log(value)
        value.forEach((item1, index1) => {
          this.advertisementFormDataList.forEach((item2, index2) => {
            if (item1.id === item2.id) {
              this.advertisementFormDataList[index2].orderNum = index1;
            }
          })
        });
        console.log(this.advertisementFormDataList)
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.brandListRequest, {
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
        this.pagination.size = val;
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.pagination.page = val;
        this.getTableData()
      },
      resetTemp() {
        this.brandFormData = {
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
          createTime: ''
        };
        this.advertisementFormData = {
          id: '',
          url: '',
          "location": "",
          "iosEnable": false,
          "androidEnable": false,
          "status": 0,
          orderNum: null
        };
        this.fileList = []
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        if (this.$refs.brandFormData !== undefined) {
          this.$refs.brandFormData.resetFields();
          this.$nextTick(() => {
            this.$refs['brandFormData'].clearValidate()
          })
        }
      },
      createData() {
        this.brandFormData.id = 0;
        this.updateData();
      },
      createAdvertisementData() {
        this.brandFormData.id = 0;
        this.updateAdvertisementData();
      },
      handleUpdate(scope) {
        console.log(scope)
        this.brandFormData = Object.assign({}, scope.row);
        this.effectiveDuration = [];
        this.effectiveDuration = [this.$moment(scope.row.startDate).format('YYYY-MM-DD'), this.$moment(scope.row.endDate).format('YYYY-MM-DD')];

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['brandFormData'].clearValidate()
        })
      },
      handleUpdateAdvertisement(scope) {
        let rawData = scope.row.advertisements;
        this.brandFormData.id = scope.row.id;

        this.refreshData(rawData);

        this.dialogStatus = 'update';
        this.advertisementDialogFlag = true;

        // this.$nextTick(() => {
        //   this.$refs['advertisementFormData'].clearValidate()-
        // })
      },
      refreshData(rawData) {
        console.log(rawData)
        let sortListResult = [];
        this.advertisementFormDataList = [];
        if (rawData.length > 0) {
          rawData.forEach((item, index) => {
            this.$set(this.advertisementFormDataList, index, item)
          });
          console.log(this.advertisementFormDataList)
          // debugger
          this.advertisementFormData = this.advertisementFormDataList[0];
        }
        console.log(111, this.advertisementFormDataList)
        this.currentAdvertisementTabIndex = 0;

        for (let i = 0; i < rawData.length; i++) {
          console.log(444, rawData[i])

          if (typeof rawData[i].orderNum === 'number' && rawData[i].orderNum < this.advertisementFormDataList.length) {
            sortListResult[rawData[i].orderNum] = rawData[i];
            // debugger
          } else {
            // alert('dsds')
            let flag = true;
            for (let j = 0; j < 3; j++) {
              if (typeof sortListResult[j] !== 'object' && flag === true) {
                sortListResult[j] = rawData[i];
                flag = false;
              }
            }
          }
        }
        console.log(444, sortListResult)


        for (let i = 0; i < sortListResult.length; i++) {
          console.log(222, sortListResult.length)
          if (typeof sortListResult[i] === 'undefined') {
            sortListResult[i] = rawData[0];
          }
          sortListResult[i].isCurrent = false;
          sortListResult[i].orderNum = i;
        }
        console.log(333, sortListResult)

        this.currentSortData = sortListResult;
      },
      switchAdvertisementData(index) {
        console.log(index)
        console.log(this.currentAdvertisementTabIndex)
        if (index !== '') {
          this.advertisementFormDataList[this.currentAdvertisementTabIndex] = this.advertisementFormData;
          this.advertisementFormData = this.advertisementFormDataList[index];
          this.currentAdvertisementTabIndex = index;
        }

        console.log(this.advertisementFormDataList)
        console.log(this.advertisementFormData)
      },
      editAdvertisementCount(data, index) {

      },
      updateData() {
        this.$refs['brandFormData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.brandAddOrUpdateRequest, {
              "brandName": this.brandFormData.brandName,
              "type": this.brandFormData.type,
              "icon": this.brandFormData.icon,
              "status": this.brandFormData.status,
              "startDate": this.brandFormData.startDate,
              "endDate": this.brandFormData.endDate,
              "keyNumPerUser": this.brandFormData.keyNumPerUser,
              "keyTotal": this.brandFormData.keyTotal,
              "keyReceived": this.brandFormData.keyReceived,
              "keyType": this.brandFormData.keyType,
              "keyEnable": this.brandFormData.keyEnable,
              "id": this.brandFormData.id,
              "floorID": this.brandFormData.floorID,
              createTime:this.brandFormData.createTime
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
      updateAdvertisementData() {
        console.log(this.$refs.advertisementFormData)
        let validFlag = true;
        this.$refs['advertisementFormData'].forEach((item, index) => {
          this.$refs['advertisementFormData'][index].validate(valid => {
            if (!valid) {
              this.$message.warning('其他广告位表单输入不正确')
              validFlag = false;
            }
          })
        });

        if (validFlag) {
          this.advertisementFormDataList[this.currentAdvertisementTabIndex] = this.advertisementFormData;

          this.$http.post(this.$baseUrl + this.brandAdvertisementAddOrUpdateRequest + `/${this.brandFormData.id}`, this.advertisementFormDataList).then((response) => {
            console.log(response)
            this.advertisementDialogFlag = false;

            switch (response.code) {
              case 10000:
                this.$message.success('信息修改成功');
                this.getTableData();
                // this.refreshData();
                break;
              case 30002:
                this.$message.error(response.message);
                break;
              case 30003:
                this.$message.success('信息修改成功');
                setTimeout(() => {
                  this.$message.warning(response.message);
                }, 1000);
                break;
              default:
                this.$message.success(response.message);
                this.getTableData();
              // this.refreshData();
            }
          }).catch(error => {
            console.log(error)
            this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
          })
        }

      },
      handleDragEnd(event) {
        console.log(event)
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
      changeUpload(file) {
        console.log(file)
      },
      handlePreview(file) {
        console.log(file);
        this.fileList.push(file);
      },
      uploadSuccess1(response) {
        console.log(response)
        this.brandFormData.icon = response.url;
      },
      uploadSuccess2(response) {
        this.advertisementFormDataList[this.currentAdvertisementTabIndex].url = response.url;
        this.advertisementFormData.url = response.url;
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
      deleteAdvertise(data, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.advertisementFormDataList.splice(index, 1);
          this.refreshData(this.advertisementFormDataList);

          this.currentAdvertisementTabIndex = 0;
        });
      },
      addAdvertise() {
        this.advertisementFormDataList.push({
          url: '',
          "location": "",
          "iosEnable": false,
          "androidEnable": false,
          "status": 0,
          orderNum: null
        });
        this.refreshData(this.advertisementFormDataList);
      }

    }
  }
</script>
<style lang="scss">
  @import '../../styles/edifice.scss';

</style>
