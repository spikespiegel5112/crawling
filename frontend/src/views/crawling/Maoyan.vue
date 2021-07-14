<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button @click="oneKeyCrawlFlag=true" icon="el-icon-plus" size="mini" type="primary" v-waves>
          一键抓取
        </el-button>
        <el-button @click="handleMultipleDelete" icon="el-icon-delete" size="mini" type="danger" v-waves>
          批量删除
        </el-button>
      </template>
      <template slot="query1">
        <div @keyup.enter="search" class="common_search_wrapper">
          <label>
            <input placeholder="请输入游戏名称" type="text" v-model="queryModel.brandName"/>
          </label>
          <a>
            <span @click="search" class="el-icon-search"></span>
          </a>
        </div>
      </template>
    </CommonQuery>

    <el-table :data="tableList" :height="tableHeight" @row-click="handleClickRow"
              @selection-change="handleSelectionChange"
              border
              element-loading-text="Loading"
              fit
              highlight-current-row
              v-loading.body="listLoading"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column align="center" fixed label="No" type="index" width="45"></el-table-column>
      <el-table-column align="center" label="电影名称" prop='movieName' width="200"></el-table-column>
      <el-table-column align="center" label="抓取时间" prop='timestamp' width="100">
        <template slot-scope="scope">
          {{$moment(Number(scope.row.timestamp)).format('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="综合票房（万）" prop='boxInfo'></el-table-column>
      <el-table-column align="center" label="票房占比" prop='boxRate'></el-table-column>
      <el-table-column align="center" label="总票房" prop='sumBoxInfo'></el-table-column>
      <el-table-column align="center" label="分账综合票房（万）" prop='splitBoxInfo'></el-table-column>
      <el-table-column align="center" label="分账票房占比" prop='splitBoxRate'></el-table-column>
      <el-table-column align="center" label="分账总票房" prop='splitSumBoxInfo'></el-table-column>
      <el-table-column align="center" label="上映情况" prop='releaseInfo'></el-table-column>
      <el-table-column align="center" label="上座率" prop='seatRate'></el-table-column>
      <el-table-column align="center" label="排片场次" prop='showInfo'></el-table-column>
      <el-table-column align="center" label="排片占比" prop='showRate'></el-table-column>
      <el-table-column align="center" label="场均人次" prop='avgShowView'></el-table-column>

      <el-table-column align="center" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common_pagination_wrapper">
      <el-pagination :current-page.sync="pagination.page" :page-size="pagination.limit"
                     :page-sizes="[10,20,30,50,100]"
                     :total="total"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     background
                     layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="oneKeyCrawlFlag" width="850px">
      <el-row justify="center" type="flex">
        <el-col :span="20">
          <el-form :model="formData" :rules="rules" label-position="right"
                   label-width="140px"
                   ref="formData">
            <el-form-item label="爬虫类型" prop="rewardType">
              <el-select @change="chooseRewardType" placeholder='' v-model="formData.rewardType">
                <el-option :key="item.code"
                           :label="item.name" :value="item.value"
                           v-for="item in settingsList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="爬虫地址" prop="crawlerAddress">
              <el-input v-model="formData.crawlerAddress"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="oneKeyCrawlFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button @click="crawlerData" type="primary" v-waves>{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>
  import CommonQuery from '@/views/common/CommonQuery.vue'

  export default {
    components: {
      CommonQuery
    },
    data() {
      return {
        getListByPaginationRequest: 'crawlerMaoyanBoxOffice/getListByPagination',
        crawlAndSaveRequest: 'crawlerMaoyanBoxOffice/crawlAndSave',
        deleteRecordRequest: 'crawlerMaoyanBoxOffice/deleteRecords',
        getSettingsRequest: 'settings/getList',
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
          headerCode: 'maoyan',
          crawlerAddress: ''
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
        multipleSelection: [],
        oneKeyCrawlFlag: false,
        settingsList: []
      }
    },
    computed: {
      tableHeight() {
        return this.$store.state.app.tableHeight
      },
      dictionaryList() {
        return this.$store.state.app.dictionary.crawlerAddress
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
    async mounted() {
      this.settingsList = await this.getSettingsDictionary()
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

          let data = response.data.map((item, index) => {
            return Object.assign(item, {
              _index: index
            })
          })
          this.tableList = data
          this.total = response.pagination.total
          this.listLoading = false
        })
      },
      getSettingsDictionary() {
        return new Promise((resolve, reject) => {
          this.$http.get(this.$baseUrl + this.getSettingsRequest, {
            params: {
              type: 'crawlerAddress'
            }
          }).then(response => {
            resolve(response.data)
          }).catch(error => {
            console.log(error)
            reject(error)
          })
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
      crawlerData() {
        this.$http.post(this.$baseUrl + this.crawlAndSaveRequest, {
          address: this.formData.crawlerAddress,
          headerCode: this.formData.headerCode
        }).then(response => {
          console.log(response)
          this.$message.success('抓取成功')

          this.getTableData()
          this.oneKeyCrawlFlag = false

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
        this.formData.type = this.settingsList.filter(item => item.value === data)[0].code
        this.formData.crawlerAddress = data
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
      },
      handleClickRow(row, column, e) {
        console.log('row', row)
        console.log('column', column)
        console.log('e', e)
      }

    }
  }
</script>
<style lang="scss">
  @import '../../styles/edifice.scss';

</style>
