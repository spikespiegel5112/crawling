<
<template>
  <el-row class="app-container">
    <CommonQuery>
      <template slot="button1">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>
          新增
        </el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="importExcelFlag=true" v-waves>
          导入Excel
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
              :height="tableHeight">
      <el-table-column label="No" type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column label="SKU唯一标识" align="center" prop="skuNo"></el-table-column>
      <el-table-column label="奖品数量" align="center" prop="costPrice"></el-table-column>
      <el-table-column label="额外属性" align="center" prop="extraProp"></el-table-column>
      <el-table-column label="原价" align="center" prop="originPrice"></el-table-column>
      <el-table-column label="主图片地址" align="center" prop="picUrl"></el-table-column>
      <el-table-column label="奖品数量" align="center" prop="price"></el-table-column>
      <el-table-column label="中奖率" align="center" prop="originPrice"></el-table-column>
      <el-table-column label="奖品ID" align="center" prop="quantity"></el-table-column>
      <el-table-column label="商品类型" align="center" prop="skuType"></el-table-column>
      <!--<el-table-column label="奖品名称" align="center" prop="soldNum"></el-table-column>-->
      <el-table-column label="重量" align="center" prop="weight"></el-table-column>
      <el-table-column label="是否用趣豆购买" align="center" prop="coinOnly">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.coinOnly"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          >
          </el-switch>
        </template>
      </el-table-column>
      <!--<el-table-column label="奖品名称" align="center" prop="withHoldQuantity"></el-table-column>-->
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
          <el-button type="primary" size="mini" @click="handleSkuVirtualPropertyUpdate(scope)">编辑虚拟SKU</el-button>
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
                     :page-size="pagination.limit"
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
            <el-form-item label="skuNo" prop="skuNo">
              <el-input v-model="formData.skuNo" :disabled="dialogStatus!=='create'"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="formData.price"></el-input>
            </el-form-item>
            <el-form-item label="划线价格(原价)" prop="originPrice">
              <el-input v-model.number="formData.originPrice"></el-input>
            </el-form-item>
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model.number="formData.costPrice"></el-input>
            </el-form-item>
            <el-form-item label="库存数量" prop="quantity">
              <el-input-number v-model.number="formData.quantity" :min="0" label="库存数量"></el-input-number>
            </el-form-item>
            <el-form-item label="重量" prop="weight">
              <el-input-number v-model.number="formData.weight" :min="0" label="重量"></el-input-number>
            </el-form-item>
            <el-form-item label="主图片地址" prop="picUrl">
              <CommonUploadImage
                :action="$baseUrl+'image-upload-service/1.0.0/file/upload'"
                @on-success="uploadSuccess1"
                :returnUrlList.sync="formData.picUrl"
                fileType="image"
              />
              <el-input v-show="false" v-model="formData.picUrl"></el-input>
            </el-form-item>
            <el-form-item label="额外属性" prop="extraProp">
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.extraProp"></el-input>
            </el-form-item>
            <el-form-item label="商品类型" prop="skuType">
              <el-select v-model="formData.skuType" placeholder="请选择">
                <el-option v-for="item in skuTypeDictionary" :label="item.name" :value="item.code"
                           :key="item.code"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否允许趣豆购买方式" prop="coinOnly">
              <el-switch v-model="formData.coinOnly"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>

            <el-form-item class="common_dynamicinput_wrapper" label="sku规格" prop="skuPropertiesList">
              <el-row class="row" v-for="(item, index) in skuPropertiesListFormData" :key="index">
                <el-col :span="10">
                  <el-input placeholder="请输入内容" v-model="skuPropertiesListFormData[index].k">
                    <template slot="prepend">key</template>
                  </el-input>
                </el-col>
                <el-col :span="2" :style="{textAlign:'center'}">-</el-col>
                <el-col :span="10">
                  <el-input placeholder="请输入内容" v-model="skuPropertiesListFormData[index].v">
                    <template slot="prepend">value</template>
                  </el-input>
                </el-col>
                <el-col :span="2" :style="{textAlign:'center'}">
                  <el-button type="danger" size="mini" icon="el-icon-minus" circle
                             @click="minusInputItem1(index)"></el-button>
                </el-col>
                <!--<el-col v-else :span="2" :style="{textAlign:'center'}">-->
                  <!--<el-button type="success" size="mini" icon="el-icon-plus" circle @click="addInputItem1"></el-button>-->
                <!--</el-col>-->

              </el-row>
              <el-row justify="center">
                <el-col class="add_wrapper" :span="24">
                  <el-button class="add" type="success" size="mini" icon="el-icon-plus" circle @click="addInputItem1"></el-button>

                </el-col>
              </el-row>

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
    <!-- 修改SKU虚拟权益 -->
    <el-dialog title="修改SKU虚拟权益" :visible.sync="modifySkuVirtualPropertyFlag" width='width: 400px;'>
      <el-row type="flex" justify="center">
        <el-col class="common_dynamicinput_wrapper" :span="20">
          <el-form v-for="(item, index) in skuVirtualListFormData" :key="index" :rules="skuRules"
                   ref="skuVirtualPropertyForm" :model="temporaryEditingSkuData"
                   label-position="right"
                   label-width="140px">
            <el-form-item label="sku规格" prop="skuPropertiesList">
              <el-row>
                <el-col :span="9">
                  <el-form-item prop="k">
                    <el-autocomplete
                      v-model="skuVirtualListFormData[index].k"
                      :fetch-suggestions="focusSortList"
                      placeholder="请输入内容"
                      @select="chooseVirtualAsset"
                      :disabled="editingVirtualAssetIndex!==index||!addVirtualAssetFlag"
                    >
                      <template slot="prepend">key</template>
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="2" :style="{textAlign:'center'}">-</el-col>
                <el-col :span="9">
                  <el-form-item prop="k">
                    <el-input-number v-model.number="skuVirtualListFormData[index].v" :min="0" label="库存数量" controls-position="right" :disabled="editingVirtualAssetIndex!==index||!addVirtualAssetFlag"
                    >
                      <template slot="prepend">value</template>
                    </el-input-number>
                    <!--<el-input placeholder="请输入内容" v-model="skuVirtualListFormData[index].v">-->
                    <!--</el-input>-->
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <div v-if="editingVirtualAssetIndex===index&&addVirtualAssetFlag">
                    <el-button type="text" icon="el-icon-close" @click="cancelEditVirtualAsset"></el-button>
                    <el-button type="text" icon="el-icon-check" @click="saveVirtualAsset"></el-button>
                  </div>
                  <div v-else>
                    <el-button type="text" icon="el-icon-edit-outline" @click="editVirtualAsset(index)"></el-button>
                  </div>
                </el-col>
                <el-col :span="2" :style="{textAlign:'center'}">
                  <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="minusInputItem2(index)"
                             :disabled="addVirtualAssetFlag"></el-button>
                </el-col>
              </el-row>

            </el-form-item>

          </el-form>
          <el-row justify="center">
            <el-col class="add_wrapper" :span="24">
              <el-button class="add" type="success" size="mini" icon="el-icon-plus" circle @click="addInputItem2"></el-button>

            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditVirtualProperty" v-waves>关闭</el-button>
        <!--<el-button type="primary" @click="modifySkuVirtualProperty" v-waves>{{$t('table.confirm')}}</el-button>-->
      </div>
    </el-dialog>
    <!-- 导入excel -->
    <el-dialog title="导入Excel" :visible.sync="importExcelFlag" width='width: 400px;'>
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <CommonUploadImage
            :action="$baseUrl+importExcelRequest"
            @on-success="uploadSuccess2"
            fileType="excel"
            :returnUrlList.sync="temporaryExcel"
            :headers="{
              'Authorization':'Bearer '+$store.state.app.accessToken
            }"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importExcelFlag = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData" v-waves>{{$t('table.confirm')}}
        </el-button>
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
        skuListRequest: 'item-service/1.0.0/sku/list',
        addOrUpdateSkuRequest: 'item-service/1.0.0/sku/addOrUpdate',
        deleteSkuRequest: 'item-service/1.0.0/sku',
        importExcelRequest: 'item-service/1.0.0/sku/importExcel',
        addOrUpdateSku_virtualRequest: 'item-service/1.0.0/sku_virtual/addOrUpdate',
        virtualAssetRequest: 'asset-service/1.0.0/virtualAsset/list',

        listLoading: false,
        tableKey: 0,
        tableList: [],
        total: null,
        queryModel: {
          itemNo: '',
          title: '',
          alias: '',
          itemType: '',
          isListing: '',
          isLock: '',
        },
        chosenVirtualAssetInfo: {},
        virtualAssetQueryModel: {
          virtualName: ''
        },
        pagination: {
          page: 1,
          // size: 20,
          limit: 20,
        },
        virtualAssetPagination: {
          page: 1,
          size: 20,
        },
        formData: {
          "skuNo": "",
          "price": null,
          "originPrice": null,
          "costPrice": null,
          "quantity": null,
          "weight": null,
          "picUrl": "",
          "extraProp": "",
          "skuType": "",
          "coinOnly": false,
          "skuPropertiesList": [{
            "k": "",
            "v": ""
          }]
        },
        rules: {
          "skuNo": [{required: false, message: '此项为必填项', trigger: 'change'}],
          "price": [{required: true, message: '此项为必填项', trigger: 'change'},
            {type: 'number', message: '必须为数字值', trigger: "change"}],
          "originPrice": [{required: true, message: '此项为必填项', trigger: 'change'},
            {type: 'number', message: '必须为数字值', trigger: "change"}],
          "costPrice": [{required: true, message: '此项为必填项', trigger: 'change'},
            {type: 'number', message: '必须为数字值', trigger: "change"}],
          "quantity": [{required: true, message: '此项为必填项', trigger: 'change'},
            {type: 'number', message: '必须为数字值', trigger: "change"}],
          "weight": [{required: true, message: '此项为必填项', trigger: 'change'},
            {type: 'number', message: '必须为数字值', trigger: "change"}],
          "picUrl": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "extraProp": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "skuType": [{required: true, message: '此项为必填项', trigger: 'change'}],
          "coinOnly": [{required: true, message: '此项为必填项', trigger: 'change'}],
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
        this.$http.get(this.$baseUrl + this.skuListRequest, {
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
        this.pagination.limit = val;
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.pagination.page = val;
        this.getTableData()
      },
      resetTemp() {
        this.formData = Object.assign(this.formData, {
          id: '',
          "skuNo": "",
          "price": null,
          "originPrice": null,
          "costPrice": null,
          "quantity": null,
          "weight": null,
          "picUrl": "",
          "extraProp": "",
          "skuType": "",
          "coinOnly": false,
          "skuPropertiesList": [{
            // id: '',
            "k": "",
            "v": ""
          }]
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
        // this.formData.id = '';
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
          "skuNo": scope.row.skuNo,
          "price": scope.row.price,
          "originPrice": scope.row.originPrice,
          "costPrice": scope.row.costPrice,
          "quantity": scope.row.quantity,
          "weight": scope.row.weight,
          "picUrl": scope.row.picUrl,
          "extraProp": scope.row.extraProp,
          "skuType": scope.row.skuType,
          "coinOnly": scope.row.coinOnly,
          "skuPropertiesList": scope.row.skuPropertiesList,
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
            this.$http.post(this.$baseUrl + this.addOrUpdateSkuRequest, this.formData, {}).then(response => {
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
          this.$http.delete(this.$baseUrl + this.deleteSkuRequest + `/${scope.row.id}`).then((response) => {
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
