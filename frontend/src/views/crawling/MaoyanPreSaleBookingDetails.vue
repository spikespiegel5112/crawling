<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button
          @click="handleMultipleDelete"
          icon="el-icon-delete"
          size="mini"
          type="danger"
          v-waves
        >
          批量删除
        </el-button>
      </template>
      <template slot="quicksearch">
        <div @keyup.enter="search" class="common_search_wrapper">
          <label>
            <input
              placeholder="请输入游戏名称"
              type="text"
              v-model="queryModel.brandName"
            />
          </label>
          <a>
            <span @click="search" class="el-icon-search"></span>
          </a>
        </div>
      </template>
    </CommonQuery>

    <el-table
      :data="tableList"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
      border
      v-loading.body="listLoading"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column
        fixed="left"
        type="selection"
        width="30"
      ></el-table-column>
      <el-table-column
        align="center"
        fixed
        label="No"
        type="index"
        width="45"
      ></el-table-column>
      <el-table-column
        align="center"
        label="movieId"
        prop="movieId"
        width="110"
      ></el-table-column>
      <el-table-column
        align="center"
        label="电影名称（中文）"
        prop="titleChi"
        width="150"
      ></el-table-column>
      <el-table-column
        align="center"
        label="抓取时间"
        prop="timestamp"
        width="110"
      >
        <template slot-scope="scope">
          {{
            $moment(Number(scope.row.timestamp)).format('YYYY-MM-DD HH:mm:ss')
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="上映时间"
        prop="releaseDate"
      ></el-table-column>

      <el-table-column
        align="center"
        label="预售票房"
        prop="premiereBoxInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="预售排片占比"
        prop="premiereShowRate"
      ></el-table-column>
      <el-table-column
        align="center"
        label="预售排片场次"
        prop="premiereShowRate"
      ></el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="checkRecord(scope)" size="mini" type="primary"
            >查看</el-button
          >
          <el-button @click="handleDelete(scope)" size="mini" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common_pagination_wrapper">
      <el-pagination
        :current-page.sync="pagination.page"
        :page-size="pagination.limit"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <!-- 查看预售明细  -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="checkPreSaleFlag"
      width="1200px"
    >
      <el-row justify="center" type="flex">
        <el-col :span="24">
          <el-table
            :data="currentPreSaleDetailsTableData"
            @selection-change="checkPreSaleFlag"
            border
            fit
            highlight-current-row
          >
            <el-table-column
              fixed="left"
              type="selection"
              width="30"
            ></el-table-column>
            <el-table-column
              align="center"
              fixed
              label="No"
              type="index"
              width="45"
            ></el-table-column>
            <el-table-column
              align="center"
              label="时间戳"
              prop="timestamp"
              width="130"
            ></el-table-column>
            <el-table-column
              align="center"
              label="名称（中文）"
              prop="titleChi"
              width="110"
            ></el-table-column>
            <el-table-column
              align="center"
              label="爬取日期"
              prop="date"
              width="110"
            >
              <template slot-scope="scope">
                {{
                  $moment(Number(scope.row.timestamp)).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="记录日期"
              prop="bookingDate"
              width="110"
            ></el-table-column>
            <el-table-column
              align="center"
              label="累计首日预售"
              prop="accumulatedFirstDayPreSale"
              width="110"
            ></el-table-column>
            <el-table-column
              align="center"
              label="当日新增预售"
              prop="dailyAdditionalPreSale"
              width="110"
            ></el-table-column>

            <el-table-column
              align="center"
              label="累计开放场次"
              prop="accumulatedOpenVenues"
            ></el-table-column>
            <el-table-column
              align="center"
              label="当日新增场次"
              prop="dailyAdditionalVenues"
            ></el-table-column>

            <el-table-column
              align="center"
              fixed="right"
              label="操作"
              width="70"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleDelete(scope)"
                  size="mini"
                  type="danger"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="checkPreSaleFlag = false" v-waves>关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="prepareToCrawlFlag"
      title="准备爬取"
      width="600px"
    >
      <el-radio-group
        @change="handleChangeLimitType"
        v-model="crawlerCountType"
      >
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">部分</el-radio>
        <el-input-number
          :disabled="crawlerCountType === 0"
          :min="0"
          @change="handleChangeCountLimit"
          v-model="preSaleListCountLimit"
        ></el-input-number>
      </el-radio-group>

      <el-button @click="getAllCrawlingIndex" type="primary"
        >开始抓取列表</el-button
      >
    </el-dialog>
  </el-row>
</template>

<script>
import CommonQuery from '@/views/common/CommonQuery.vue';

export default {
  components: {
    CommonQuery
  },
  data() {
    return {
      getListByPaginationRequest: 'crawlerMaoyanPreSale/getListByPagination',
      crawlAndSaveRequest: 'crawlerMaoyanPreSale/crawlAndSave',
      crawlMoviePreSaleDetailRequest:
        'crawlerMaoyanPreSale/crawlMoviePreSaleDetail',
      crawlPreSaleWantToSeePortraitRequest:
        'crawlerMaoyanPreSale/crawlPreSaleWantToSeePortrait',
      crawlPreSaleBoxOfficePremiereRequest:
        'crawlerMaoyanPreSale/crawlPreSaleBoxOfficePremiere',
      deleteRecordRequest: 'crawlerMaoyanPreSale/deleteRecords',
      getPreSaleBookingDetailsByMovieIdRequest:
        'crawlerMaoyanPreSale/getPreSaleBookingDetailsByMovieId',

      getSettingsRequest: 'settings/getList',
      crawlMovieListRequest: 'crawlerMaoyanPreSale/crawlMovieList',
      saveMultipleMaoyanPreSaleRequest:
        'crawlerMaoyanPreSale/saveMultipleMaoyanPreSale',
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

      statusDictionary: [
        {
          code: 0,
          name: '未上线'
        },
        {
          code: 1,
          name: '上线'
        }
      ],
      queryModel: {
        sort: 'desc',
        brandName: ''
      },
      pagination: {
        page: 1,
        limit: 100
      },
      importanceOptions: [1, 2, 3],

      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
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
        description: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        name: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        dailyLimit: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        limit: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        startDate: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        status: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      },
      downloadLoading: false,
      pickerOptions0: {
        disabledDate: time => {
          if (this.value2 !== '') {
            return time.getTime() > this.value2;
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          return time.getTime() < this.value1;
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
      checkPreSaleFlag: false,
      stepCrawlFlag: false,
      prepareToCrawlFlag: false,
      settingsList: [],
      preSaleData: [],
      crawlingCount: 0,
      preSaleListData: [],
      crawlingFlag: false,
      preSaleListCountLimit: 0,

      currentPreSaleDetailsTableData: []
    };
  },
  computed: {
    tableHeight() {
      return this.$store.state.app.tableHeight;
    },
    dictionaryList() {
      return this.$store.state.app.dictionary.crawlerAddress;
    },
    crawlerStyle() {
      return {
        height: this.tableHeight - 180 + 'px',
        overflow: 'auto'
      };
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
      console.log(value);
    }
  },
  async mounted() {
    // this.settingsList = await this.getSettingsDictionary()
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.listLoading = true;
      this.queryModel = Object.assign(this.queryModel, this.pagination);
      this.$http
        .get(this.$baseUrl + this.getListByPaginationRequest, {
          params: this.queryModel
        })
        .then(response => {
          console.log('getListByPaginationRequest', response);

          this.tableList = response.data;
          this.total = response.pagination.total;
          this.listLoading = false;
        });
    },
    getSettingsDictionary() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.$baseUrl + this.getSettingsRequest, {
            params: {
              type: 'crawlerAddress'
            }
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    handleFilter() {
      this.pagination.page = 1;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getTableData();
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
      };
    },
    crawlerData() {
      this.$http
        .post(this.$baseUrl + this.crawlAndSaveRequest, {
          address: this.formData.crawlerAddress,
          headerCode: this.formData.headerCode
        })
        .then(response => {
          console.log(response);
          this.$message.success('抓取成功');

          this.getTableData();
          this.checkPreSaleFlag = false;
        });
    },
    createData() {
      this.formData.id = '';
      this.updateData();
    },
    handleUpdate(scope) {
      console.log(scope);
      this.formData = Object.assign({}, scope.row);

      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['formData'].clearValidate();
      });
    },
    updateData() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$http
            .post(this.$baseUrl + this.addAndUpdateRewardInfoRequest, {
              id: this.formData.id,
              description: this.formData.description,
              rewardImage: this.formData.rewardImage,
              rewardName: this.formData.rewardName,
              rewardPrompt: this.formData.rewardPrompt,
              rewardStr: this.formData.rewardStr,
              rewardType: this.formData.rewardType,
              rewardValue: this.formData.rewardValue,
              status: this.formData.status
            })
            .then(response => {
              console.log(response);
              this.dialogFormVisible = false;
              this.$message.success('信息修改成功');
              this.getTableData();
            })
            .catch(error => {
              console.log(error);
              this.$message.error(
                `${error.response.status.toString()}  ${
                  error.response.data.error
                }`
              );
            });
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    handleMultipleDelete() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRecord(
            this.multipleSelection.map(item => {
              return item.id;
            })
          );
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handleDelete(scope) {
      console.log(scope);
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRecord([scope.row.id]);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteRecord(data) {
      this.$http
        .delete(this.$baseUrl + this.deleteRecordRequest, {
          data: {
            id: data
          }
        })
        .then(response => {
          console.log(response);
          this.dialogFormVisible = false;
          this.$message.success('删除成功');
          this.getTableData();
        })
        .catch(error => {
          console.log(error);
          this.$message.error(
            `${error.response.status.toString()}  ${error.response.data.error}`
          );
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

    uploadSuccess1(response) {
      console.log(response);
      this.formData.icon = response.url;
    },
    uploadSuccess2(response) {
      this.formData.rewardImage = response.url;
    },
    changeDailyLimitMode(data) {
      this.formData.dailyLimit =
        data.toString() === 'unlimited' ? '-1' : this.formData.dailyLimit;
    },
    changeLimitMode(data) {
      this.formData.limit =
        data.toString() === 'unlimited' ? '-1' : this.formData.limit;
      alert(this.formData.limit);
    },
    chooseRewardType(data) {
      this.formData.type = this.settingsList.filter(
        item => item.value === data
      )[0].code;
      this.formData.crawlerAddress = data;
    },
    chooseThirdPartyProduct(data) {
      this.chosenThirdPartyProductInfo = data;
    },
    confirmCrawlerSetting() {
      this.crawlerSettingFlag = false;
      this.$message.success('设置成功');
    },

    focusSortList(queryString, callback) {
      this.loading = true;

      // this.queryModel = Object.assign(this.queryModel, {
      //   limit: 999,
      //   page: 1,
      //   status: 1,
      //   title: '',
      //   description: '',
      //   gameTypeId: '',
      // });
      // console.log(this.queryModel)

      this.$http
        .get(this.$baseUrl + this.queryRewardProductByNameRequest, {
          params: {
            name: this.chosenReward
          }
        })
        .then(response => {
          console.log(response);
          this.loading = false;
          // this.total = response.total;
          let result = [];
          if (response.data.length !== 0) {
            response.data.forEach((item, index) => {
              result.push(
                Object.assign(item, {
                  value: item.name
                })
              );
            });

            console.log(111, result);

            callback(result);
          }
        });
    },
    async getAllCrawlingIndex() {
      this.prepareToCrawlFlag = false;
      this.$http
        .get(this.$baseUrl + this.crawlMovieListRequest, {
          params: {
            address: 'https://piaofang.maoyan.com/store',
            headerCode: 'maoyanPreSale',
            limit: this.preSaleListCountLimit
          }
        })
        .then(response => {
          // this.preSaleListCountLimit =
          console.log(response);
          this.preSaleListCountLimit = response.data.length;

          this.preSaleListData = response.data;
          this.preSaleListData.forEach((item, index) => {
            if (index < this.preSaleListCountLimit) {
              this.$set(
                this.preSaleListData,
                index,
                Object.assign(item, {
                  detailSuccess: 0,
                  portraitSuccess: 0,
                  premiereSuccess: 0,
                  content: 'detailSuccess' + 'portraitSuccess',
                  color: 'sunccess',
                  recordTime: '---',
                  active: true
                })
              );
            }
          });
          this.$message.success('获取列表成功');
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    async beginToCrawPreSaleListMovieData() {
      this.crawlingCount = 0;
      this.preSaleData = [];

      const preSaleData = this.preSaleListData.filter(item => item.active);
      // const preSaleListCountLimit
      let result = [];
      let record = {};

      let detailReadyFlag = false;
      let portraitReadyFlag = false;

      const loop = () => {
        const crawlingCount = this.crawlingCount;
        this.crawlingFlag = true;
        const movieId = preSaleData[crawlingCount].movieId;

        const crawlPreSaleBoxOfficePremiere = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(this.$baseUrl + this.crawlPreSaleBoxOfficePremiereRequest, {
                params: {
                  address:
                    'https://piaofang.maoyan.com/movie/' +
                    movieId +
                    '/premierebox',
                  headerCode: 'maoyanPreSalePortrait'
                }
              })
              .then(response1 => {
                record.portrait = response1.data;

                this.$set(
                  this.preSaleListData,
                  crawlingCount,
                  Object.assign(preSaleData[crawlingCount], {
                    premiereSuccess: 1,
                    color: 'success'
                  })
                );
                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.preSaleListData,
                  crawlingCount,
                  Object.assign(preSaleData[crawlingCount], {
                    premiereSuccess: 2,
                    color: 'failed'
                  })
                );

                reject(error);
              });
          });
        };

        const crawlPreSaleBoxOfficePremierePromise = crawlPreSaleBoxOfficePremiere();
        if (this.crawlingCount === this.preSaleListCountLimit) {
          // debugger
          this.crawlingFlag = false;
        } else {
          this.crawlingCount++;
        }
        Promise.all([crawlPreSaleBoxOfficePremierePromise])
          .then(responseAll => {
            console.log(responseAll);

            this.$set(
              this.preSaleData,
              crawlingCount,
              Object.assign(
                { movieId: movieId },
                responseAll[0],
                responseAll[1],
                responseAll[2]
              )
            );

            console.log('preSaleData', this.preSaleData);

            if (this.crawlingFlag) {
              this.preSaleListData[crawlingCount].recordTime = this.$moment(
                Date.now()
              ).format('hh:mm:ss');
              loop();
            }
          })
          .catch(error => {
            console.log(error);
            if (this.crawlingCount === this.preSaleListCountLimit) {
              // debugger
              this.crawlingFlag = false;
            } else {
              this.crawlingCount++;
            }
            if (this.crawlingFlag) {
              loop();
            }
          });
      };

      loop();
    },
    stopCrawling() {
      this.crawlingFlag = false;
    },
    save() {
      if (this.crawlingCount === this.preSaleListCountLimit) {
        console.log(this.preSaleData);
        this.$http
          .post(
            this.$baseUrl + this.saveMultipleMaoyanPreSaleRequest,
            this.preSaleData
          )
          .then(response => {
            this.$message.success('数据提交成功');
            this.getTableData();
            this.stepCrawlFlag = false;
          });
      } else {
        this.$message.warning('dsdsdsdsds');
      }
    },
    handleChangeLimitType(value) {
      console.log(this.crawlerCountType);
      if (this.crawlerCountType === 0) {
        this.preSaleListCountLimit = 0;
      }
    },
    handleChangeCountLimit() {},
    handleChangeCounter(value) {
      this.preSaleListData.forEach((item, index) => {
        this.$set(
          this.preSaleListData,
          index,
          Object.assign(this.preSaleListData[index], {
            active: index < this.preSaleListCountLimit
          })
        );
      });
      console.log('this.preSaleListData+++', this.preSaleListData);
      debugger;
    },
    checkRecord(scope) {
      this.checkPreSaleFlag = true;
      console.log(scope);
      // this.currentPreSaleDetailsTableData = scope
      this.$http
        .get(this.$baseUrl + this.getPreSaleBookingDetailsByMovieIdRequest, {
          params: {
            movieId: scope.row.movieId
          }
        })
        .then(response => {
          console.log(response);
          this.currentPreSaleDetailsTableData = response.data;
        })
        .catch(error => {
          console.log(response);
        });
    }
  }
};
</script>
<style lang="scss">
@import '../../style/edifice.scss';

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
