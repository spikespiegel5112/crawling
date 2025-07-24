<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button
          @click="createData"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-waves
        >
          新建
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
      element-loading-text="Loading"
      fit
      highlight-current-row
      v-loading.body="listLoading"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column
        align="center"
        fixed
        label="No"
        type="index"
        width="45"
      ></el-table-column>
      <el-table-column
        align="center"
        label="header名称"
        prop="name"
        width="200"
      ></el-table-column>
      <el-table-column align="center" label="爬虫类型" prop="type">
        <template slot-scope="scope">
          <div
            v-if="currentEditingCrawlerId !== scope.row.headerId"
            class="common_tag_wrapper"
          >
            <el-tag
              :key="item.code"
              type="success"
              v-for="item in getCrawlerType(scope)"
            >
              {{ getCrawlerType(scope).length > 0 ? item.name : '' }}
            </el-tag>
            <el-button
              @click="handleChangeCralerType(scope)"
              icon="el-icon-edit"
              size="mini"
              type="text"
            ></el-button>
          </div>
          <div v-else>
            <el-select multiple placeholder="请选择" v-model="formData.type">
              <el-option
                :key="item.code"
                :label="item.name"
                :value="item.code"
                v-for="item in $store.state.app.dictionary['crawler']"
              ></el-option>
            </el-select>
            <el-button
              @click="saveHeaderTypes"
              icon="el-icon-check"
              size="mini"
              type="text"
            ></el-button>
            <el-button
              @click="currentEditingCrawlerId = ''"
              icon="el-icon-close"
              size="mini"
              type="text"
            ></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="header键名"
        prop="headerKeyName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="header值名"
        prop="headerValueName"
      ></el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope)" size="mini" type="primary"
            >编辑</el-button
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
    <!-- 编辑 -->
    <!-- 111 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="850px"
    >
      <el-row justify="center" type="flex">
        <el-col :span="20">
          <el-form
            :model="formData"
            :rules="rules"
            label-position="right"
            label-width="140px"
            ref="formData"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select placeholder="" v-model="formData.type" multiple>
                <el-option
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  v-for="item in $store.state.app.dictionary['crawler']"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="header键名" prop="headerKeyName">
              <el-input
                :disabled="formData.rewardType === 'third_link'"
                v-model="formData.headerKeyName"
              ></el-input>
            </el-form-item>
            <el-form-item label="header值名" prop="headerValueName">
              <el-input
                :autosize="{ minRows: 2, maxRows: 8 }"
                type="textarea"
                v-model="formData.headerValueName"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = false" v-waves>取消</el-button>
        <el-button
          @click="createData"
          type="primary"
          v-if="dialogStatus === 'create'"
          >{{ $t('table.confirm') }}</el-button
        >
        <el-button @click="updateData" type="primary" v-else v-waves>确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import CommonTag from '@/views/common/CommonTag.vue';
import CommonQuery from '@/views/common/CommonQuery.vue';

export default {
  components: {
    CommonTag,
    CommonQuery
  },
  data() {
    return {
      getListRequest: 'headerSettings/getList',
      createOrUpdateRequest: 'headerSettings/createOrUpdate',
      deleteHeaderRequest: 'headerSettings/deleteHeader',
      getDictionaryListRequest: 'dictionary/getList',
      tableList: [],
      total: null,
      listLoading: true,
      queryModel: {
        sort: 'desc',
        brandName: ''
      },
      pagination: {
        page: 1,
        limit: 50
      },

      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      formData: {
        headerId: '',
        name: '',
        type: '',
        headerKeyName: '',
        headerValueName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      currentEditingCrawlerId: '',
      currentEditingCrawlerCode: '',
      rules: {
        headerId: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        name: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        type: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        headerKeyName: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        headerValueName: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ]
      },
      typeList: [],

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
      expandQuery: ''
    };
  },
  computed: {
    tableHeight() {
      return this.$store.state.app.tableHeight;
    },
    dictionaryList() {
      return this.$store.state.app.dictionary;
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
    this.$store.commit('updateDictionary', {
      crawler: await this.getDictionaryList()
    });
    this.getTableData();

    console.log(this.dictionaryList);
  },
  methods: {
    getTableData() {
      this.listLoading = true;
      this.queryModel = Object.assign(this.queryModel, this.pagination);
      this.$http
        .get(this.$baseUrl + this.getListRequest, {
          params: this.queryModel
        })
        .then(response => {
          console.log('getListByPaginationRequest', response);

          this.tableList = response.data;
          this.total = response.pagination.total;
          this.listLoading = false;
        });
    },
    getDictionaryList() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.$baseUrl + this.getDictionaryListRequest, {
            params: {
              typeCode: 'crawler'
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
    getCrawlerType(scope) {
      const typeList = this.$parseStringToArray(scope.row.type);
      return this.$store.state.app.dictionary['crawler'].filter(item => {
        return typeList.some(item2 => item2 === item.code);
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
    createData() {
      this.dialogFormVisible = true;
      this.formData.headerId = '';
      this.resetTemp();
    },
    handleUpdate(scope) {
      console.log(scope);
      scope.row.type = this.$parseStringToArray(scope.row.type);
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
          this.commitUpdate();
        }
      });
    },
    handleChangeCralerType(scope) {
      console.log('handleChangeCralerType++++++', scope.row);
      this.currentEditingCrawlerId = scope.row.headerId;
      this.formData = Object.assign({}, scope.row);
      this.formData.headerId = scope.row.headerId;
      this.formData.type = this.$parseStringToArray(scope.row.type);
    },

    saveHeaderTypes() {
      this.commitUpdate();
      this.currentEditingCrawlerId = '';
    },
    commitUpdate() {
      this.$http
        .post(this.$baseUrl + this.createOrUpdateRequest, {
          headerId: this.formData.headerId,
          name: this.formData.name,
          type: JSON.stringify(this.formData.type),
          headerKeyName: this.formData.headerKeyName,
          headerValueName: this.formData.headerValueName
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
            `${error.response.status.toString()}  ${error.response.data.error}`
          );
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
      console.log(data);
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
    }
  }
};
</script>
<style lang="scss">
@import '../../style/edifice.scss';
</style>
