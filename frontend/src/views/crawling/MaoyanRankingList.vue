<template>
  <el-row class="app-container">
    <CommonQuery>
      <template slot="button1">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="stepCrawlFlag=true" v-waves>
          分步抓取
        </el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="oneKeyCrawlFlag=true" v-waves>
          一键抓取
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
      <el-table-column type="selection" width="40" fixed="left"></el-table-column>
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


      <el-table-column align="center" label="总评分" prop='rating'></el-table-column>
      <el-table-column align="center" label="1到2分占比" prop='rating1To2'></el-table-column>
      <el-table-column align="center" label="4到4分占比" prop='rating3To4'></el-table-column>
      <el-table-column align="center" label="5到6分占比" prop='rating5To6'></el-table-column>
      <el-table-column align="center" label="7到8分占比" prop='rating7To8'></el-table-column>
      <el-table-column align="center" label="9到10分占比" prop='rating9To10'></el-table-column>


      <el-table-column align="center" label="男性受众占比" prop='wantToSeeByGenderMale'>
        <!--        <template slot-scope="scope">-->
        <!--          {{JSON.parse(scope.row.byGenderMale.match(/[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/))+'%'}}-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column align="center" label="女性受众占比" prop='wantToSeeByGenderFemale'>
        <!--        <template slot-scope="scope">-->
        <!--          {{scope.row.byGenderFemale.match(/[[1-9]\d*\.\d*|0\.\d*[1-9]\d*]$/g)}}-->
        <!--          {{String(scope.row.byGenderFemale.match(/[[1-9]\d*\.\d*|0\.\d*[1-9]\d*]$/g)).split(',')[1]}}-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column align="center" label="20岁以下占比" prop='wantToSeeByAge20'></el-table-column>
      <el-table-column align="center" label="20到24岁占比" prop='wantToSeeByAge20To24'></el-table-column>
      <el-table-column align="center" label="25到29岁占比" prop='wantToSeeByAge25To29'></el-table-column>
      <el-table-column align="center" label="30到34岁占比" prop='wantToSeeByAge30To34'></el-table-column>
      <el-table-column align="center" label="35到39岁占比" prop='wantToSeeByAge35To39'></el-table-column>
      <el-table-column align="center" label="40岁以上占比" prop='wantToSeeByAge40'></el-table-column>
      <el-table-column align="center" label="一线城市占比" prop='wantToSeeByTier1'></el-table-column>
      <el-table-column align="center" label="二线城市占比" prop='wantToSeeByTier2'></el-table-column>
      <el-table-column align="center" label="三线城市占比" prop='wantToSeeByTier3'></el-table-column>
      <el-table-column align="center" label="四线城市占比" prop='wantToSeeByTier4'></el-table-column>


      <el-table-column align="center" label="平均上座率" prop='avgSeatView'></el-table-column>
      <el-table-column align="center" label="平均上映率" prop='avgShowView'></el-table-column>
      <el-table-column align="center" label="平均观看率" prop='avgViewBox'></el-table-column>
      <el-table-column align="center" label="票房数" prop='boxInfo'></el-table-column>
      <el-table-column align="center" label="票房占有率" prop='boxRate'></el-table-column>
      <el-table-column align="center" label="myRefundNumInfo" prop='myRefundNumInfo'></el-table-column>
      <el-table-column align="center" label="myRefundRateInfo" prop='myRefundRateInfo'></el-table-column>
      <el-table-column align="center" label="在线票房比率" prop='onlineBoxRate'></el-table-column>
      <el-table-column align="center" label="退款数" prop='refundViewInfo'></el-table-column>
      <el-table-column align="center" label="退款率" prop='refundViewRate'></el-table-column>
      <el-table-column align="center" label="上映时间" prop='releaseInfo'></el-table-column>
      <el-table-column align="center" label="上映时间颜色" prop='releaseInfoColor'></el-table-column>
      <el-table-column align="center" label="上座率" prop='seatRate'></el-table-column>
      <el-table-column align="center" label="平均上座率" prop='showInfo'></el-table-column>
      <el-table-column align="center" label="上映率" prop='showRate'></el-table-column>
      <el-table-column align="center" label="分账票房" prop='splitAvgViewBox'></el-table-column>
      <el-table-column align="center" label="splitBoxInfo" prop='splitBoxInfo'></el-table-column>
      <el-table-column align="center" label="分账比率" prop='splitBoxRate'></el-table-column>
      <el-table-column align="center" label="总分账信息" prop='splitSumBoxInfo'></el-table-column>
      <el-table-column align="center" label="总票房" prop='sumBoxInfo'></el-table-column>
      <el-table-column align="center" label="viewInfo" prop='viewInfo'></el-table-column>
      <el-table-column align="center" label="viewInfo" prop='viewInfoV2'></el-table-column>


      <el-table-column align="center" label="操作" width="100px" fixed="right">
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
    <!--    分步抓取-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="stepCrawlFlag" width="1600px" top="1vh">
      <el-row :gutter="1">
        <el-col :span="2">
          <el-button type="primary" @click="getAllCrawlingIndex">
            {{presaleListData.length===0?'获取索引':'重新获取索引'}}
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button v-if="!crawlingFlag" :disabled="presaleListData.length===0" type="primary"
                     @click="beginToCrawMovieData">
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

            <el-col :span="14">
              <!--          {{rankListCountLimit}}-->
              <el-input-number v-model="rankListCountLimit" :min="0"
                               :max="rankingListData.length"></el-input-number>
              <el-button type="primary" @click="handleChangeCounter">确定</el-button>

            </el-col>
            <el-col :span="3">
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="24">
              <el-card shadow="never">
                <el-progress :text-inside="true" :stroke-width="20"
                             :percentage="rankingListData.length!==0?Math.floor(crawlingCount/rankingListData.length*100):0"
                             status="success"></el-progress>
                <el-divider>
                  <el-row>
                    <el-col v-if="rankingListData.length>0&&crawlingCount<rankingListData.length" :span="24">
                      共有{{rankingListData.length}}条数据，正在抓取第{{crawlingCount}}条...
                    </el-col>
                    <el-col v-else :span="24">
                      共有{{rankingListData.length}}条数据，抓取完毕
                    </el-col>
                  </el-row>
                </el-divider>
                <el-row type="flex" justify="left">
                  <el-col :span="24">
                    <!--          {{presaleListData}}-->
                    <el-timeline :style="clawerStyle">
                      <el-timeline-item v-for="(item, index) in rankingListData.filter(item=>!item.disabled)"
                                        :key="index"
                                        :timestamp="item.recordTime"
                                        placement="top"
                                        :color="item.color==='success'?'#91d929':'#e4e7ed'"
                                        class="timelineitem"
                      >
                        <el-card shadow="hover">
                          <el-row>`
                            <el-col :span="1" style="text-align: left">第{{index+1}}条</el-col>
                            <el-col :span="1" style="text-align: left">{{item.movieId}}</el-col>
                            <el-col :span="4" style="text-align: left">{{item.title}}</el-col>
                            <el-col :span="4">
                              详情: <i v-if="item.detailSuccess===0" class=""></i>
                              <i v-else-if="item.detailSuccess===1" class="el-icon-check success"></i>
                              <i v-else="item.detailSuccess===2" class="el-icon-close failed"></i>
                            </el-col>
                            <el-col :span="4">
                              描述: <i v-if="item.descriptionSuccess===0" class=""></i>
                              <i v-else-if="item.descriptionSuccess===1" class="el-icon-check success"></i>
                              <i v-else="item.descriptionSuccess===2" class="el-icon-close failed"></i>
                            </el-col>
                            <el-col :span="4">
                              画像: <i v-if="item.portraitSuccess===0" class=""></i>
                              <i v-else-if="item.portraitSuccess===1" class="el-icon-check success"></i>
                              <i v-else="item.portraitSuccess===2" class="el-icon-close failed"></i>
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
        <!--        <el-col :span="12">-->
        <!--          <el-row type="flex" justify="left">-->
        <!--            <el-col :span="14">-->
        <!--              &lt;!&ndash;          {{rankListCountLimit}}&ndash;&gt;-->
        <!--              <el-input-number v-model="presaleCountLimit" :min="0"-->
        <!--                               :max="presaleListData.length"></el-input-number>-->
        <!--              <el-button type="primary" @click="handleChangeCounter">确定</el-button>-->

        <!--            </el-col>-->

        <!--          </el-row>-->
        <!--          <el-row>-->
        <!--            <el-col :span="24">-->
        <!--              <el-card shadow="never">-->
        <!--                <el-progress :text-inside="true" :stroke-width="20"-->
        <!--                             :percentage="presaleListData.length!==0?Math.floor(crawlingCount/presaleListData.length*100):0"-->
        <!--                             status="success"></el-progress>-->
        <!--                <el-divider>-->
        <!--                  <el-row>-->
        <!--                    <el-col v-if="presaleListData.length>0&&crawlingCount<presaleListData.length" :span="24">-->
        <!--                      共有{{presaleListData.length}}条数据，正在抓取第{{crawlingCount}}条...-->
        <!--                    </el-col>-->
        <!--                    <el-col v-else :span="24">-->
        <!--                      共有{{presaleListData.length}}条数据，抓取完毕-->
        <!--                    </el-col>-->
        <!--                  </el-row>-->
        <!--                </el-divider>-->
        <!--                <el-row class="" type="flex" justify="left">-->
        <!--                  <el-col :span="24">-->
        <!--                    &lt;!&ndash;          {{presaleListData}}&ndash;&gt;-->
        <!--                    <el-timeline :style="clawerStyle">-->
        <!--                      <el-timeline-item v-for="(item, index) in presaleListData.filter(item=>!item.disabled)"-->
        <!--                                        :key="index"-->
        <!--                                        :timestamp="item.recordTime"-->
        <!--                                        placement="top"-->
        <!--                                        :color="item.color==='success'?'#91d929':'#e4e7ed'"-->
        <!--                                        class="timelineitem"-->
        <!--                      >-->
        <!--                        <el-card shadow="hover">-->
        <!--                          <el-row>-->
        <!--                            <el-col :span="3" style="text-align: left">第{{index+1}}条</el-col>-->
        <!--                            <el-col :span="4">-->
        <!--                              详情: <i v-if="item.detailSuccess===0" class=""></i>-->
        <!--                              <i v-else-if="item.detailSuccess===1" class="el-icon-check success"></i>-->
        <!--                              <i v-else="item.detailSuccess===2" class="el-icon-close failed"></i>-->
        <!--                            </el-col>-->
        <!--                            <el-col :span="4">-->
        <!--                              {{item.active}}-->
        <!--                              画像: <i v-if="item.portraitSuccess===0" class=""></i>-->
        <!--                              <i v-else-if="item.portraitSuccess===1" class="el-icon-check success"></i>-->
        <!--                              <i v-else="item.portraitSuccess===2" class="el-icon-close failed"></i>-->
        <!--                            </el-col>-->
        <!--                          </el-row>-->
        <!--                        </el-card>-->


        <!--                      </el-timeline-item>-->
        <!--                    </el-timeline>-->
        <!--                  </el-col>-->
        <!--                </el-row>-->

        <!--              </el-card>-->
        <!--            </el-col>-->
        <!--          </el-row>-->
        <!--        </el-col>-->
      </el-row>


      <el-row type="flex" justify="space-between">
        <el-col :span="21">
        </el-col>
        <el-col :span="3" style="text-align: right">
          <el-button type="primary" @click="stepCrawlFlag=false">关闭</el-button>
        </el-col>
      </el-row>
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
        getListByPaginationRequest: 'crawlerMaoyanRankingList/getListByPagination',
        crawlAndSaveRequest: 'crawlerMaoyanRankingList/crawlAndSave',
        crawlRankinglistDetailRequest: 'crawlerMaoyanRankingList/crawlRankinglistDetail',
        crawlRankingListMoreSectionsRequest: 'crawlerMaoyanRankingList/crawlRankingListMoreSections',
        crawlRankingListRatingRequest: 'crawlerMaoyanRankingList/crawlRankingListRating',
        crawlMoviePresaleDetailRequest: 'crawlerMaoyanPresale/crawlMoviePresaleDetail',
        crawlMoviePresalePortraitRequest: 'crawlerMaoyanPresale/crawlMoviePresalePortrait',
        deleteRecordRequest: 'crawlerMaoyanRankingList/deleteRecords',
        getSettingsRequest: 'settings/getList',

        crawlRankingListByYearRequest: 'crawlerMaoyanRankingList/crawlRankingListByYear',
        crawlPresaleMovieListRequest: 'crawlerMaoyanPresale/crawlMovieList',
        saveMultipleMaoyanRankingListRecordRequest: 'crawlerMaoyanRankingList/saveMultipleMaoyanRankingListRecord',
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
        advertisementDialogFlag: false,
        currentAdvertisementTabIndex: 0,
        effectiveDuration: [],
        multipleSelection: [],
        oneKeyCrawlFlag: false,
        stepCrawlFlag: false,
        settingsList: [],
        wantSeeData: [],
        rankingListData: [],
        crawlingCount: 0,
        presaleListData: [],
        crawlingFlag: false,
        rankListCountLimit: 0,
        presaleCountLimit: 0

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
      this.settingsList = await this.getSettingsDictionary()
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.listLoading = true
        this.$http.get(this.$baseUrl + this.getListByPaginationRequest, {
          params: Object.assign(this.queryModel, this.pagination)
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
      getAllCrawlingIndex() {
        const getRankingList = this.getRankingList()
        const getPresaleList = this.getPresaleList()

        Promise.all([getRankingList, getPresaleList]).then(responseAll => {
          console.log(responseAll)
        }).catch(error => {
          console.log(error)
          this.$message.error(error)
        })

      },
      getMovieData() {
        const getDetailData = this.getDetailData()
        Promise.all([getDetailData]).then(responseAll => {
          console.log(responseAll)
        }).catch(error => {
          console.log(error)
          this.$message.error(error)
        })
      },
      async getRankingList() {
        return new Promise((resolve, reject) => {
          this.$http.post(this.$baseUrl + this.crawlRankingListByYearRequest, {
            address: 'https://piaofang.maoyan.com/rankings/year',
            headerCode: 'maoyanRankingList',
            query: {
              year: '2019',
              limit: '100',
              tab: '1'
            }
          }, {
            timeout: 15000
          }).then(response => {
            // this.rankListCountLimit =
            console.log(response)
            this.rankListCountLimit = response.data.length

            this.rankingListData = response.data
            this.rankingListData.forEach((item, index) => {
              if (index < this.rankListCountLimit) {
                this.$set(this.rankingListData, index, Object.assign(item, {
                  title: item.title,
                  detailSuccess: 0,
                  portraitSuccess: 0,
                  descriptionSuccess: 0,
                  content: 'detailSuccess' + 'portraitSuccess',
                  color: 'sunccess',
                  recordTime: '---',
                  active: true
                }))

              }
            })
            this.$message.success('获取电影排名列表成功')
          }).catch(error => {
            this.$message.error(error)
          })
        })

      },
      async getDetailData() {
        this.$http.get(this.$baseUrl + this.crawlPresaleMovieListRequest, {
          params: {
            address: 'https://piaofang.maoyan.com/store',
            headerCode: 'maoyanPresale'
          }
        }).then(response => {
          console.log(response)
          this.presaleCountLimit = response.data.length

          this.presaleListData = response.data
          this.presaleListData.forEach((item, index) => {
            if (index < this.presaleCountLimit) {
              this.$set(this.presaleListData, index, Object.assign(item, {
                detailSuccess: 0,
                portraitSuccess: 0,
                content: 'detailSuccess' + 'portraitSuccess',
                color: 'sunccess',
                recordTime: '---',
                active: true
              }))

            }
          })
          this.$message.success('获取预售列表成功')
        }).catch(error => {
          this.$message.error(error)
        })

      },
      async getPresaleList() {
        this.$http.get(this.$baseUrl + this.crawlPresaleMovieListRequest, {
          params: {
            address: 'https://piaofang.maoyan.com/store',
            headerCode: 'maoyanPresale'
          }
        }).then(response => {
          console.log(response)
          this.presaleCountLimit = response.data.length

          this.presaleListData = response.data
          this.presaleListData.forEach((item, index) => {
            if (index < this.presaleCountLimit) {
              this.$set(this.presaleListData, index, Object.assign(item, {
                detailSuccess: 0,
                portraitSuccess: 0,
                content: 'detailSuccess' + 'portraitSuccess',
                color: 'sunccess',
                recordTime: '---',
                active: true
              }))

            }
          })
          this.$message.success('获取预售列表成功')
        }).catch(error => {
          this.$message.error(error)
        })

      },
      async beginToCrawMovieData() {
        this.crawlingCount = 0
        this.wantSeeData = []

        let result = []
        let record = {}

        let detailReadyFlag = false
        let portraitReadyFlag = false

        const loop = () => {
          const crawlingCount = this.crawlingCount
          this.crawlingFlag = true
          console.log(this.rankingListData)
          const movieId = this.rankingListData[crawlingCount].movieId
          const getDetail = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlRankinglistDetailRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId,
                  headerCode: 'rankingListDetailHeader'
                }
              }).then(response1 => {
                record.detail = response1.data

                this.$set(this.rankingListData, crawlingCount, Object.assign(this.rankingListData[crawlingCount], {
                  detailSuccess: 1
                }))

                resolve(response1.data)
              }).catch(error => {

                this.$set(this.rankingListData, crawlingCount, Object.assign(this.rankingListData[crawlingCount], {
                  detailSuccess: 2
                }))
                reject(error)

              })
            })
          }

          const getMoreSections = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlRankingListMoreSectionsRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId + '/moresections',
                  headerCode: 'rankingListDetailHeader'
                }
              }).then(response1 => {
                record.detail = response1.data

                this.$set(this.rankingListData, crawlingCount, Object.assign(this.rankingListData[crawlingCount], {
                  detailSuccess: 1
                }))

                resolve(response1.data)
              }).catch(error => {

                this.$set(this.rankingListData, crawlingCount, Object.assign(this.rankingListData[crawlingCount], {
                  detailSuccess: 2
                }))
                reject(error)

              })
            })
          }

          const getRankingListRating = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlRankingListRatingRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId + '/audienceRating?usePageCache=true',
                  headerCode: 'rankingListDetailHeader'
                }
              }).then(response1 => {
                record.detail = response1.data

                this.$set(this.rankingListData, crawlingCount, Object.assign(this.rankingListData[crawlingCount], {
                  detailSuccess: 1
                }))

                resolve(response1.data)
              }).catch(error => {

                this.$set(this.rankingListData, crawlingCount, Object.assign(this.rankingListData[crawlingCount], {
                  detailSuccess: 2
                }))
                reject(error)

              })
            })
          }

          const getWantToSeePortrait = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlMoviePresalePortraitRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId,
                  headerCode: 'maoyanPresalePortrait'
                }
              }).then(response1 => {
                record.portrait = response1.data

                this.$set(this.presaleListData, crawlingCount, Object.assign(this.presaleListData[crawlingCount], {
                  portraitSuccess: 1,
                  color: 'success'
                }))
                resolve(response1.data)
              }).catch(error => {
                this.$set(this.presaleListData, crawlingCount, Object.assign(this.presaleListData[crawlingCount], {
                  portraitSuccess: 2,
                  color: 'failed'
                }))

                reject(error)
              })
            })
          }

          const getDetailPromise = getDetail()
          // const getWantToSeePortraitPromise = getWantToSeePortrait()
          // const getMoreSectionsPromise = getMoreSections()
          const getRankingListRatingPromise = getRankingListRating()
          if (this.crawlingCount === this.rankListCountLimit) {
            // debugger
            this.crawlingFlag = false
          } else {
            this.crawlingCount++
          }
          Promise.all([getDetailPromise, getRankingListRatingPromise]).then(responseAll => {
            console.log(responseAll)

            this.$set(this.wantSeeData, crawlingCount, Object.assign(responseAll[0],responseAll[1]))

            console.log('wantSeeData', this.wantSeeData)

            if (this.crawlingFlag) {
              this.presaleListData[crawlingCount].recordTime = this.$moment(Date.now()).format('hh:mm:ss')
              loop()
            }

          }).catch(error => {
            console.log(error)
            if (this.crawlingCount === this.rankListCountLimit) {
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
      async beginToCrawlPresale() {
        this.crawlingCount = 0
        this.wantSeeData = []

        let result = []
        let record = {}

        let detailReadyFlag = false
        let portraitReadyFlag = false

        const loop = () => {
          const crawlingCount = this.crawlingCount
          this.crawlingFlag = true
          const movieId = this.presaleListData[crawlingCount].movieId
          const getDetail = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlMoviePresaleDetailRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId,
                  headerCode: 'maoyanPresale'
                }
              }).then(response1 => {
                record.detail = response1.data

                this.$set(this.presaleListData, crawlingCount, Object.assign(this.presaleListData[crawlingCount], {
                  detailSuccess: 1
                }))

                resolve(response1.data)
              }).catch(error => {

                this.$set(this.presaleListData, crawlingCount, Object.assign(this.presaleListData[crawlingCount], {
                  detailSuccess: 2
                }))
                reject(error)

              })
            })
          }

          const getWantToSeePortrait = () => {
            return new Promise((resolve, reject) => {
              this.$http.get(this.$baseUrl + this.crawlMoviePresalePortraitRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId,
                  headerCode: 'maoyanPresalePortrait'
                }
              }).then(response1 => {
                record.portrait = response1.data

                this.$set(this.presaleListData, crawlingCount, Object.assign(this.presaleListData[crawlingCount], {
                  portraitSuccess: 1,
                  color: 'success'
                }))
                resolve(response1.data)
              }).catch(error => {
                this.$set(this.presaleListData, crawlingCount, Object.assign(this.presaleListData[crawlingCount], {
                  portraitSuccess: 2,
                  color: 'failed'
                }))

                reject(error)
              })
            })
          }

          const getDetailPromise = getDetail()
          const getWantToSeePortraitPromise = getWantToSeePortrait()
          if (this.crawlingCount === this.rankListCountLimit) {
            // debugger
            this.crawlingFlag = false
          } else {
            this.crawlingCount++
          }
          Promise.all([getDetailPromise, getWantToSeePortraitPromise]).then(responseAll => {
            console.log(responseAll)

            this.$set(this.wantSeeData, crawlingCount, Object.assign(responseAll[0], responseAll[1]))

            console.log('wantSeeData', this.wantSeeData)

            if (this.crawlingFlag) {
              this.presaleListData[crawlingCount].recordTime = this.$moment(Date.now()).format('hh:mm:ss')
              loop()
            }

          }).catch(error => {
            console.log(error)
            if (this.crawlingCount === this.rankListCountLimit) {
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
        if (this.crawlingCount === this.rankListCountLimit) {
          console.log(this.wantSeeData)
          this.$http.post(this.$baseUrl + this.saveMultipleMaoyanRankingListRecordRequest, this.wantSeeData.reverse()).then(response => {
            this.$message.success('数据提交成功')
            this.getTableData()
            this.stepCrawlFlag = false
          })
        } else {
          this.$message.warning('dsdsdsdsds')
        }
      },
      handleChangeCounter(value) {
        this.presaleListData.forEach((item, index) => {
          this.$set(this.presaleListData, index, Object.assign(this.presaleListData[index], {
            active: index < this.rankListCountLimit
          }))
        })
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
