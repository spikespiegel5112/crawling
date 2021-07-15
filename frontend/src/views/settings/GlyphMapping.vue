<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button
          @click="handleCreate"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-waves
          >新建</el-button
        >
        <el-button
          @click="handleMultipleDelete"
          icon="el-icon-delete"
          size="mini"
          type="danger"
          v-waves
          >批量删除</el-button
        >
      </template>
      <template slot="quicksearch">
        <div @keyup.enter="search" class="common-search-wrapper">
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
        label="Unicode"
        prop="unicode"
      ></el-table-column>
      <el-table-column
        align="center"
        label="Number"
        prop="number"
      ></el-table-column>
      <el-table-column
        align="center"
        label="Value"
        prop="value"
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
    <div class="common-pagination-wrapper">
      <el-pagination
        :current-page.sync="pagination.page"
        :page-size="pagination.limit"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 编辑-->
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
            <el-form-item label="Unicode" prop="unicode">
              <el-input v-model="formData.unicode"></el-input>
            </el-form-item>
            <el-form-item label="Number" prop="number">
              <el-input v-model="formData.number"></el-input>
            </el-form-item>
            <el-form-item label="Value" prop="value">
              <el-input v-model="formData.value"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = false" v-waves>{{
          $t('table.cancel')
        }}</el-button>
        <el-button @click="updateData" type="primary">{{
          $t('table.confirm')
        }}</el-button>
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
      getListRequest: 'glyphMapping/getList',
      createOrUpdateRequest: 'glyphMapping/createOrUpdate',
      deleteItemRequest: 'glyphMapping/deleteItem',

      tableList: [],
      total: null,
      listLoading: true,
      queryModel: {
        sort: 'desc',
        typeCode: ''
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
        id: '',
        mappingId: '',
        unicode: '',
        number: '',
        value: ''
      },
      typeFormData: {
        name: '',
        code: ''
      },
      typeList: [],
      dialogFormVisible: false,
      addTypeFlag: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        unicode: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        number: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        value: [{ required: true, message: '此项为必填项', trigger: 'change' }]
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
      expandQuery: ''
    };
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
      console.log(value);
    }
  },
  mounted() {
    this.getTableData();
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
        mappingId: '',
        unicode: '',
        number: '',
        value: ''
      };
      if (this.$refs.formData) {
        this.$refs.formData.resetFields();
      }
    },
    handleCreate() {
      this.dialogStatus = 'create';
      this.resetTemp();
      console.log(this.typeList);
      this.dialogFormVisible = true;
    },
    handleUpdate(scope) {
      this.$nextTick(() => {
        this.formData = Object.assign({}, scope.row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate();
        });
      });
    },
    chooseType(val) {
      this.formData.typeName = this.typeList.filter(
        item => item.code === val
      )[0].name;
    },
    updateData() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$http
            .post(this.$baseUrl + this.createOrUpdateRequest, {
              id: this.formData.id,
              mappingId: this.formData.mappingId,
              unicode: this.formData.unicode,
              number: this.formData.number,
              value: this.formData.value
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
        .delete(this.$baseUrl + this.deleteItemRequest, {
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
    }
  }
};
</script>
<style lang="scss">
@import '../../style/edifice.scss';
</style>
