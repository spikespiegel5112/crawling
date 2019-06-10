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
      <el-table-column label="公司名称" align="center" prop="companyName"></el-table-column>
      <el-table-column label="产品Code" align="center" prop="productId"></el-table-column>
      <el-table-column label="产品名称" align="center" prop="name"></el-table-column>
      <el-table-column label="Icon" align="center" width="150">
        <template slot-scope="scope">
          <img :style="{height:'80px'}" :src="$checkOSS(scope.row.icon)" width="80">
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.image+'-style_100x100'" width="80">
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" prop="desc"></el-table-column>
      <el-table-column align="center" label="原价" prop="originalPrice"></el-table-column>
      <el-table-column align="center" label="现价" prop='price'></el-table-column>
      <el-table-column align="center" label="奖励类型" prop='rewardType'>
        <template slot-scope="scope">
          {{scope.row.rewardType!==null?rewardTypeDictionary.filter(item=>item.code===scope.row.rewardType)[0].name:''}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否可用" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
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
          <el-form :rules="rules" ref="formData" :model="formData"
                   label-position="right"
                   label-width="140px">

            <el-form-item label="产品名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="产品Code" prop="productId">
              <el-input v-model="formData.productId"></el-input>
            </el-form-item>

            <el-form-item label="Icon" prop="icon">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess1"
                :returnUrlList.sync="formData.icon"
                fileType="image"
              />
              <el-input v-show="false" v-model="formData.icon"></el-input>
            </el-form-item>
            <el-form-item label="image" prop="image">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess2"
                :returnUrlList.sync="formData.image"
                fileType="image"
              />
              <el-input v-show="false" v-model="formData.image"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="formData.price"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="originalPrice">
              <el-input v-model.number="formData.originalPrice"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input type="textarea" v-model="formData.desc"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="formData.companyName"></el-input>
            </el-form-item>
            <el-form-item label="产品链接" prop="url">
              <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="可用性" prop="status">
              <el-switch v-model="formData.status"
                         :active-value="1"
                         :inactive-value="0"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
              >
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
        queryRewardProductAllRequest: 'promotion-service/1.0.0/queryRewardProductAll',
        addAndUpdateRewardProductRequest: 'promotion-service/1.0.0/addAndUpdateRewardProduct',
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
        rewardTypeDictionary: [{
          name: '积分',
          code: 'point'
        }, {
          name: '趣豆',
          code: 'coin'
        }, {
          name: '百视通会员',
          code: 'bes_tv'
        }, {
          name: '第三方链接',
          code: 'third_link'
        }],
        queryModel: {
          sort: 'desc',
          brandName: ''
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
        formData: {
          id: '',
          companyName: '',
          name: '',
          "desc": '',
          "icon": '',
          "image": '',
          "originalPrice": '',
          "url": '',
          "status": 0,
          price: '',
          productId: '',
          rewardType: 'third_link',
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        rules: {
          id: [{required: true, message: '此项为必填项', trigger: 'change'}],
          companyName: [{required: true, message: '此项为必填项', trigger: 'change'}],
          name: [{required: true, message: '此项为必填项', trigger: 'change'}],
          price: [{required: true, message: '此项为必填项', trigger: 'change'},
            {type: 'number', message: '必须为数字值', trigger: "change"}],
          originalPrice: [{required: true, message: '此项为必填项', trigger: 'change'},
            {type: 'number', message: '必须为数字值', trigger: "change"}],
          productId: [{required: true, message: '此项为必填项', trigger: 'change'}],
          rewardType: [{required: true, message: '此项为必填项', trigger: 'change'}],
          desc: [{required: true, message: '此项为必填项', trigger: 'change'}],
          image: [{required: true, message: '此项为必填项', trigger: 'change'}],
          icon: [{required: true, message: '此项为必填项', trigger: 'change'}],
          status: [{required: true, message: '此项为必填项', trigger: 'change'}],
          url: [{required: true, message: '此项为必填项', trigger: 'change'}],
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
        this.formData.startDate = this.$moment(value[0]).format('YYYY-MM-DD');
        this.formData.endDate = this.$moment(value[1]).format('YYYY-MM-DD');
      },
      currentAdvertisementTabIndex(value) {
        console.log(value)
      },
      currentSortData(value) {
        console.log(value)
        value.forEach((item1, index1) => {
          this.tableList.forEach((item2, index2) => {
            if (item1.id === item2.id) {
              this.tableList[index2].orderNum = index1;
            }
          })
        });
        console.log(this.tableList)
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.queryRewardProductAllRequest + `/${this.pagination.page}`).then(response => {
          console.log(response)

          this.tableList = response.data;
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
        this.formData = {
          id: '',
          companyName: '',
          name: '',
          "desc": '',
          "icon": '',
          "image": '',
          "originalPrice": '',
          "url": '',
          "status": 0,
          price: '',
          productId: '',
          rewardType: 'third_link',
        };

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
        this.formData.id = '';
        this.updateData();
      },
      handleUpdate(scope) {
        console.log(scope)
        this.formData = Object.assign({}, scope.row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        let params = this.formData;
        if (this.dialogStatus === 'create') {
          delete params.id;
        }

        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.addAndUpdateRewardProductRequest, params).then((response) => {
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
          // this.$http.delete(this.$baseUrl + this.brandDeleteRequest + `/${scope.row.id}`).then((response) => {
          //   console.log(response)
          //   this.dialogFormVisible = false;
          //   this.$message.success('删除成功');
          //   this.getTableData();
          // }).catch(error => {
          //   console.log(error)
          //   this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
          // })
        }).catch(() => {
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
        this.queryModel.available = true;
      },
      deleteAdvertise(data, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        });
      },

      uploadSuccess1(response) {
        console.log(response)
        this.formData.icon = response.url;
      },
      uploadSuccess2(response) {
        this.formData.image = response.url;
      },
    }
  }
</script>
<style lang="scss">
  @import '../../styles/edifice.scss';

</style>
