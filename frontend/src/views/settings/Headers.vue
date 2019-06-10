<template>
  <el-row class="app-container">
    <CommonQuery>
      <template slot="button1">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>
          一键抓取
        </el-button>

        <el-button size="mini" type="primary" icon="el-icon-setting" @click="crawlerSettingFlag=true" v-waves>
          参数设置
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleMultipleDelete" v-waves>
          批量删除
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
              @selection-change="handleSelectionChange"
              :height="tableHeight">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="No" type="index" width="45" align="center" fixed></el-table-column>
      <el-table-column align="center" label="header ID" prop='movieName' width="200"></el-table-column>
      <el-table-column align="center" label="行程" prop='releaseInfo'></el-table-column>
      <el-table-column align="center" label="上座率" prop='seatRate'></el-table-column>
      <el-table-column align="center" label="排片场次" prop='showInfo'></el-table-column>
      <el-table-column align="center" label="排片占比" prop='showRate'></el-table-column>
      <el-table-column align="center" label="场均人次" prop='avgShowView'></el-table-column>

      <el-table-column align="center" label="操作" width="100px">
        <template slot-scope="scope">
          <!--          <el-button type="primary" size="mini" @click="handleUpdate(scope)">编辑</el-button>-->
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common-pagination-wrapper">
      <el-pagination background @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="pagination.page"
                     :page-sizes="[10,20,30,50,100]"
                     :page-size="pagination.limit"
                     :total="total"
                     layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData"
                   label-position="right"
                   label-width="140px">
            <el-form-item label="奖品类型" prop="rewardType">
              <el-select v-model="formData.rewardType" placeholder='' @change="chooseRewardType">
                <el-option v-for="item in $store.state.app.rewardTypeDictionary"
                           :key="item.code" :label="item.name"
                           :value="item.code"></el-option>
              </el-select>
              <el-button v-if="formData.rewardType==='third_link'" type="primary" @click="crawlerSettingFlag=true">
                选择第三方产品
              </el-button>
            </el-form-item>
            <el-form-item label="奖品名称" prop="rewardName">
              <el-input :disabled="formData.rewardType==='third_link'" v-model="formData.rewardName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input :disabled="formData.rewardType==='third_link'" type="textarea"
                        v-model="formData.description"></el-input>
            </el-form-item>
            <el-form-item label="奖品图片" prop="rewardImage">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess2"
                :returnUrlList.sync="formData.rewardImage"
                :disabled="formData.rewardType==='third_link'"
                fileType="image"
              />
              <el-input v-show="false" v-model="formData.rewardImage"></el-input>
            </el-form-item>
            <el-form-item label="奖品文案" prop="rewardPrompt">
              <el-input type="textarea" v-model="formData.rewardPrompt"></el-input>
            </el-form-item>
            <el-form-item label="奖品Code" prop="rewardStr">
              <el-input :disabled="formData.rewardType==='third_link'" v-model="formData.rewardStr"></el-input>
            </el-form-item>

            <el-form-item label="可用性" prop="status">
              <el-switch v-model="formData.status"
                         :active-value="1"
                         :inactive-value="0"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         :disabled="formData.rewardType==='third_link'"
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
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="crawlerSettingFlag" width="600px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form ref="chooseRewardTypeModel" :model="chooseRewardTypeModel" label-position="right"
                   label-width="80px">
            <el-form-item label="抓取地址" prop="name">
              <el-input type="textarea" v-model="crawlerSetting.address"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="crawlerSettingFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="confirmCrawlerSetting" v-waves>{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

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
        getListByPaginationRequest: 'crawler/getListByPagination',
        crawlAndSaveRequest: 'crawler/crawlAndSave',
        deleteRecordRequest: 'crawler/deleteRecords',
        crawlerSettingFlag: false,
        crawlerSetting: {
          address: ''
        },
        chosenReward: '',
        chooseRewardTypeModel: {},
        chosenThirdPartyProductInfo: {},

        value2: '',
        value1: '',
        dailyLimitMode: '',
        limitMode: '',
        tableKey: 0,
        tableList: [],
        total: null,
        listLoading: true,
        availabilityFlag: false,

        statusDictionary: [{
          code: 0,
          name: '未上线'
        }, {
          code: 1,
          name: '上线'
        }],
        queryModel: {
          sort: 'desc',
          brandName: ''
        },
        pagination: {
          page: 1,
          limit: 50
        },
        importanceOptions: [1, 2, 3],

        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        formData: {
          movieId: '',
          movieName: '',
          timestamp: '',
          boxInfo: '',
          boxRate: '',
          releaseInfo: '',
          seatRate: '',
          showInfo: '',
          showRate: '',
          splitAvgViewBox: '',
          splitBoxInfo: '',
          splitBoxRate: '',
          splitSumBoxInfo: '',
          sumBoxInfo: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        rules: {
          id: [{ required: true, message: '此项为必填项', trigger: 'change' }],
          description: [{ required: true, message: '此项为必填项', trigger: 'change' }],
          name: [{ required: true, message: '此项为必填项', trigger: 'change' }],
          dailyLimit: [{ required: true, message: '此项为必填项', trigger: 'change' }],
          limit: [{ required: true, message: '此项为必填项', trigger: 'change' }],
          startDate: [{ required: true, message: '此项为必填项', trigger: 'change' }],
          endDate: [{ required: true, message: '此项为必填项', trigger: 'change' }],
          status: [{ required: true, message: '此项为必填项', trigger: 'change' }]
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
        effectiveDuration: [],
        multipleSelection: []

      }
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
          value = []
        }
        this.formData.startDate = this.$moment(value[0]).format('YYYY-MM-DD')
        this.formData.endDate = this.$moment(value[1]).format('YYYY-MM-DD')
      },
      currentAdvertisementTabIndex(value) {
        console.log(value)
      }
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true
        this.queryModel = Object.assign(this.queryModel, this.pagination)
        this.$http.get(this.$baseUrl + this.getListByPaginationRequest, {
          params: this.queryModel
        }).then(response => {
          console.log('getListByPaginationRequest', response)

          this.tableList = response.data
          this.total = response.pagination.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.pagination.page = 1
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
      resetTemp() {
        this.formData = {
          id: '',
          description: '',
          rewardImage: '',
          rewardName: '',
          rewardPrompt: '',
          rewardStr: '',
          rewardType: '',
          rewardValue: '',
          status: ''
        }

      },
      handleCreate() {
        const that = this
        const h = this.$createElement
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '抓取地址为 '),
            h('i', { style: 'color: teal' }, that.crawlerSetting.address)
          ]),
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.$baseUrl + this.crawlAndSaveRequest, this.crawlerSetting).then(response => {
            console.log(response)
            this.$message.success('抓取成功')

            this.getTableData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      createData() {
        this.formData.id = ''
        this.updateData()
      },
      handleUpdate(scope) {
        console.log(scope)
        this.formData = Object.assign({}, scope.row)

        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.addAndUpdateRewardInfoRequest, {
              id: this.formData.id,
              description: this.formData.description,
              rewardImage: this.formData.rewardImage,
              rewardName: this.formData.rewardName,
              rewardPrompt: this.formData.rewardPrompt,
              rewardStr: this.formData.rewardStr,
              rewardType: this.formData.rewardType,
              rewardValue: this.formData.rewardValue,
              status: this.formData.status
            }).then((response) => {
              console.log(response)
              this.dialogFormVisible = false
              this.$message.success('信息修改成功')
              this.getTableData()
            }).catch(error => {
              console.log(error)
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      handleMultipleDelete() {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRecord(this.multipleSelection.map(item => {
            return item.id
          }))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleDelete(scope) {
        console.log(scope)
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.deleteRecord([scope.row.id])
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      deleteRecord(data) {
        this.$http.delete(this.$baseUrl + this.deleteRecordRequest, {
          data: {
            id: data
          }
        }).then((response) => {
          console.log(response)
          this.dialogFormVisible = false
          this.$message.success('删除成功')
          this.getTableData()
        }).catch(error => {
          console.log(error)
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },

      expand() {
        this.expandQuery = !this.expandQuery
      },
      search() {
        this.getTableData()
      },
      reset() {
        this.queryModel.available = true
      },

      uploadSuccess1(response) {
        console.log(response)
        this.formData.icon = response.url
      },
      uploadSuccess2(response) {
        this.formData.rewardImage = response.url
      },
      changeDailyLimitMode(data) {
        this.formData.dailyLimit = data.toString() === 'unlimited' ? '-1' : this.formData.dailyLimit

      },
      changeLimitMode(data) {
        this.formData.limit = data.toString() === 'unlimited' ? '-1' : this.formData.limit
        alert(this.formData.limit)
      },
      chooseRewardType(data) {
        console.log(data)
      },
      chooseThirdPartyProduct(data) {
        this.chosenThirdPartyProductInfo = data
      },
      confirmCrawlerSetting() {
        this.crawlerSettingFlag = false
        this.$message.success('设置成功')

      },

      focusSortList(queryString, callback) {
        this.loading = true

        // this.queryModel = Object.assign(this.queryModel, {
        //   limit: 999,
        //   page: 1,
        //   status: 1,
        //   title: '',
        //   description: '',
        //   gameTypeId: '',
        // });
        // console.log(this.queryModel)

        this.$http.get(this.$baseUrl + this.queryRewardProductByNameRequest, {
          params: {
            name: this.chosenReward
          }
        }).then(response => {
          console.log(response)
          this.loading = false
          // this.total = response.total;
          let result = []
          if (response.data.length !== 0) {
            response.data.forEach((item, index) => {
              result.push(Object.assign(item, {
                value: item.name
              }))
            })

            console.log(111, result)

            callback(result)

          }

        })
      }

    }
  }
</script>
<style lang="scss">
  @import '../../styles/edifice.scss';

</style>
