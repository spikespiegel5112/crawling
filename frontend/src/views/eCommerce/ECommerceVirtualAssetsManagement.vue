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
          <input v-model="queryModel.virtualName" type="text" placeholder="请输入资产名称"/>
          <a>
            <span @click="search" class="el-icon-search"></span>
          </a>
        </div>
      </template>
    </CommonQuery>

    <el-table :data="tableList" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row :height="tableHeight">
      <el-table-column label="No" type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column label="虚拟资产Type" align="center" prop="assetType"></el-table-column>
      <el-table-column label="虚拟资产Key" align="center" prop="assetKey"></el-table-column>
      <el-table-column label="虚拟资产Value" align="center" prop="assetValue"></el-table-column>
      <el-table-column label="虚拟资产描述" align="center" prop="describe"></el-table-column>

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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData"
                   label-position="right"
                   label-width="140px">
            <el-form-item label="虚拟资产Type" prop="assetType">
              <el-input v-model="formData.assetType"></el-input>
            </el-form-item>
            <el-form-item label="虚拟资产Key" prop="assetKey">
              <el-input v-model="formData.assetKey"></el-input>
            </el-form-item>
            <el-form-item label="虚拟资产Value" prop="assetValue">
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.assetValue"></el-input>
            </el-form-item>
            <el-form-item label="虚拟资产描述" prop="describe">
              <el-input v-model="formData.describe"></el-input>
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
  import CommonQuery from '@/views/common/CommonQuery.vue'

  export default {
    components: {
      CommonQuery,
    },
    data() {
      return {
        virtualAssetListRequest: 'asset-service/1.0.0/virtualAsset/list',
        addOrUpdateVirtualAssetRequest: 'asset-service/1.0.0/virtualAsset/addOrUpdate',
        deleteVirtualAssetRequest: 'asset-service/1.0.0/virtualAsset/delete',

        listLoading: false,
        tableKey: 0,
        tableList: [],
        total: null,
        queryModel: {
          virtualName: '',
        },
        chosenVirtualAssetInfo: {},
        virtualAssetQueryModel: {
          virtualName: ''
        },
        pagination: {
          page: 1,
          size: 20,
          // limit: 20,
        },
        virtualAssetPagination: {
          page: 1,
          size: 20,
        },
        formData: {
          "id": "",
          "assetType": "",
          "assetKey": "",
          "assetValue": "",
          "describe": ""
        },
        rules: {
          "assetType": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "assetKey": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "assetValue": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "describe": [{required: true, message: '此项为必填项', trigger: 'change'}],
        },
        skuRules:{
          "k": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "v": [{required: false, message: '此项为必填项', trigger: 'change'}],
        },
        skuPropertiesListFormData: [{
          "k": "",
          "v": ""
        }],
        skuVirtualPropertyForm: [],

        skuTypeDictionary: [{
          name: '普通商品',
          code: 'ordinary'
        }, {
          name: '虚拟商品',
          code: 'virtual'
        }],
        temporaryExcel: '',
        dailyLimitMode: '',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        importExcelFlag: false,
        modifySkuVirtualPropertyFlag: false,
        expandQuery: '',
        currentSortData: [],
        effectiveDuration: [],
        skuVirtualListFormData: [{
          "k": "",
          "v": ""
        }],
        currentSkuNo: '',
        virtualAssetList: [],
        addVirtualAssetFlag: false,
        // skuVirtualListFormData:[]
        editingVirtualAssetIndex: null,
        temporaryEditingSkuData:{},
        // currentEditingSkuVirtualPropertyForm:{
        //   k:'',
        //   v:''
        // },
      }
    },
    computed: {
      tableHeight() {
        return this.$store.state.app.tableHeight;
      },

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
      skuPropertiesListFormData(value) {
        console.log(value)
        this.formData.skuPropertiesList = value;
      }
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, this.pagination);
        this.$http.get(this.$baseUrl + this.virtualAssetListRequest, {
          params: this.queryModel
        }).then(response => {
          console.log(response)

          this.tableList = response.list;
          this.total = response.total;
          this.listLoading = false;
        }).catch(error => {
          console.log(error)
        })
      },
      getActivityList() {
        this.listLoading = true;
        this.$http.get(this.$baseUrl + this.queryRotaryTableActivityListRequest).then(response => {
          console.log(response)

          this.activityList = response.data;
          this.formData.activityId = response.data[0].id;
          this.total = response.total;
          this.listLoading = false
          this.getTableData();

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
        this.formData = Object.assign(this.formData, {
          "id": "",
          "assetType": "",
          "assetKey": "",
          "assetValue": "",
          "describe": ""
        });
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
      createData() {
        this.formData.id = '';
        this.updateData();
      },
      handleSkuVirtualPropertyUpdate(scope) {
        console.log('handleSkuVirtualPropertyUpdate', scope)
        this.currentSkuNo = scope.row.skuNo;
        // this.formData = Object.assign({}, {
        //   id: scope.row.id,
        //   "skuNo": scope.row.skuNo,
        //   "price": scope.row.price,
        //   "originPrice": scope.row.originPrice,
        //   "costPrice": scope.row.costPrice,
        //   "quantity": scope.row.quantity,
        //   "weight": scope.row.weight,
        //   "picUrl": scope.row.picUrl,
        //   "extraProp": scope.row.extraProp,
        //   "skuType": scope.row.skuType,
        //   "coinOnly": scope.row.coinOnly,
        //   "skuPropertiesList": scope.row.skuPropertiesList,
        // });
        if (scope.row.skuVirtualList.length > 0) {
          this.skuVirtualListFormData = scope.row.skuVirtualList;
        }
        this.chosenReward = scope.row.rewardName;

        this.dialogStatus = 'update';
        this.modifySkuVirtualPropertyFlag = true;
        this.$nextTick(() => {
          // this.$refs['skuVirtualPropertyForm'].forEach((item, index) => {
          //   this.$refs['skuVirtualPropertyForm'][index].clearValidate()
          // })
        })
      },
      handleUpdate(scope) {
        console.log('handleUpdate', scope)
        this.formData = Object.assign({}, {
          id: scope.row.id,
          "assetType": scope.row.assetType,
          "assetKey": scope.row.assetKey,
          "assetValue": scope.row.assetValue,
          "describe": scope.row.describe,
        });
        this.skuPropertiesListFormData = scope.row.skuPropertiesList;
        this.chosenReward = scope.row.rewardName;

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateData() {
        let params = {};
        if (this.dialogStatus === 'create') {
          // delete this.formData.skuNo;
        } else {
          params = this.formData;
        }
        // this.formData = Object.assign(this.formData, this.skuPropertiesListFormData)

        console.log(params)
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.addOrUpdateVirtualAssetRequest, this.formData, {}).then(response => {
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
          this.$http.delete(this.$baseUrl + this.deleteVirtualAssetRequest + `/${scope.row.id}`).then((response) => {
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

      // uploadSuccess1(response) {
      //   console.log(response)
      //   this.formData.icon = response.url;
      // },
      uploadSuccess1(response, file, fileList) {
        this.loading = false;
        this.formData.picUrl = response.url;
      },
      uploadSuccess2(response) {
        this.$message.success('Excel上传成功');
      },
      addInputItem1() {
        this.skuPropertiesListFormData.push({
          k: '',
          v: ''
        })
      },
      minusInputItem1(index) {
        this.skuPropertiesListFormData.splice(index, 1)
      },
      addInputItem2() {
        this.skuVirtualListFormData.push({
          k: '',
          v: ''
        })
      },
      minusInputItem2(index) {
        this.skuVirtualListFormData.splice(index, 1)
      },

      chooseVirtualAsset(data) {
        this.chosenVirtualAssetInfo = data;
      },
      focusSortList(queryString, callback) {
        console.log(queryString)
        this.loading = true;
        console.log(this.virtualAssetQueryModel)

        this.virtualAssetQueryModel = Object.assign({
          virtualName: queryString
        }, this.virtualAssetPagination);
        this.$http.get(this.$baseUrl + this.virtualAssetRequest, {
          params: this.virtualAssetQueryModel
        }).then(response => {
          console.log(response)
          this.loading = false;
          let result = [];
          if (response.list.length !== 0) {
            response.list.forEach((item, index) => {
              result.push(Object.assign(item, {
                name: item.assetKey,
                value: item.assetKey
              }));
            });
            // response.list.forEach(item1 => {
            //   result = result.filter(item2 => item1.describe !== item2.describe)
            // });
            console.log(result)

            callback(result)
          }

        })
      },
      editVirtualAsset(index) {
        this.addVirtualAssetFlag = true;
        this.editingVirtualAssetIndex = index;
        this.temporaryEditingSkuData={
          k: this.skuVirtualListFormData[this.editingVirtualAssetIndex].k,
          v: this.skuVirtualListFormData[this.editingVirtualAssetIndex].v
        };
        // this.chosenVirtualAssetInfo = {
        //   assetKey: this.skuVirtualListFormData[index].k,
        //   value: this.skuVirtualListFormData[index].v
        // }
      },
      saveVirtualAsset() {
        console.log(this.$refs['skuVirtualPropertyForm'][this.editingVirtualAssetIndex])
        this.$refs['skuVirtualPropertyForm'][this.editingVirtualAssetIndex].validate(valid=>{
          debugger
          if(valid){
            console.log(this.chosenVirtualAssetInfo)
            // let params = {
            //   k: this.chosenVirtualAssetInfo.assetKey,
            //   v: this.chosenVirtualAssetInfo.value
            // };
            let params = {
              k: this.skuVirtualListFormData[this.editingVirtualAssetIndex].k,
              v: this.skuVirtualListFormData[this.editingVirtualAssetIndex].v
            };
            this.$http.post(this.$baseUrl + this.addOrUpdateSku_virtualRequest + `/${this.currentSkuNo}`, params, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              transformRequest: [function (data) {
                let ret = '';
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
              }]
            }).then(response => {
              console.log(response)
              this.addVirtualAssetFlag = false;
              this.editingVirtualAssetFlag=false
            })
          }
        })
      },
      cancelEditVirtualAsset(){
        this.addVirtualAssetFlag = false;
        this.skuVirtualListFormData[this.editingVirtualAssetIndex]=this.temporaryEditingSkuData;
      },
      closeEditVirtualProperty() {
        this.modifySkuVirtualPropertyFlag = false;
        this.editingVirtualAssetIndex = null;
        this.skuVirtualListFormData.forEach((item, index)=>{
          if(item.k===''||item.v<1){
            this.skuVirtualListFormData.splice(index)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  /*@import '../../styles/edifice.scss';*/

</style>
