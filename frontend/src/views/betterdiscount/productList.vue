<template>
  <div class="app-container">
    <div class="common-querytable-wrapper">
      <div class="queryform-wrapper">
        <div class="outside">
          <el-form class="basearea">
            <ul class="pull-left">
              <li>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">
                  新增
                </el-button>
              </li>
            </ul>
          </el-form>
          <ul class="operation-wrapper pull-right">
            <li>
              <div class="common-search-wrapper" @keyup.enter="search">
                <input v-model="queryModel.name" type="text" placeholder="请输入商品名称"/>
                <a>
                  <span @click="search" class="el-icon-search"></span>
                </a>
              </div>
            </li>
            <li>
              <el-button size="mini" class="expand el-icon-arrow-down" type="text" @click='expand'>高级搜索<i class=""></i>
              </el-button>
            </li>
          </ul>
        </div>
        <div class="expandarea" :class="{active:expandQuery}">
          <el-form ref="form" :model="queryModel" size="mini" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="商品类型：">
                  <el-select v-if="productTypeData.length>0" v-model="queryModel.type">
                    <el-option v-for="item in productTypeData" :key="item.type" :label="item.title"
                               :value="item.type"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品编号：">
                  <el-input v-model="queryModel.goodsNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">

              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23" pull-right>
                <el-form-item class="pull-right">
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="search" v-waves>搜索
                  </el-button>
                  <el-button type="primary" size="mini" icon="el-icon-refresh" @click="reset" v-waves>重置
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <el-table :data="tableData" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row :height="tableHeight">
      <el-table-column align="center" label='ID' width="100">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="商品编号" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.goodsNumber}}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="商品图片" width="150" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.image===null">默认图片未选择</div>
          <img v-else :src="scope.row.image+'-style_200x200'" width="80">
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品价格" width="100">
        <template slot-scope="scope">
          {{scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="折扣价" width="70">
        <template slot-scope="scope">
          {{scope.row.discountPrice}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券链接" width="150">
        <template slot-scope="scope">
          {{scope.row.coupons}}
        </template>
      </el-table-column>
      <el-table-column label="简介">
        <template slot-scope="scope">
          {{scope.row.summary}}
        </template>
      </el-table-column>
      <!--<el-table-column label="购买链接" width="150">-->
      <!--<template slot-scope="scope">-->
      <!--{{scope.row.buyUrl}}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="是否上架" width="90" align="center">
        <template slot-scope="scope">
          {{groundingStatusDictionary.filter(item=>item.code===scope.row.status)[0].name}}
        </template>
      </el-table-column>
      <el-table-column label="折扣有效时间范围" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.effectiveStartTime!==null">
            {{$moment(scope.row.effectiveStartTime).format('YYYY-MM-DD HH:mm:ss')}} ~
            <br/> {{$moment(scope.row.effectiveEndTime).format('YYYY-MM-DD HH:mm:ss')}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="170">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common-pagination-wrapper">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.page" :page-sizes="[10,20,30,50]" :page-size="pagination.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel" width="1200px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :rules="rules" ref="formData" :model="formData" label-position="right" label-width="120px">
            <el-form-item label="商品编号" prop="goodsNumber">
              <el-input v-model="formData.goodsNumber"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="detailImage">
              <div class="common-imguploadpreview-wrapper">
                <el-checkbox-group v-show="false" v-model="formData.detailImage">
                  <el-checkbox v-for='item in formData.detailImage' :key="item" :label="item"></el-checkbox>
                </el-checkbox-group>
                <div v-if="fileList.length===0">
                  暂无图片
                  <!--<img class="avatar" src="../../static/img/default/defaultavatar_60_60.png">-->
                </div>
                <div v-else v-for="(item, index) in formData.detailImage" class="image-item">
                  <span v-if="defaultImageIndex===index" class="check el-icon-circle-check"></span>
                  <img :src="item+'-style_100x100'" class="avatar"/>
                  <ul class="operator">
                    <li @click="setDefault(index)">
                      <a>设为默认</a>
                    </li>
                    <li>
                      <a class="el-icon-delete" @click="deleteImage(index)"></a>
                    </li>
                  </ul>
                </div>
                <el-upload ref="uploadAvatar"
                           :action="$prodBaseUrl+'image-upload-service/1.0.0/file/upload'" list-type="text"
                           :multiple="true"
                           :show-file-list="false" :before-upload="handleBeforeUpload" :on-preview="handlePreview"
                           :before-remove="handleRemove"
                           :on-success="uploadSuccess" :on-exceed="uploadAvatarExceeded" :file-list="fileList"
                           :data="portraitParams">

                  <el-button class="add" type="primary">上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件，且不超过10MB
                  </div>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="商品价格" prop="price">
              <el-input v-model.number="formData.price"></el-input>
            </el-form-item>
            <el-form-item label="折扣价" prop="discountPrice">
              <el-input v-model.number="formData.discountPrice"></el-input>
            </el-form-item>
            <el-form-item label="优惠券链接" prop="coupons">
              <el-input v-model="formData.coupons"></el-input>
            </el-form-item>
            <el-form-item label="购买链接" prop="buyUrl">
              <el-input v-model="formData.buyUrl"></el-input>
            </el-form-item>
            <el-form-item label="详情" prop="details" class="common-textareamedium-wrapper">
              <el-input type="textarea" v-model="formData.details"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="summary" class="common-textareamedium-wrapper">
              <el-input type="textarea" v-model="formData.summary"></el-input>
            </el-form-item>

            <el-form-item label="商品类型" prop="type">
              <el-select v-model="formData.type">
                <el-option v-for="item in productTypeData" :label="item.title" :value="item.type"
                           :key="item.type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否上架" prop="status">
              <el-select v-model="formData.status">
                <el-option v-for="item in groundingStatusDictionary" :label="item.name" :value="item.code"
                           :key="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="durationFlag" label="上架时间范围" prop="effectiveDuration">
              <el-date-picker v-model="effectiveDuration" type="datetimerange" :picker-options="pickerOptions2"
                              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" v-waves>{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="addGoods">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateGoods">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--  -->
  </div>

</template>

<script>

  import {
    getDiscountGoodsList
  }
    from '@/api/betterDiscount'

  export default {
    data() {
      let float = (rule, value, callback) => {
        console.log(value)
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.changePasswordFormData.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        categoryListRequest: 'better-discount-service/1.0.0/queryTitleTypeList',
        queryGoodsListRequest: 'better-discount-service/1.0.0/queryGoodsList',
        addGoodsRequest: 'better-discount-service/1.0.0/addGoods',
        updateGoodsContentRequest: 'better-discount-service/1.0.0/updateGoodsContent',
        deleteTitleTypeRequest: 'better-discount-service/1.0.0/deleteGoods',
        queryGoodsListByTypeRequest: 'better-discount-service/1.0.0/queryGoodsListByType',

        queryGoodsListAllRequest: 'better-discount-service/1.0.0/queryGoodsListAll',


        groundingStatusDictionary: [{
          name: '下架',
          code: '0'
        }, {
          name: '上架',
          code: '1'
        }],
        productTypeDictionary: [{
          name: '不可用',
          code: '0'
        }, {
          name: '可用',
          code: '1'
        }],
        value2: '',
        value1: '',
        tableKey: 0,
        tableData: null,
        total: null,
        listLoading: true,
        queryModel: {
          name: '',
          type:'',
          goodsNumber: null
        },
        pagination: {
          page: 1,
          size: 10,
        },
        fileList: [],
        productTypeData: [{
          name: '无数据',
          value: ''
        }],
        importanceOptions: [1, 2, 3],
        sortOptions: [{
          label: 'ID Ascending',
          key: '+id'
        }, {
          label: 'ID Descending',
          key: '-id'
        }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        formData: {
          id: null,
          goodsNumber: '',
          name: '',
          price: null,
          discountPrice: null,
          coupons: '',
          type: '',
          image: '',
          detailImage: [],
          details: '',
          summary: '',
          buyUrl: '',
          imageWidth: '',
          imageHigh: '',
          status: '',
          effectiveStartTime: '',
          effectiveEndTime: ''
        },
        effectiveDuration: [],
        defaultImageIndex: 0,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        searchTxt: '',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          name: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          goodsNumber: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          price: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }, {
            type: 'number',
            message: '必须为数字值'
          }],
          discountPrice: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }, {
            type: 'number',
            message: '必须为数字值'
          }],
          // {pattern: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/, message: '必须为数字值', trigger: 'change'}],
          detailImage: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }, {
            type: 'array',
            message: 'dsds'
          }],
          coupons: [{
            required: false,
            message: '此项为必填项',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          image: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          details: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          summary: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          buyUrl: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          imageWidth: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          imageHigh: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          status: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          effectiveStartTime: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          effectiveEndTime: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          effectiveDuration: [{
            required: false,
            message: '此项为必填项',
            trigger: 'change'
          }],

        },
        downloadLoading: false,
        durationFlag: false,
        expandQuery: false,

        portraitParams: {
          bucketName: 'funyvalley',
          folderName: 'icon'
        },

      }
    },
    computed: {
      tableHeight() {
        return this.$store.state.app.tableHeight
      }
    },
    watch: {
      effectiveDuration(value) {
        console.log(value)
        if (value === null) {
          value = [];
        }
        this.formData.effectiveStartTime = value[0];
        this.formData.effectiveEndTime = value[1];
      },
      'formData.status': function (value) {
        console.log(value)
        value === '0' ? this.durationFlag = false : this.durationFlag = true;
        this.formData.effectiveDuration = [];
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status]
      }
    },
    mounted() {
      this.getTableData();
      this.getProductTypeList();
    },
    methods: {
      getTableData() {
        this.listLoading = true;
        this.queryModel = Object.assign(this.queryModel, {
          pageNo: this.pagination.page - 1
        });
        this.$http.post(this.$baseUrl + this.queryGoodsListAllRequest, this.queryModel).then(response => {
          console.log(response)

          this.tableData = response.content;
          this.total = response.totalElements;
          this.listLoading = false
        }).catch(error => {
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      getProductTypeList() {
        this.$http.get(this.$baseUrl + this.categoryListRequest).then(response => {
          console.log(response);
          this.productTypeData = response;
        }).catch(error => {
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`)
        })
      },
      search() {
        if (this.queryModel.type !== null || this.queryModel.type !== '') {
          this.getTableData();
        }
      },
      reset() {
        this.queryModel.name = '';
        this.queryModel.type = '';
        this.queryModel.goodsNumber = '';
        this.pagination.page = 1;
        this.getTableData();
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
      updateShelfStatus(scope) {
        console.log(scope);
        //0下架 1上架
        this.$store.dispatch('updateShelfStatus', {
          id: scope.row.id,
          isShow: scope.row.isShow
        });
      },
      resetTemp() {
        this.formData = {
          id: null,
          name: '',
          note: '',
          startDate: null,
          endDate: null,
          iconPath: ''
        };
        this.effectiveDuration = [];
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      addGoods() {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.addGoodsRequest + `/${this.$store.state.user.login_id}`, {
              id: '',
              "goodsNumber": this.formData.goodsNumber,
              "name": this.formData.name,
              "price": Number(this.formData.price).toFixed(2),
              "discountPrice": Number(this.formData.discountPrice).toFixed(2),
              "coupons": this.formData.coupons,
              "type": this.formData.type,
              detailImage: this.formData.detailImage.join(','),
              "details": this.formData.details,
              "summary": this.formData.summary,
              "buyUrl": this.formData.buyUrl,
              "image": this.formData.image,
              "imageWidth": this.formData.imageWidth,
              "imageHigh": this.formData.imageHigh,
              "status": this.formData.status,
              effectiveStartTime: this.formData.effectiveStartTime,
              effectiveEndTime: this.formData.effectiveEndTime
            }).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.getTableData();
                this.resetForm();
                console.log(response)
                this.$message.success('商品添加成功');
                this.dialogFormVisible = false;
              } else {
                this.$message.error(response.message)
              }
            })
          }
        })
      },
      handleUpdate(scope) {
        console.log(scope)
        scope.row.price = Number(scope.row.price);
        scope.row.discountPrice = Number(scope.row.discountPrice);
        scope.row.discountPrice = Number(scope.row.discountPrice);

        this.formData = Object.assign({}, scope.row);
        this.formData.timestamp = new Date(this.formData.timestamp);
        this.effectiveDuration = [scope.row.effectiveStartTime, scope.row.effectiveEndTime];

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;

        this.fileList = [];
        this.formData.detailImage = [];
        if ((scope.row.detailImage === null || scope.row.detailImage === []) && (scope.row.image !== null || scope.row.image !== '')) {
          this.formData.detailImage.push(scope.row.image)
          this.fileList.push({
            name: 0,
            url: scope.row.image
          })
        } else {
          scope.row.detailImage.split(',').forEach((item, index) => {
            this.formData.detailImage.push(item);
            this.fileList.push({
              name: index,
              url: item
            })
          });
        }

        this.formData.detailImage.forEach((item, index) => {
          if (item === this.formData.image) {
            this.defaultImageIndex = index;
          }
        });


        console.log(this.fileList)

        this.$nextTick(() => {
          this.$refs['formData'].clearValidate()
        })
      },
      updateGoods() {
        console.log(this.formData)
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.formData.image = this.formData.detailImage[this.defaultImageIndex];
            this.$http.post(this.$baseUrl + this.updateGoodsContentRequest + `/${this.$store.state.user.login_id}`, {
              id: this.formData.id,
              goodsNumber: this.formData.goodsNumber,
              name: this.formData.name,
              price: Number(this.formData.price).toFixed(2),
              discountPrice: Number(this.formData.discountPrice).toFixed(2),
              detailImage: this.formData.detailImage.join(','),
              coupons: this.formData.coupons,
              type: this.formData.type,
              details: this.formData.details,
              summary: this.formData.summary,
              buyUrl: this.formData.buyUrl,
              image: this.formData.image,
              imageWidth: this.formData.imageWidth,
              imageHigh: this.formData.imageHigh,
              status: this.formData.status,
              effectiveStartTime: this.formData.effectiveStartTime,
              effectiveEndTime: this.formData.effectiveEndTime
            }).then(response => {
              if (response.code === 200) {
                this.getTableData();
                this.resetForm();
                console.log(response)
                this.$message.success('产品信息更新成功');
                this.dialogFormVisible = false;
              } else {
                this.$message.error(response.message)
              }
            }).catch(error => {
              console.log(error)
              this.$message.error(error)
            })
          }
        })

      },
      handleDelete(scope) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(this.$baseUrl + this.deleteTitleTypeRequest + `/${scope.row.goodsNumber}`, {
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.user.token
            }
          }).then((response) => {
            console.log(response)
            this.dialogFormVisible = false;
            this.$message.success('删除成功');
            this.getTableData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      changeUpload(file) {
        console.log(file)
      },
      add() {
        this.dialogFormVisible = true;
        this.dialogStatus = 'create';
      },
      expand() {
        this.expandQuery = !this.expandQuery;
      },
      handleBeforeUpload(file) {
        console.log(file)
        this.loading = true;
      },
      handlePreview(file) {
        console.log(file);
      },
      handleRemove(file, fileList) {
        console.log(file)
        console.log(fileList)

        let index = null;
        fileList.forEach((item, index2) => {
          if (file.uid === item) {
            index = index2;
          }
        });
        this.formData.detailImage.splice(index, 1);
        this.formData.detailImage.forEach((item, index) => {
          if (item === this.formData.image) {
            this.formData.image = item;
          }
        });
        this.fileList = this.fileList.filter(item => item.uid !== file.uid);
        console.log(this.formData.detailImage)
      },
      uploadSuccess(response, file, fileList) {
        this.loading = false;
        console.log(file)
        console.log(response)
        console.log(6, fileList)


        this.fileList.push(response);
        console.log(this.formData)
        this.formData.detailImage.push(response.url);
        if (this.formData.image === '') {
          this.formData.image = this.formData.detailImage[0];
        }
        console.log(fileList)
        // this.formData.detailImage.forEach((item, index) => {
        //   if (item.url === this.formData.image) {
        //     this.formData.detailImage.splice(index, 1)
        //   }
        // });

        this.loading = false;
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
      },
      uploadAvatarExceeded(files, fileList) {

      },
      cancel() {
        this.dialogFormVisible = false;
        this.resetForm();
      },
      resetForm() {
        this.formData = {
          "goodsNumber": '',
          "name": '',
          "price": '',
          "discountPrice": '',
          "coupons": '',
          "type": '',
          "image": '',
          "details": '',
          "summary": '',
          "buyUrl": '',
          "imageWidth": '',
          "imageHigh": '',
          "status": '',
          detailImage: [],
          effectiveEndTime: '',
          effectiveStartTime: ''
        };
        this.$nextTick(() => {
          this.$refs.formData.clearValidate();
        })
      },
      deleteAvatar() {

      },
      setDefault(index) {
        this.defaultImageIndex = index;
        this.formData.image = this.formData.detailImage[index];

      },
      // setDefault(index) {
      //   let formData = this.formData.detailImage[index];
      //   if (this.formData.image !== null && this.formData.image !== undefined && this.formData.image.length > 0) {
      //     this.formData.detailImage.splice(index, 1, this.formData.image);
      //   }
      //   this.formData.image = formData;
      // },
      deleteImage(index) {
        this.formData.detailImage.splice(index, 1);
        this.defaultImageIndex = this.defaultImageIndex - 1 >= 0 ? this.defaultImageIndex - 1 : 0;
        this.fileList.splice(index, 1);
      }
    }
  }

</script>
