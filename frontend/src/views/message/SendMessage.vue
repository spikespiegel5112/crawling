<
<template>
  <el-row class="app-container">
    <CommonQuery :expand="false">
      <template slot="button1">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>
          发送消息
        </el-button>
      </template>
      <!--<template slot="query1">-->
      <!--<div>-->
      <!--<el-select v-model="formData.activityId">-->
      <!--<el-option v-for="item in messageTypeDictionary" :key="item.id" :label="item.name"-->
      <!--:value="item.id"></el-option>-->
      <!--</el-select>-->
      <!--</div>-->
      <!--</template>-->
    </CommonQuery>

    <el-table :data="tableList" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row
              :height="tableHeight">
      <el-table-column label="No" type="index" width="50" align="center" fixed></el-table-column>

      <el-table-column label="是否可用" align="center" prop="status">
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
      <el-table-column label="操作" align="center" width="300px">
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
    <el-dialog title="发送消息" :visible.sync="dialogFormVisible" width="850px"
               :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData"
                   label-position="right"
                   label-width="140px">

            <el-form-item label="topics" prop="topics">
              <el-radio v-for="item in topicsDictionary" :key="item.code" v-model="currentTopicsType" :label="item.code"
                        @change="chooseTopicsType">{{item.name}}
              </el-radio>
              <el-select v-if="currentTopicsType==='@me_'" v-model="formData.topics" @change="changeTopics" multiple>
                <el-option v-for="item in topicsList" :key="item" :label="item"
                           :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消息类型" prop="type">
              <el-select v-model="formData.type" @change="chooseContentType">
                <el-option v-for="item in messageTypeDictionary" :key="item.code" :label="item.name"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <el-input v-if="currentContentType==='text'" type="textarea" v-model="formData.content"></el-input>
              <el-button v-else type="primary" :disabled="currentContentType===''" @click="editContent">编辑</el-button>
            </el-form-item>
            <div v-if="currentContentType!=='text'" class="sendmessage_contentformdata_wrapper">
              <el-table :data="[contentFormData]">
                <el-table-column v-for="(item, index) in contentFormData" :key="index" :label="index">
                  <template slot-scope="scope">
                    <div :style="{'min-height':'50px'}">
                      {{contentFormData[index]}}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
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
        <el-button @click="dialogFormVisible=false" v-waves>关闭</el-button>
        <el-button type="primary" @click="sendMessage" v-waves>发送消息</el-button>
      </div>
    </el-dialog>
    <!-- 编辑品牌 -->
    <el-dialog :title="'编辑'+currentContentTitle+'内容'" :visible.sync="editContentFlag" width="850px"
               :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form v-if="currentContentType!==''" :rules="rules2" ref="contentFormData" :model="contentFormData"
                   label-position="right"
                   label-width="140px">
            <el-form-item v-if="contentFormDictionary[currentContentType].title" label="title" prop="title">
              <el-input v-model="contentFormData.title"></el-input>
            </el-form-item>
            <el-form-item v-if="contentFormDictionary[currentContentType].subtitle" label="subtitle" prop="subtitle">
              <el-input v-model="contentFormData.subtitle"></el-input>
            </el-form-item>
            <el-form-item v-if="contentFormDictionary[currentContentType].topics" label="topics" prop="topics">
              <el-select v-model="contentFormData.topics">
                <el-option v-for="item in topicsDictionary" :key="item.code" :label="item.name"
                           :value="item.code"></el-option>
              </el-select>
              <el-input v-model="contentFormData.subtitle"></el-input>
            </el-form-item>

            <el-form-item v-if="contentFormDictionary[currentContentType].image_thumbnail" label="image_thumbnail"
                          prop="image_thumbnail">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess1"
                :returnUrlList.sync="contentFormData.image_thumbnail"
                fileType="image"
              />
              <el-input v-show="false" v-model="contentFormData.image_thumbnail"></el-input>
            </el-form-item>
            <el-form-item v-if="contentFormDictionary[currentContentType].link" label="link" prop="link">
              <el-input type="textarea" v-model="contentFormData.link"></el-input>
            </el-form-item>
            <el-form-item v-if="contentFormDictionary[currentContentType].desc" label="desc" prop="desc">
              <el-input type="textarea" v-model="contentFormData.desc"></el-input>
            </el-form-item>
            <el-form-item v-if="contentFormDictionary[currentContentType].image" label="image" prop="image">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess2"
                :returnUrlList.sync="contentFormData.image"
                fileType="image"
              />
              <el-input v-show="false" v-model="contentFormData.image"></el-input>
            </el-form-item>
            <el-form-item v-if="contentFormDictionary[currentContentType].url" label="url" prop="url">
              <el-input v-model="contentFormData.url"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editContentFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="encodeData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>`

<script>
  import CommonQuery from '@/views/common/CommonQuery.vue'

  export default {
    components: {
      CommonQuery,
    },
    data() {
      return {
        sendMessageRequest: 'notification-service/1.0.0/message',
        formData: {
          "topics": [],
          "content": '',
          "type": '',
          "iosEnable": '',
          "androidEnable": ''
        },
        contentFormData: {
          title: '',
          subtitle: '',
          image_thumbnail: '',
          link: '',
          desc: '',
          image: '',
          url: ''
        },
        topicsDictionary: [{
          name: '全体',
          code: '@sys'
          // }, {
          //   name: '个人',
          //   code: '@me_'
        }],
        messageTypeDictionary: [{
          name: '文本',
          code: 'text'
        }, {
          name: 'HTML',
          code: 'html'
        }, {
          name: '弹窗',
          code: 'popup'
        }],
        queryModel: {},
        listLoading: false,
        tableList: [],
        pagination: {
          page: 1,
          size: 20,
        },
        total: 0,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          topics: [{required: true, message: '此项为必填项', trigger: 'change'}],
          content: [{required: true, message: '此项为必填项', trigger: 'change'}],
          "type": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "iosEnable": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "androidEnable": [{required: true, message: '此项为必填项', trigger: 'change'}],
        },
        rules2: {
          title: [{required: true, message: '此项为必填项', trigger: 'change'}],
          subtitle: [{required: true, message: '此项为必填项', trigger: 'change'}],
          "image_thumbnail": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "link": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "desc": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "image": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "url": [{required: true, message: '此项为必填项', trigger: 'change'}],
        },
        dialogFormVisible: false,
        editContentFlag: false,
        contentFormDictionary: {
          html: {
            title: true,
            subtitle: true,
            image_thumbnail: true,
            link: true,
            desc: false,
            image: false,
            url: false
          },
          popup: {
            title: true,
            subtitle: false,
            image_thumbnail: false,
            link: false,
            desc: true,
            image: true,
            url: true
          },
          text: {
            title: false,
            subtitle: false,
            image_thumbnail: false,
            link: false,
            desc: false,
            image: false,
            url: false
          }
        },
        currentContentType: '',
        currentTopicsType: '',
        topicsList: ['18260045855', '17521558498'],
      }
    },
    computed: {
      tableHeight() {
        return this.$store.state.app.tableHeight - 5;
      },
      currentContentTitle() {
        return this.currentContentType !== '' ? this.messageTypeDictionary.find(item => item.code === this.currentContentType).name : '';
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
      },
    },
    mounted() {

    },
    methods: {
      // getTableData() {
      //   this.listLoading = true;
      //   this.queryModel = Object.assign(this.queryModel, this.pagination);
      //   this.$http.get(this.$baseUrl + this.queryRewardInfoByActivityTypeRequest + `/${this.formData.activityId}`).then(response => {
      //     console.log(response)
      //
      //     this.tableList = response.data;
      //     this.total = response.total;
      //     this.listLoading = false
      //
      //
      //   })
      // },

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


      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        if (this.$refs.formData !== undefined) {
          // this.$refs.formData.resetFields();
          this.$nextTick(() => {
            this.$refs['formData'].clearValidate()
          })
        }
      },

      handleUpdate(scope) {
        console.log('handleUpdate', scope)
        this.formData = Object.assign({}, scope.row);
        // this.chosenReward = scope.row.rewardName;
        // this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },

      handleDelete(scope) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(this.$baseUrl + this.deleteActivityRewardMappingByIdRequest + `/${scope.row.id}`).then((response) => {
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
      expand() {
        this.expandQuery = !this.expandQuery;
      },
      search() {
        this.getTableData();
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
        this.contentFormData.image_thumbnail = response.url;
      },
      uploadSuccess2(response) {
        console.log(response)
        this.contentFormData.image = response.url;
      },
      changeDailyLimitMode(data) {
        this.formData.number = data.toString() === 'unlimited' ? '-1' : this.formData.number;
      },
      chooseThirdPartyProduct(data) {
        this.chosenThirdPartyProductInfo = data;
        this.formData.rewardId = data.id;
      },
      focusSortList(queryString, callback) {
        this.loading = true;
        this.$http.get(this.$baseUrl + this.queryRewardProductByNameRequest, {
          params: {
            name: this.chosenReward
          }
        }).then(response => {
          console.log(response)
          this.loading = false;
          // this.total = response.total;
          let result = [];
          if (response.data.length !== 0) {
            response.data.forEach((item, index) => {
              result.push(Object.assign(item, {
                value: item.name
              }));
            });
            // this.aaaa.forEach(item1 => {
            //   result = result.filter(item2 => item1.name !== item2.name)
            // });

            console.log(111, result)

            callback(result)

          }


        })
      },

      chooseContentType() {
        this.currentContentType = this.formData.type;
        this.resetContentData();
        this.formData.content = '';
      },
      changeTopics(value) {
        console.log(value)
        let result = [];

        value.forEach(item => {
          result.push(item.indexOf('@me_') === -1 ? this.currentTopicsType + item : item);
        });
        this.formData.topics = result;
        console.log(this.formData.topics)

      },
      chooseTopicsType(value) {
        console.log(value)
        if (this.currentTopicsType === '@sys') {
          this.formData.topics = ['@sys']
        }
      },
      editContent() {
        this.editContentFlag = true;
        // alert(this.currentContentType)
      },
      resetContentData() {
        Object.keys(this.contentFormData).forEach(item => {
          this.contentFormData[item] = '';
        })
        console.log(this.$refs['contentFormData'])
        // this.$refs['contentFormData'].resetFields();
      },
      resetTemp() {
        this.formData = Object.assign(this.formData, {
          "topics": '',
          "content": '',
          "type": '',
          "iosEnable": '',
          "androidEnable": ''
        });
      },
      encodeData() {
        this.$refs['contentFormData'].validate(valid => {
          if (valid) {
            let result = {};
            let checker = this.contentFormDictionary[this.currentContentType];
            Object.keys(checker).forEach(item => {
              if (checker[item]) {
                result[item] = this.contentFormData[item]
              }
            });

            result = JSON.stringify(result)
            console.log(result)
            this.formData.content = result;
            this.editContentFlag = false;
          }
        })
      },
      sendMessage() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.sendMessageRequest, [this.formData]).then(response => {
              console.log(response)
              this.$message.success('发送成功');

            }).catch(error => {
              this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
            })
          }

        })

      },

    }
  }
</script>
<style lang="scss">
  .sendmessage_contentformdata_wrapper {
    /*height: 500px;*/
  }
</style>
