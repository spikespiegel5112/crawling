<template>
  <el-row class="app-container">
    <CommonQuery>
      <template slot="button1">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="stepCrawlFlag=true" v-waves>
          分步抓取
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleMultipleDelete" v-waves>
          批量删除
        </el-button>
      </template>
      <template slot="query1">
        <div class="common-search-wrapper" @keyup.enter="search">
          <label>
            <input v-model="queryModel.brandName" type="text" placeholder="请输入游戏名称"/>
          </label>
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
      <el-table-column type="selection" width="30" fixed="left"></el-table-column>
      <el-table-column label="No" type="index" width="45" align="center" fixed></el-table-column>
      <el-table-column align="center" label="电影名称（中文）" prop='titleChi' width="100"></el-table-column>
      <el-table-column align="center" label="电影名称（原文）" prop='title' width="100"></el-table-column>
      <el-table-column align="center" label="抓取时间" prop='timestamp' width="100">
        <template slot-scope="scope">
          {{$moment(Number(scope.row.timestamp)).format('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上映时间" prop='releaseDate'></el-table-column>
      <el-table-column align="center" label="平台名称（英文）" prop='platformEngName'></el-table-column>
      <el-table-column align="center" label="平台名称（中文）" prop='platformChineseName'></el-table-column>
      <el-table-column align="center" label="平台类型" prop='platformType'></el-table-column>
      <el-table-column align="center" label="想看数量" prop='numWantToSee'></el-table-column>
      <el-table-column align="center" label="想看男性受众占比" prop='wantToSeeByGenderMale'>
        <!--        <template slot-scope="scope">-->
        <!--          {{JSON.parse(scope.row.byGenderMale.match(/[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/))+'%'}}-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column align="center" label="想看女性受众占比" prop='wantToSeeByGenderFemale'>
        <!--        <template slot-scope="scope">-->
        <!--          {{scope.row.byGenderFemale.match(/[[1-9]\d*\.\d*|0\.\d*[1-9]\d*]$/g)}}-->
        <!--          {{String(scope.row.byGenderFemale.match(/[[1-9]\d*\.\d*|0\.\d*[1-9]\d*]$/g)).split(',')[1]}}-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column align="center" label="想看20岁以下占比" prop='wantToSeeByAge20'></el-table-column>
      <el-table-column align="center" label="想看20到24岁占比" prop='wantToSeeByAge20To24'></el-table-column>
      <el-table-column align="center" label="想看25到29岁占比" prop='wantToSeeByAge25To29'></el-table-column>
      <el-table-column align="center" label="想看30到34岁占比" prop='wantToSeeByAge30To34'></el-table-column>
      <el-table-column align="center" label="想看35到39岁占比" prop='wantToSeeByAge35To39'></el-table-column>
      <el-table-column align="center" label="想看40岁以上占比" prop='wantToSeeByAge40'></el-table-column>
      <el-table-column align="center" label="想看一线城市占比" prop='wantToSeeByTier1'></el-table-column>
      <el-table-column align="center" label="想看二线城市占比" prop='wantToSeeByTier2'></el-table-column>
      <el-table-column align="center" label="想看三线城市占比" prop='wantToSeeByTier3'></el-table-column>
      <el-table-column align="center" label="想看四线城市占比" prop='wantToSeeByTier4'></el-table-column>

      <el-table-column align="center" label="预售票房" prop='premiereBoxInfo'></el-table-column>
      <el-table-column align="center" label="预售排片占比" prop='premiereShowRate'></el-table-column>
      <el-table-column align="center" label="预售排片场次" prop='premiereShowRate'></el-table-column>


      <el-table-column align="center" label="操作" width="70" fixed="right">
        <template slot-scope="scope">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="oneKeyCrawlFlag" width="850px">

      <el-row type="flex" justify="center">
        <el-col :span="20">

          <el-form :rules="rules" ref="formData" :model="formData"
                   label-position="right"
                   label-width="140px">
            <el-form-item label="爬虫类型" prop="rewardType">
              <el-select v-model="formData.rewardType" placeholder='' @change="chooseRewardType">
                <el-option v-for="item in settingsList"
                           :key="item.code" :label="item.name"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="爬虫地址" prop="crawlerAddress">
              <el-input v-model="formData.crawlerAddress"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="oneKeyCrawlFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button type="primary" v-waves @click="crawlerData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="stepCrawlFlag" width="1600px" top="1vh">
      <el-row :gutter="1">
        <el-col :span="4">
          <el-button type="primary" @click="prepareToCrawlFlag=true">
            {{preSaleListData.length===0?'获取索引':'重新获取索引'}}
          </el-button>
          <el-button v-if="!crawlingFlag" :disabled="preSaleListData.length===0" type="primary"
                     @click="beginToCrawPreSaleListMovieData">
            {{crawlingCount===0?'开始抓取':'重新抓取'}}
          </el-button>
          <el-button v-else type="danger" @click="stopCrawling">停止抓取</el-button>
        </el-col>

        <el-col :span="20" style="text-align: right">
          <el-button type="primary" @click="save">保存</el-button>
        </el-col>

      </el-row>
      <el-divider></el-divider>
      <el-row>

        <el-col :span="24">
          <el-row type="flex" justify="left">

            <el-col :span="5">
              <!--          {{preSaleListCountLimit}}-->
              <el-input-number v-model="preSaleListCountLimit" :min="0"></el-input-number>
              <el-button type="primary" @click="handleChangeCounter">确定</el-button>

            </el-col>
            <el-col :span="19">
              <el-progress :text-inside="true" :stroke-width="20"
                           :percentage="preSaleListData.length!==0?Math.floor(crawlingCount/preSaleListData.filter(item=>item.active).length*100):0"
                           status="success"></el-progress>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="24">
              <el-card shadow="never">

                <el-divider>
                  <el-row>
                    <el-col v-if="preSaleListData.length>0&&crawlingCount<preSaleListData.length" :span="24">
                      共有{{preSaleListData.length}}条数据，正在抓取第{{crawlingCount}}条...
                    </el-col>
                    <el-col v-else :span="24">
                      共有{{preSaleListData.length}}条数据，抓取完毕
                    </el-col>
                  </el-row>
                </el-divider>
                <el-row type="flex" justify="left">
                  <el-col :span="24">
                    <!--          {{preSaleListData}}-->
                    <el-timeline :style="clawerStyle">
                      <el-timeline-item v-for="(item, index) in preSaleListData.filter(item=>item.active)"
                                        :key="index"
                                        :timestamp="item.recordTime"
                                        placement="top"
                                        :color="item.color==='success'?'#91d929':'#e4e7ed'"
                                        class="timelineitem"
                      >
                        <el-card shadow="hover">
                          <el-row>
                            <el-col :span="1" style="text-align: left">第{{index+1}}条</el-col>
                            <!--                            <el-col :span="1" style="text-align: left">{{item.movieId}}</el-col>-->
                            <el-col :span="4" style="text-align: left">{{item.title}}</el-col>
                            <el-col :span="2">
                              详情: <i v-if="item.detailSuccess===0" class=""></i>
                              <i v-else-if="item.detailSuccess===1" class="el-icon-check success"></i>
                              <i v-else="item.detailSuccess===2" class="el-icon-close failed"></i>
                            </el-col>
                            <el-col :span="2">
                              想看画像: <i v-if="item.portraitSuccess===0" class=""></i>
                              <i v-else-if="item.portraitSuccess===1" class="el-icon-check success"></i>
                              <i v-else="item.portraitSuccess===2" class="el-icon-close failed"></i>
                            </el-col>

                            <el-col :span="2">
                              预售票房: <i v-if="item.premiereSuccess===0" class=""></i>
                              <i v-else-if="item.premiereSuccess===1"
                                 class="el-icon-check success"></i>
                              <i v-else="item.premiereSuccess===2" class="el-icon-close failed"></i>
                            </el-col>


                          </el-row>
                        </el-card>

                      </el-timeline-item>
                    </el-timeline>
                  </el-col>
                </el-row>

              </el-card>
            </el-col>
          </el-row>
        </el-col>

      </el-row>


      <el-row type="flex" justify="space-between">
        <el-col :span="21">
        </el-col>
        <el-col :span="3" style="text-align: right">
          <el-button type="primary" @click="stepCrawlFlag=false">关闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="准备爬取" :visible.sync="prepareToCrawlFlag" width="600px">
      <el-radio-group v-model="crawlerCountType" @change="handleChangeLimitType">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">部分</el-radio>
        <el-input-number v-model="preSaleListCountLimit" :disabled="crawlerCountType===0"
                         @change="handleChangeCountLimit"
                         :min="0"></el-input-number>

      </el-radio-group>

      <el-button type="primary" @click="getAllCrawlingIndex">开始抓取列表</el-button>
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
        getListByPaginationRequest: 'crawlerMaoyanPreSale/getListByPagination',
        crawlAndSaveRequest: 'crawlerMaoyanPreSale/crawlAndSave',
        crawlMoviePreSaleDetailRequest: 'crawlerMaoyanPreSale/crawlMoviePreSaleDetail',
        crawlPreSaleWantToSeePortraitRequest: 'crawlerMaoyanPreSale/crawlPreSaleWantToSeePortrait',
        crawlPreSaleBoxOfficePremiereRequest: 'crawlerMaoyanPreSale/crawlPreSaleBoxOfficePremiere',
        deleteRecordRequest: 'crawlerMaoyanPreSale/deleteRecords',
        getSettingsRequest: 'settings/getList',

        crawlMovieListRequest: 'crawlerMaoyanPreSale/crawlMovieList',
        saveMultipleMaoyanPreSaleRequest: 'crawlerMaoyanPreSale/saveMultipleMaoyanPreSale',
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
          limit: 100
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
        crawlerCountType: 0,
        advertisementDialogFlag: false,
        currentAdvertisementTabIndex: 0,
        effectiveDuration: [],
        multipleSelection: [],
        oneKeyCrawlFlag: false,
        stepCrawlFlag: false,
        prepareToCrawlFlag: false,
        settingsList: [],
        preSaleData: [],
        crawlingCount: 0,
        preSaleListData: [],
        crawlingFlag: false,
        preSaleListCountLimit: 0
      }
    },
    computed: {
      tableHeight() {
        return this.$store.state.app.tableHeight
      },
      dictionaryList() {
        return this.$store.state.app.dictionary.crawlerAddress
      },
      clawerStyle() {
        return {
          height: (this.tableHeight - 180) + 'px',
          overflow: 'auto'
        }
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
      // this.settingsList = await this.getSettingsDictionary()
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
          status: '.....'
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
      async getAllCrawlingIndex() {
        this.prepareToCrawlFlag = false
        this.$http.get(this.$baseUrl + this.crawlMovieListRequest, {
          params: {
            address: 'https://piaofang.maoyan.com/store',
            headerCode: 'maoyanPreSale',
            limit: this.preSaleListCountLimit
          }
        }).then(response => {
          // this.preSaleListCountLimit =
          console.log(response)
          this.preSaleListCountLimit = response.data.length

          this.preSaleListData = response.data
          this.preSaleListData.forEach((item, index) => {
            if (index < this.preSaleListCountLimit) {
              this.$set(this.preSaleListData, index, Object.assign(item, {
                detailSuccess: 0,
                portraitSuccess: 0,
                premiereSuccess: 0,
                content: 'detailSuccess' + 'portraitSuccess',
                color: 'sunccess',
                recordTime: '---',
                active: true
              }))

            }
          })
          this.$message.success('获取列表成功')
        }).catch(error => {
          this.$message.error(error)
        })

      },
      async beginToCrawPreSaleListMovieData() {
        this.crawlingCount = 0
        this.preSaleData = []

        const preSaleData = this.preSaleListData.filter(item => item.active)
        // const preSaleListCountLimit
        let result = []
        let record = {}

        let detailReadyFlag = false
        let portraitReadyFlag = false

        const loop = () => {
          const crawlingCount = this.crawlingCount
          this.crawlingFlag = true
          const movieId = preSaleData[crawlingCount].movieId
          const getDetail = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlMoviePreSaleDetailRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId,
                  headerCode: 'maoyanPreSale'
                }
              }).then(response1 => {
                record.detail = response1.data

                this.$set(this.preSaleListData, crawlingCount, Object.assign(preSaleData[crawlingCount], {
                  detailSuccess: 1
                }))

                resolve(response1.data)
              }).catch(error => {

                this.$set(this.preSaleListData, crawlingCount, Object.assign(preSaleData[crawlingCount], {
                  detailSuccess: 2
                }))
                reject(error)

              })
            })
          }

          const getPortrait = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlPreSaleWantToSeePortraitRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId,
                  headerCode: 'maoyanPreSalePortrait'
                }
              }).then(response1 => {
                record.portrait = response1.data

                this.$set(this.preSaleListData, crawlingCount, Object.assign(preSaleData[crawlingCount], {
                  portraitSuccess: 1,
                  color: 'success'
                }))
                resolve(response1.data)
              }).catch(error => {
                this.$set(this.preSaleListData, crawlingCount, Object.assign(preSaleData[crawlingCount], {
                  portraitSuccess: 2,
                  color: 'failed'
                }))

                reject(error)
              })
            })
          }

          const getPreSaleBoxOfficePremiere = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlPreSaleBoxOfficePremiereRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId + '/premierebox',
                  headerCode: 'maoyanPreSalePortrait'
                }
              }).then(response1 => {
                record.portrait = response1.data

                this.$set(this.preSaleListData, crawlingCount, Object.assign(preSaleData[crawlingCount], {
                  premiereSuccess: 1,
                  color: 'success'
                }))
                resolve(response1.data)
              }).catch(error => {
                this.$set(this.preSaleListData, crawlingCount, Object.assign(preSaleData[crawlingCount], {
                  premiereSuccess: 2,
                  color: 'failed'
                }))

                reject(error)
              })
            })
          }

          const getDetailPromise = getDetail()
          const getPortraitPromise = getPortrait()
          const getPreSaleBoxOfficePremierePromise = getPreSaleBoxOfficePremiere()
          if (this.crawlingCount === this.preSaleListCountLimit) {
            // debugger
            this.crawlingFlag = false
          } else {
            this.crawlingCount++
          }
          Promise.all([getDetailPromise, getPortraitPromise, getPreSaleBoxOfficePremierePromise]).then(responseAll => {
            console.log(responseAll)

            this.$set(this.preSaleData, crawlingCount, Object.assign(responseAll[0], responseAll[1], responseAll[2]))

            console.log('preSaleData', this.preSaleData)

            if (this.crawlingFlag) {
              this.preSaleListData[crawlingCount].recordTime = this.$moment(Date.now()).format('hh:mm:ss')
              loop()
            }

          }).catch(error => {
            console.log(error)
            if (this.crawlingCount === this.preSaleListCountLimit) {
              // debugger
              this.crawlingFlag = false
            } else {
              this.crawlingCount++
            }
            if (this.crawlingFlag) {
              loop()
            }
          })
        }

        loop()
      },
      stopCrawling() {
        this.crawlingFlag = false
      },
      save() {
        if (this.crawlingCount === this.preSaleListCountLimit) {
          console.log(this.preSaleData)
          this.$http.post(this.$baseUrl + this.saveMultipleMaoyanPreSaleRequest, this.preSaleData).then(response => {
            this.$message.success('数据提交成功')
            this.getTableData()
            this.stepCrawlFlag = false
          })
        } else {
          this.$message.warning('dsdsdsdsds')
        }
      },
      handleChangeLimitType(value) {
        console.log(this.crawlerCountType)
        if (this.crawlerCountType === 0) {
          this.preSaleListCountLimit = 0
        }
      },
      handleChangeCountLimit() {

      },
      handleChangeCounter(value) {
        this.preSaleListData.forEach((item, index) => {
          this.$set(this.preSaleListData, index, Object.assign(this.preSaleListData[index], {
            active: index < this.preSaleListCountLimit
          }))
        })
        console.log('this.preSaleListData+++', this.preSaleListData)
        debugger

      }

    }
  }
</script>
<style lang="scss">
  @import '../../styles/edifice.scss';

  .timelineitem {
    font-size: 15px;
    padding: 0 0 1px 0;

    i {
      &.success {
        display: inline-block;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 50%;
        color: #fff;
        background: #91d929;
      }

      &.failed {
        display: inline-block;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 50%;
        color: #fff;
        background: red;
      }
    }
  }
</style>
