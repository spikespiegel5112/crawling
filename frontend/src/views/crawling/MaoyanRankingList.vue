<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-row>
          <el-col :span="24">
            <el-button
              @click="stepCrawlFlag = true"
              icon="el-icon-plus"
              size="mini"
              type="primary"
              v-waves
            >
              分步抓取
            </el-button>
            <el-button
              @click="handleMultipleDelete"
              icon="el-icon-delete"
              size="mini"
              type="danger"
              v-waves
            >
              批量删除
            </el-button>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
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
        width="40"
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
        label="电影名称（中文）"
        prop="titleChi"
        width="100"
      ></el-table-column>
      <el-table-column
        align="center"
        label="电影名称（原文）"
        prop="title"
        width="100"
      ></el-table-column>
      <el-table-column
        align="center"
        label="抓取时间"
        prop="timestamp"
        width="100"
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
        label="平台名称（英文）"
        prop="platformEngName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="平台名称（中文）"
        prop="platformChineseName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="平台类型"
        prop="platformType"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看数量"
        prop="numWantToSee"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分人数"
        prop="numOfRating"
      ></el-table-column>
      <el-table-column align="center" label="描述" prop="description">
        <template slot-scope="scope">
          <el-button @click="checkDescription(scope)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="总评分"
        prop="rating"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分1到2分占比"
        prop="rating1To2"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分4到4分占比"
        prop="rating3To4"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分5到6分占比"
        prop="rating5To6"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分7到8分占比"
        prop="rating7To8"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分9到10分占比"
        prop="rating9To10"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分20岁以下占比"
        prop="ratingByAge20"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分20到24岁占比"
        prop="ratingByAge20To24"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分25到29岁占比"
        prop="ratingByAge25To29"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分30到34岁占比"
        prop="ratingByAge30To34"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分35到39岁占比"
        prop="ratingByAge35To39"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分一线城市占比"
        prop="ratingByTier1"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分二线城市占比"
        prop="ratingByTier2"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分三线城市占比"
        prop="ratingByTier3"
      ></el-table-column>
      <el-table-column
        align="center"
        label="评分四线城市占比"
        prop="ratingByTier4"
      ></el-table-column>

      <el-table-column
        align="center"
        label="想看男性受众占比"
        prop="wantToSeeByGenderMale"
      >
        <!--        <template slot-scope="scope">-->
        <!--          {{JSON.parse(scope.row.byGenderMale.match(/[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/))+'%'}}-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column
        align="center"
        label="想看女性受众占比"
        prop="wantToSeeByGenderFemale"
      >
        <!--        <template slot-scope="scope">-->
        <!--          {{scope.row.byGenderFemale.match(/[[1-9]\d*\.\d*|0\.\d*[1-9]\d*]$/g)}}-->
        <!--          {{String(scope.row.byGenderFemale.match(/[[1-9]\d*\.\d*|0\.\d*[1-9]\d*]$/g)).split(',')[1]}}-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column
        align="center"
        label="想看20岁以下占比"
        prop="wantToSeeByAge20"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看20到24岁占比"
        prop="wantToSeeByAge20To24"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看25到29岁占比"
        prop="wantToSeeByAge25To29"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看30到34岁占比"
        prop="wantToSeeByAge30To34"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看35到39岁占比"
        prop="wantToSeeByAge35To39"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看40岁以上占比"
        prop="wantToSeeByAge40"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看一线城市占比"
        prop="wantToSeeByTier1"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看二线城市占比"
        prop="wantToSeeByTier2"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看三线城市占比"
        prop="wantToSeeByTier3"
      ></el-table-column>
      <el-table-column
        align="center"
        label="想看四线城市占比"
        prop="wantToSeeByTier4"
      ></el-table-column>

      <el-table-column
        align="center"
        label="预售票房"
        prop="preSaleBoxInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="预售排片占比"
        prop="preSaleShowRate"
      ></el-table-column>
      <el-table-column
        align="center"
        label="预售排片场次"
        prop="preSaleShowInfo"
      ></el-table-column>

      <el-table-column
        align="center"
        label="全球票房（美元）"
        prop="globalBoxInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="北美票房（美元）"
        prop="northAmericaBoxInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="IMDb评分"
        prop="imdbRating"
      ></el-table-column>

      <el-table-column
        align="center"
        label="平均上座率"
        prop="avgSeatView"
      ></el-table-column>
      <el-table-column
        align="center"
        label="平均上映率"
        prop="avgShowView"
      ></el-table-column>
      <el-table-column
        align="center"
        label="平均观看率"
        prop="avgViewBox"
      ></el-table-column>
      <el-table-column
        align="center"
        label="票房数"
        prop="boxInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="票房占有率"
        prop="boxRate"
      ></el-table-column>
      <el-table-column
        align="center"
        label="myRefundNumInfo"
        prop="myRefundNumInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="myRefundRateInfo"
        prop="myRefundRateInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="在线票房比率"
        prop="onlineBoxRate"
      ></el-table-column>
      <el-table-column
        align="center"
        label="退款数"
        prop="refundViewInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="退款率"
        prop="refundViewRate"
      ></el-table-column>
      <el-table-column
        align="center"
        label="上映时间"
        prop="releaseInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="上映时间颜色"
        prop="releaseInfoColor"
      ></el-table-column>
      <el-table-column
        align="center"
        label="上座率"
        prop="seatRate"
      ></el-table-column>
      <el-table-column
        align="center"
        label="平均上座率"
        prop="showInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="上映率"
        prop="showRate"
      ></el-table-column>
      <el-table-column
        align="center"
        label="分账票房"
        prop="splitAvgViewBox"
      ></el-table-column>
      <el-table-column
        align="center"
        label="splitBoxInfo"
        prop="splitBoxInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="分账比率"
        prop="splitBoxRate"
      ></el-table-column>
      <el-table-column
        align="center"
        label="总分账信息"
        prop="splitSumBoxInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="总票房"
        prop="sumBoxInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="viewInfo"
        prop="viewInfo"
      ></el-table-column>
      <el-table-column
        align="center"
        label="viewInfo"
        prop="viewInfoV2"
      ></el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="100px">
        <template slot-scope="scope">
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
        :visible.sync="oneKeyCrawlFlag"
        width="850px"
      ></el-pagination>
    </div>
    <!-- 111 -->
    <!-- 一键抓取 -->
    <el-dialog title="一键抓取" :visible.sync="oneKeyCrawlFlag" width="1200px">
      <el-row justify="center" type="flex">
        <el-col :span="20">
          <el-form
            :model="formData"
            :rules="rules"
            label-position="right"
            ref="formData"
          >
            <el-form-item label="爬虫类型" prop="rewardType">
              <el-select
                v-model="formData.rewardType"
                @change="chooseRewardType"
              >
                <el-option v-for="(item, index) in settingsList" :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="爬虫地址" prop="crawlerAddress">
              <el-input v-model="formData.crawlerAddress"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="oneKeyCrawlFlag = false" v-waves>取消</el-button>
        <el-button @click="crawlerData" type="primary" v-waves>确定</el-button>
      </div>
    </el-dialog>
    <!-- 222 -->
    <!-- 分步抓取 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="stepCrawlFlag"
      top="1vh"
      width="1400px"
    >
      <el-row class="stepcrawlheader" :gutter="1">
        <div class="left">
          <el-button @click="prepareToCrawlFlag = true" type="primary">
            {{ rankingListData.length === 0 ? '获取索引' : '重新获取索引' }}
          </el-button>
          <el-button
            :disabled="rankingListData.length === 0"
            @click="beginToCrawRankingListMovieData"
            type="primary"
            v-if="!crawlingFlag"
          >
            {{ crawlingCount === 0 ? '开始抓取' : '重新抓取' }}
          </el-button>
          <el-button @click="stopCrawling" type="danger" v-else
            >停止抓取</el-button
          >
        </div>
        <div class="right">
          <el-button @click="handleSave" type="primary">保存</el-button>
        </div>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="24">
          <el-row justify="left" type="flex">
            <el-col :span="14">
              <!--          {{rankingListCountLimit}}-->
              <el-input-number
                :min="0"
                v-model="rankingListCountLimit"
              ></el-input-number>
              <el-button @click="handleChangeCounter" type="primary"
                >确定</el-button
              >
            </el-col>
            <el-col :span="3"> </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-card shadow="never">
                <el-progress
                  :percentage="
                    rankingListData.length !== 0
                      ? Math.floor(
                          (crawlingCount / rankingListData.length) * 100
                        )
                      : 0
                  "
                  :stroke-width="20"
                  :text-inside="true"
                  status="success"
                ></el-progress>
                <el-divider>
                  <el-row>
                    <el-col
                      :span="24"
                      v-if="
                        rankingListData.length > 0 &&
                          crawlingCount < rankingListData.length
                      "
                    >
                      共有{{ rankingListData.length }}条数据，正在抓取第{{
                        crawlingCount
                      }}条...
                    </el-col>
                    <el-col :span="24" v-else>
                      共有{{ rankingListData.length }}条数据，抓取完毕
                    </el-col>
                  </el-row>
                </el-divider>
                <el-row justify="left" type="flex">
                  <el-col :span="24">
                    <!--          {{preSaleWantToSeeListData}}-->
                    <el-timeline :style="crawlerStyle">
                      <el-timeline-item
                        :color="
                          item.color === 'success' ? '#91d929' : '#e4e7ed'
                        "
                        :key="index"
                        :timestamp="item.recordTime"
                        class="timelineitem"
                        placement="top"
                        v-for="(item, index) in rankingListData.filter(
                          item => !item.disabled
                        )"
                      >
                        <el-card shadow="hover">
                          <el-row>
                            <el-col :span="1" style="text-align: left"
                              >第{{ index + 1 }}条</el-col
                            >
                            <el-col :span="2" style="text-align: left">{{
                              item.movieId
                            }}</el-col>
                            <el-col :span="3" style="text-align: left">{{
                              item.title
                            }}</el-col>
                            <el-col :span="2">
                              详情:
                              <i class="" v-if="item.detailSuccess === 0"></i>
                              <i
                                class="el-icon-check success"
                                v-else-if="item.detailSuccess === 1"
                              ></i>
                              <i
                                class="el-icon-close failed"
                                v-else-if="item.detailSuccess === 2"
                              ></i>
                            </el-col>
                            <el-col :span="2">
                              更多:
                              <i
                                class=""
                                v-if="item.moreSectionsSuccess === 0"
                              ></i>
                              <i
                                class="el-icon-check success"
                                v-else-if="item.moreSectionsSuccess === 1"
                              ></i>
                              <i
                                class="el-icon-close failed"
                                v-else-if="item.moreSectionsSuccess === 2"
                              ></i>
                            </el-col>
                            <el-col :span="2">
                              评分:
                              <i
                                class=""
                                v-if="item.rankingListRatingSuccess === 0"
                              ></i>
                              <i
                                class="el-icon-check success"
                                v-else-if="item.rankingListRatingSuccess === 1"
                              ></i>
                              <i
                                class="el-icon-close failed"
                                v-else-if="item.rankingListRatingSuccess === 2"
                              ></i>
                            </el-col>

                            <el-col :span="2">
                              想看:
                              <i
                                class=""
                                v-if="
                                  item.rankingListWantToSeePortraitSuccess === 0
                                "
                              ></i>
                              <i
                                class="el-icon-check success"
                                v-else-if="
                                  item.rankingListWantToSeePortraitSuccess === 1
                                "
                              ></i>
                              <i
                                class="el-icon-close failed"
                                v-else-if="
                                  item.rankingListWantToSeePortraitSuccess === 2
                                "
                              ></i>
                            </el-col>
                            <el-col :span="3">
                              首映日票房:
                              <i
                                class=""
                                v-if="
                                  item.rankingListWantToSeePortraitSuccess === 0
                                "
                              ></i>
                              <i
                                class="el-icon-check success"
                                v-else-if="
                                  item.rankingListWantToSeePortraitSuccess === 1
                                "
                              ></i>
                              <i
                                class="el-icon-close failed"
                                v-else-if="
                                  item.rankingListWantToSeePortraitSuccess === 2
                                "
                              ></i>
                            </el-col>
                            <el-col :span="2">
                              全球票房:
                              <i
                                class=""
                                v-if="
                                  item.rankingListBoxOfficeGlobalSuccess === 0
                                "
                              ></i>
                              <i
                                class="el-icon-check success"
                                v-else-if="
                                  item.rankingListBoxOfficeGlobalSuccess === 1
                                "
                              ></i>
                              <i
                                class="el-icon-close failed"
                                v-else-if="
                                  item.rankingListBoxOfficeGlobalSuccess === 2
                                "
                              ></i>
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

      <el-row justify="space-between" type="flex">
        <el-col :span="21"> </el-col>
        <el-col :span="3" style="text-align: right">
          <el-button @click="stepCrawlFlag = false" type="primary"
            >关闭</el-button
          >
        </el-col>
      </el-row>
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
          v-model="rankingListCountLimit"
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
      getListByPaginationRequest:
        'crawlerMaoyanRankingList/getListByPagination',
      crawlAndSaveRequest: 'crawlerMaoyanRankingList/crawlAndSave',
      crawlRankinglistDetailRequest:
        'crawlerMaoyanRankingList/crawlRankinglistDetail',
      crawlRankingListMoreSectionsRequest:
        'crawlerMaoyanRankingList/crawlRankingListMoreSections',
      crawlRankingListRatingRequest:
        'crawlerMaoyanRankingList/crawlRankingListRating',
      crawlRankingListWantToSeePortraitRequest:
        'crawlerMaoyanRankingList/crawlRankingListWantToSeePortrait',
      crawlRankingListBoxOfficePremiereRequest:
        'crawlerMaoyanRankingList/crawlRankingListBoxOfficePremiere',
      crawlRankingListBoxOfficeGlobalRequest:
        'crawlerMaoyanRankingList/crawlRankingListBoxOfficeGlobal',

      crawlMoviePreSaleDetailRequest:
        'crawlerMaoyanPreSale/crawlMoviePreSaleDetail',
      crawlMoviePreSalePortraitRequest:
        'crawlerMaoyanPreSale/crawlMoviePreSalePortrait',
      deleteRecordRequest: 'crawlerMaoyanRankingList/deleteRecords',
      getSettingsRequest: 'settings/getList',

      crawlRankingListByYearRequest:
        'crawlerMaoyanRankingList/crawlRankingListByYear',
      crawlPreSaleMovieListRequest: 'crawlerMaoyanPreSale/crawlMovieList',
      saveMultipleMaoyanRankingListRecordRequest:
        'crawlerMaoyanRankingList/saveMultipleMaoyanRankingListRecord',
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
      prepareToCrawlFlag: false,
      crawlerCountType: 0,

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
      advertisementDialogFlag: false,
      currentAdvertisementTabIndex: 0,
      effectiveDuration: [],
      multipleSelection: [],
      oneKeyCrawlFlag: false,
      stepCrawlFlag: false,
      settingsList: [],
      rankingListMovieData: [],
      rankingListData: [],
      crawlingCount: 0,
      preSaleWantToSeeListData: [],
      preSaleWantToSeeListMovieData: [],
      crawlingFlag: false,
      rankingListCountLimit: 0,
      presaleCountLimit: 0
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
    this.settingsList = await this.getSettingsDictionary();
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.listLoading = true;
      this.$http
        .get(this.$baseUrl + this.getListByPaginationRequest, {
          params: Object.assign(this.queryModel, this.pagination)
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
        status: ''
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
          this.oneKeyCrawlFlag = false;
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
          const result = [];
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
      await this.getRankingList();
      this.prepareToCrawlFlag = false;
      // const getRankingListPromise = this.getRankingList()
      // Promise.all([getRankingListPromise]).then(responseAll => {
      //   console.log(responseAll)
      // }).catch(error => {
      //   console.log(error)
      //   this.$message.error(error)
      // })
    },
    getMovieData() {
      const getDetailData = this.getDetailData();
      Promise.all([getDetailData])
        .then(responseAll => {
          console.log(responseAll);
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error);
        });
    },

    async getDetailData() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.$baseUrl + this.crawlPreSaleMovieListRequest, {
            params: {
              address: 'https://piaofang.maoyan.com/store',
              headerCode: 'maoyanPreSale'
            }
          })
          .then(response => {
            console.log(response);
            this.presaleCountLimit = response.data.length;

            this.preSaleWantToSeeListData = response.data;
            response.data.forEach((item, index) => {
              if (index < this.presaleCountLimit) {
                this.$set(
                  this.preSaleWantToSeeListData,
                  index,
                  Object.assign(item, {
                    detailSuccess: 0,
                    content: [
                      'detailSuccess',
                      'rankingListWantToSeePortraitSuccess'
                    ],
                    color: 'sunccess',
                    recordTime: '---',
                    active: true
                  })
                );
              }
            });
            this.$message.success('获取预售列表成功');
            resolve(this.preSaleWantToSeeListData);
          })
          .catch(error => {
            this.$message.error(error);
            reject(error);
          });
      });
    },
    async getPreSaleList() {
      this.$http
        .get(this.$baseUrl + this.crawlPreSaleMovieListRequest, {
          params: {
            address: 'https://piaofang.maoyan.com/store',
            headerCode: 'maoyanPreSale'
          }
        })
        .then(response => {
          console.log(response);
          this.presaleCountLimit = response.data.length;

          this.preSaleWantToSeeListData = response.data;
          this.preSaleWantToSeeListData.forEach((item, index) => {
            if (index < this.presaleCountLimit) {
              this.$set(
                this.preSaleWantToSeeListData,
                index,
                Object.assign(item, {
                  preSaleWantToSeePortraitSuccess: 0,
                  content: 'detailSuccess' + 'preSaleWantToSeePortraitSuccess',
                  color: 'sunccess',
                  recordTime: '---',
                  active: true
                })
              );
            }
          });
          this.$message.success('获取预售列表成功');
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    async getRankingList() {
      return new Promise((resolve, reject) => {
        this.$http
          .post(
            this.$baseUrl + this.crawlRankingListByYearRequest,
            {
              address: 'https://piaofang.maoyan.com/rankings/year',
              headerCode: 'maoyanRankingList',
              limit: this.rankingListCountLimit,
              query: {
                year: '2019',
                tab: '1'
              }
            },
            {
              timeout: 20000
            }
          )
          .then(response => {
            this.rankingListCountLimit = response.data.length;
            console.log(response);

            const result = response.data.map(item => {
              return Object.assign(item, {
                title: item.title,
                detailSuccess: 0,
                rankingListRatingSuccess: 0,
                rankingListWantToSeePortraitSuccess: 0,
                moreSectionsSuccess: 0,
                rankingListBoxOfficeGlobalSuccess: 0,
                content:
                  'detailSuccess' + 'rankingListWantToSeePortraitSuccess',
                color: 'sunccess',
                recordTime: '---',
                active: true
              });
            });
            resolve(this.rankingListData);
            this.$message.success('获取电影排名列表成功');
            this.rankingListData = result;
            // response.data.forEach((item, index) => {
            //   this.$set(this.rankingListData, index, Object.assign(item, {
            //     title: item.title,
            //     detailSuccess: 0,
            //     rankingListRatingSuccess: 0,
            //     rankingListWantToSeePortraitSuccess: 0,
            //     moreSectionsSuccess: 0,
            //     rankingListBoxOfficeGlobalSuccess: 0,
            //     content: 'detailSuccess' + 'rankingListWantToSeePortraitSuccess',
            //     color: 'sunccess',
            //     recordTime: '---',
            //     active: true
            //   }))
            // })
          })
          .catch(error => {
            this.$message.error(error);
            reject(error);
          });
      });
    },
    async beginToCrawRankingListMovieData() {
      console.log('this.rankingListData++++', this.rankingListData);
      console.log(
        'this.movieId++++',
        this.rankingListData.map(item => item.movieId)
      );

      this.crawlingCount = 0;
      this.rankingListMovieData = [];

      const record = {};

      const loop = () => {
        const crawlingCount = this.crawlingCount;
        this.crawlingFlag = true;
        console.log(this.rankingListData);
        const movieId = this.rankingListData[crawlingCount].movieId;

        const getDetail = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(this.$baseUrl + this.crawlRankinglistDetailRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId,
                  headerCode: 'rankingListDetailHeader'
                },
                timeout: 20000
              })
              .then(response1 => {
                record.detail = response1.data;
                response1.data = Object.assign(
                  {
                    movieId: movieId
                  },
                  response1.data
                );

                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    detailSuccess: 1
                  })
                );

                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    detailSuccess: 2
                  })
                );
                resolve(error);
              });
          });
        };

        const getDetaiMoreSections = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(this.$baseUrl + this.crawlRankingListMoreSectionsRequest, {
                params: {
                  address:
                    'https://piaofang.maoyan.com/movie/' +
                    movieId +
                    '/moresections',
                  headerCode: 'rankingListDetailHeader'
                }
              })
              .then(response1 => {
                record.detailMoreSections = response1.data;

                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    moreSectionsSuccess: 1
                  })
                );

                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    moreSectionsSuccess: 2
                  })
                );
                resolve(error);
              });
          });
        };

        const getRankingListWantToSeePortrait = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(
                this.$baseUrl + this.crawlRankingListWantToSeePortraitRequest,
                {
                  params: {
                    address:
                      'https://piaofang.maoyan.com/movie/' +
                      movieId +
                      '/wantindex?wkwebview=1%26city_tier=0%26city_id=0%26cityName=%E5%85%A8%E5%9B%BD',
                    headerCode: 'rankingListDetailHeader'
                  },
                  timeout: 20000
                }
              )
              .then(response1 => {
                record.portrait = response1.data;

                console.log('getRankingListWantToSeePortrait', response1.data);

                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    rankingListWantToSeePortraitSuccess: 1
                  })
                );
                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    rankingListWantToSeePortraitSuccess: 2
                  })
                );
                resolve(error);
              });
          });
        };

        const getRankingListRating = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(this.$baseUrl + this.crawlRankingListRatingRequest, {
                params: {
                  address:
                    'https://piaofang.maoyan.com/movie/' +
                    movieId +
                    '/audienceRating?usePageCache=true',
                  headerCode: 'rankingListDetailHeader'
                },
                timeout: 300000
              })
              .then(response1 => {
                record.rating = response1.data;

                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    rankingListRatingSuccess: 1
                  })
                );

                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    rankingListRatingSuccess: 2
                  })
                );
                resolve(error);
              });
          });
        };

        const getRankingListPremiereBox = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(
                this.$baseUrl + this.crawlRankingListBoxOfficePremiereRequest,
                {
                  params: {
                    address:
                      'https://piaofang.maoyan.com/movie/' +
                      movieId +
                      '/premierebox',
                    headerCode: 'rankingListDetailHeader'
                  },
                  timeout: 300000
                }
              )
              .then(response1 => {
                record.rating = response1.data;

                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    RankingListPemiereBoxSuccess: 1
                  })
                );

                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    RankingListPemiereBoxSuccess: 2
                  })
                );
                resolve(error);
              });
          });
        };

        const getRankingListBoxOfficeGlobal = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(
                this.$baseUrl + this.crawlRankingListBoxOfficeGlobalRequest,
                {
                  params: {
                    address:
                      'https://piaofang.maoyan.com/movie/' +
                      movieId +
                      '/boxshowna',
                    headerCode: 'rankingListDetailHeader'
                  },
                  timeout: 300000
                }
              )
              .then(response1 => {
                record.rating = response1.data;

                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    rankingListBoxOfficeGlobalSuccess: 1
                  })
                );

                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.rankingListData,
                  crawlingCount,
                  Object.assign(this.rankingListData[crawlingCount], {
                    rankingListBoxOfficeGlobalSuccess: 2
                  })
                );
                resolve(error);
              });
          });
        };

        const getDetailPromise = getDetail();
        const getRankingListWantToSeePortraitPromise = getRankingListWantToSeePortrait();
        const getRankingListRatingPromise = getRankingListRating();
        const getMoreSectionsPromise = getDetaiMoreSections();
        const getRankingListPremiereBoxPromise = getRankingListPremiereBox();
        const getRankingListBoxOfficeGlobalPromise = getRankingListBoxOfficeGlobal();

        Promise.all([
          getDetailPromise,
          getMoreSectionsPromise,
          getRankingListRatingPromise,
          getRankingListWantToSeePortraitPromise,
          getRankingListPremiereBoxPromise,
          getRankingListBoxOfficeGlobalPromise
        ])
          .then(responseAll => {
            console.log('responseAll', responseAll);
            this.rankingListData[crawlingCount].color = 'success';
            this.$set(
              this.rankingListMovieData,
              crawlingCount,
              Object.assign(
                responseAll[0],
                responseAll[1],
                responseAll[2],
                responseAll[3],
                responseAll[4],
                responseAll[5]
              )
            );
            console.log('this.rankingListData+++++', this.rankingListData);
            //

            console.log('rankingListMovieData', this.rankingListMovieData);
            if (this.crawlingCount === this.rankingListCountLimit) {
              this.crawlingFlag = false;
              this.crawlingCount = 0;
            } else {
              this.crawlingCount++;
            }
            if (this.crawlingFlag) {
              this.rankingListData[crawlingCount].recordTime = this.$moment(
                Date.now()
              ).format('hh:mm:ss');
              loop();
            }
          })
          .catch(error => {
            console.log(error);
            if (this.crawlingCount === this.rankingListData.length) {
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

    async beginToCrawlPreSale() {
      this.crawlingCount = 0;
      this.preSaleWantToSeeListData = [];

      let result = [];
      let record = {};

      const loop = () => {
        const crawlingCount = this.crawlingCount;
        this.crawlingFlag = true;
        const movieId = this.preSaleWantToSeeListData[crawlingCount].movieId;
        const getDetail = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(this.$baseUrl + this.crawlMoviePreSaleDetailRequest, {
                params: {
                  address: 'https://piaofang.maoyan.com/movie/' + movieId,
                  headerCode: 'maoyanPreSale'
                }
              })
              .then(response1 => {
                record.detail = response1.data;

                this.$set(
                  this.preSaleWantToSeeListData,
                  crawlingCount,
                  Object.assign(this.preSaleWantToSeeListData[crawlingCount], {
                    detailSuccess: 1
                  })
                );

                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.preSaleWantToSeeListData,
                  crawlingCount,
                  Object.assign(this.preSaleWantToSeeListData[crawlingCount], {
                    detailSuccess: 2
                  })
                );
                reject(error);
              });
          });
        };

        const getPreSaleWantToSeePortrait = () => {
          return new Promise((resolve, reject) => {
            this.$http
              .get(this.$baseUrl + this.crawlMoviePreSalePortraitRequest, {
                params: {
                  address:
                    'https://piaofang.maoyan.com/movie/' +
                    movieId +
                    '/wantindex?wkwebview=1%26city_tier=0%26city_id=0%26cityName=%E5%85%A8%E5%9B%BD',
                  headerCode: 'rankingListDetailHeader'
                }
              })
              .then(response1 => {
                record.portrait = response1.data;

                this.$set(
                  this.preSaleWantToSeeListData,
                  crawlingCount,
                  Object.assign(this.preSaleWantToSeeListData[crawlingCount], {
                    rankingListWantToSeePortraitSuccess: 1,
                    color: 'success'
                  })
                );
                resolve(response1.data);
              })
              .catch(error => {
                this.$set(
                  this.preSaleWantToSeeListData,
                  crawlingCount,
                  Object.assign(this.preSaleWantToSeeListData[crawlingCount], {
                    rankingListWantToSeePortraitSuccess: 2,
                    color: 'failed'
                  })
                );

                reject(error);
              });
          });
        };

        const getDetailPromise = getDetail();
        const getPreSaleWantToSeePortraitPromise = getPreSaleWantToSeePortrait();
        if (this.crawlingCount === this.rankingListCountLimit) {
          this.crawlingFlag = false;
        } else {
          this.crawlingCount++;
        }
        Promise.all([getDetailPromise, getPreSaleWantToSeePortraitPromise])
          .then(responseAll => {
            console.log(responseAll);

            this.$set(
              this.preSaleWantToSeeListData,
              crawlingCount,
              Object.assign(responseAll[0], responseAll[1])
            );

            console.log('rankingListMovieData', this.preSaleWantToSeeListData);

            if (this.crawlingFlag) {
              this.preSaleWantToSeeListData[
                crawlingCount
              ].recordTime = this.$moment(Date.now()).format('hh:mm:ss');
              loop();
            }
          })
          .catch(error => {
            console.log(error);
            if (this.crawlingCount === this.rankingListCountLimit) {
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
    handleSave() {
      if (
        this.crawlingCount !== 0 &&
        this.crawlingCount === this.rankingListCountLimit
      ) {
        console.log(this.rankingListMovieData);
        const params = this.rankingListMovieData.map(item => {
          //   delete item.config;
          //   delete item.request;
          //   delete item.response;
          delete item.toJSON;
          return item;
        });
        console.log('params+++++', params);

        this.$http
          .post(
            this.$baseUrl + this.saveMultipleMaoyanRankingListRecordRequest,
            params
          )
          .then(response => {
            this.$message.success('数据提交成功');
            this.getTableData();
            this.stepCrawlFlag = false;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$message.warning('dsdsdsdsds');
      }
    },
    handleChangeCounter(value) {
      this.preSaleWantToSeeListData.forEach((item, index) => {
        this.$set(
          this.preSaleWantToSeeListData,
          index,
          Object.assign(this.preSaleWantToSeeListData[index], {
            active: index < this.rankingListCountLimit
          })
        );
      });
    },
    checkDescription(scope) {
      this.$alert(scope.row.description, '电影描述', {
        confirmButtonText: '关闭',
        closeOnClickModal: true,
        callback: action => {}
      });
    },
    handleChangeLimitType(value) {
      console.log(this.crawlerCountType);
      if (this.crawlerCountType === 0) {
        this.rankingListCountLimit = 0;
      }
    },
    handleChangeCountLimit() {}
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
.stepcrawlheader {
  font-size: 0;
  .left {
    display: inline-block;
    width: 50%;
    text-align: left;
  }
  .right {
    display: inline-block;
    width: 50%;
    text-align: right;
  }
}
</style>
