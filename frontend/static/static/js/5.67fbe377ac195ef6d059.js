(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"02K0":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.default={name:"CommonQuery",props:{queryModel:{type:Object,default:function e(){return{}}},expandQuery:{type:Object,default:function e(){return{}}},expand:{type:Boolean,default:false}},data:function e(){return{expandFlag:false}},watch:{queryModel:function e(){},expand:function e(t){this.expandFlag=t}},methods:{search:function e(){},reset:function e(){this.$emit("reset")},handleExpand:function e(){this.expandFlag=!this.expandFlag;console.log(this.expandFlag)}}}},EDYP:function(e,t,a){"use strict";var n=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("div",{staticClass:"common_querytable_wrapper"},[a("div",{staticClass:"queryform_wrapper"},[a("div",{staticClass:"outside"},[a("el-form",{staticClass:"basearea"},[a("ul",{staticClass:"pull-left"},[a("li",[e._t("button1")],2)])]),e._v(" "),a("ul",{staticClass:"operation_wrapper pull-right"},[a("li",[e._t("query1")],2),e._v(" "),a("li",[e._t("query2")],2),e._v(" "),a("li",[e._t("query3")],2),e._v(" "),e.expand?a("li",[a("el-button",{staticClass:"expand",attrs:{size:"mini",type:"text"},on:{click:e.handleExpand}},[e._v("高级搜索"),a("i",{staticClass:"el-icon-arrow-down"})])],1):e._e()])],1),e._v(" "),a("div",{staticClass:"expandarea",class:{active:e.expandFlag}},[a("el-form",{ref:"form",attrs:{model:e.queryModel,size:"mini","label-width":"100px"}},[a("el-row",[a("el-col",{attrs:{span:8}},[e._t("query4")],2),e._v(" "),a("el-col",{attrs:{span:8}}),e._v(" "),a("el-col",{attrs:{span:8}})],1),e._v(" "),a("el-row",[a("el-col",{attrs:{span:8}}),e._v(" "),a("el-col",{attrs:{span:8}}),e._v(" "),a("el-col",{attrs:{span:8}})],1),e._v(" "),a("el-row",[a("el-col",{attrs:{span:23,"pull-right":""}},[a("el-form-item",{staticClass:"pull-right"},[a("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-search"},on:{click:e.search}},[e._v("搜索\n              ")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-refresh"},on:{click:e.reset}},[e._v("重置\n              ")])],1)],1)],1)],1)],1)])])};var r=[];n._withStripped=true;a.d(t,"a",function(){return n});a.d(t,"b",function(){return r})},FYXw:function(e,t,a){"use strict";a.r(t);var n=a("QUf0");var r=a("Iho7");for(var i in r)if(i!=="default")(function(e){a.d(t,e,function(){return r[e]})})(i);var o=a("f6oM");var l=a("KHd+");var s=Object(l["a"])(r["default"],n["a"],n["b"],false,null,null,null);if(false){var u}s.options.__file="src/views/settings/Headers.vue";t["default"]=s.exports},FnDH:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});var n=a("gDS+");var r=v(n);var i=a("4d7F");var o=v(i);var l=a("P2sY");var s=v(l);var u=a("14Xm");var c=v(u);var d=a("D3Ub");var f=v(d);var p=a("qPSc");var m=v(p);var h=a("O4qd");var g=v(h);function v(e){return e&&e.__esModule?e:{default:e}}t.default={components:{CommonTag:m.default,CommonQuery:g.default},data:function e(){var a=this;return{getListRequest:"headerSettings/getList",createOrUpdateRequest:"headerSettings/createOrUpdate",deleteHeaderRequest:"headerSettings/deleteHeader",getDictionaryListRequest:"dictionary/getList",tableList:[],total:null,listLoading:true,queryModel:{sort:"desc",brandName:""},pagination:{page:1,limit:50},sortOptions:[{label:"ID Ascending",key:"+id"},{label:"ID Descending",key:"-id"}],formData:{headerId:"",name:"",type:"",headerKeyName:"",headerValueName:""},dialogFormVisible:false,dialogStatus:"",textMap:{update:"Edit",create:"Create"},dialogPvVisible:false,currentEditingCrawlerId:"",currentEditingCrawlerCode:"",rules:{headerId:[{required:true,message:"此项为必填项",trigger:"change"}],name:[{required:true,message:"此项为必填项",trigger:"change"}],type:[{required:true,message:"此项为必填项",trigger:"change"}],headerKeyName:[{required:true,message:"此项为必填项",trigger:"change"}],headerValueName:[{required:true,message:"此项为必填项",trigger:"change"}]},typeList:[],pickerOptions1:{disabledDate:function e(t){return t.getTime()<a.value1}},fileList:[],portraitParams:{bucketName:"funyvalley",folderName:"icon"},expandQuery:""}},computed:{tableHeight:function e(){return this.$store.state.app.tableHeight},dictionaryList:function e(){return this.$store.state.app.dictionary}},watch:{effectiveDuration:function e(t){console.log(t);if(t===null){t=[]}this.formData.startDate=this.$moment(t[0]).format("YYYY-MM-DD");this.formData.endDate=this.$moment(t[1]).format("YYYY-MM-DD")},currentAdvertisementTabIndex:function e(t){console.log(t)}},mounted:function e(){var a=this;return(0,f.default)(c.default.mark(function e(){return c.default.wrap(function e(t){while(1){switch(t.prev=t.next){case 0:t.t0=a.$store;t.next=3;return a.getDictionaryList();case 3:t.t1=t.sent;t.t2={crawler:t.t1};t.t0.commit.call(t.t0,"updateDictionary",t.t2);a.getTableData();console.log(a.dictionaryList);case 8:case"end":return t.stop()}}},e,a)}))()},methods:{getTableData:function e(){var t=this;this.listLoading=true;this.queryModel=(0,s.default)(this.queryModel,this.pagination);this.$http.get(this.$baseUrl+this.getListRequest,{params:this.queryModel}).then(function(e){console.log("getListByPaginationRequest",e);t.tableList=e.data;t.total=e.pagination.total;t.listLoading=false})},getDictionaryList:function e(){var n=this;return new o.default(function(t,a){n.$http.get(n.$baseUrl+n.getDictionaryListRequest,{params:{typeCode:"crawler"}}).then(function(e){t(e.data)}).catch(function(e){console.log(e);a(e)})})},getCrawlerType:function e(t){return this.$store.state.app.dictionary["crawler"].filter(function(e){return e.code===t.row.type})},handleFilter:function e(){this.pagination.page=1;this.getTableData()},handleSizeChange:function e(t){this.pagination.limit=t;this.getTableData()},handleCurrentChange:function e(t){this.pagination.page=t;this.getTableData()},resetTemp:function e(){this.formData={id:"",description:"",rewardImage:"",rewardName:"",rewardPrompt:"",rewardStr:"",rewardType:"",rewardValue:"",status:""}},createData:function e(){this.dialogFormVisible=true;this.formData.headerId="";this.resetTemp()},handleUpdate:function e(t){var a=this;console.log(t);this.formData=(0,s.default)({},t.row);this.dialogStatus="update";this.dialogFormVisible=true;this.$nextTick(function(){a.$refs["formData"].clearValidate()})},updateData:function e(){var t=this;this.$refs["formData"].validate(function(e){if(e){t.commitUpdate()}})},handleChangeCralerType:function e(t){this.currentEditingCrawlerId=t.row.headerId;this.formData=(0,s.default)({},t.row)},saveHeaderTypes:function e(){this.commitUpdate();this.currentEditingCrawlerId=""},commitUpdate:function e(){var t=this;this.$http.post(this.$baseUrl+this.createOrUpdateRequest,{headerId:this.formData.headerId,name:this.formData.name,type:(0,r.default)(this.formData.type),headerKeyName:this.formData.headerKeyName,headerValueName:this.formData.headerValueName}).then(function(e){console.log(e);t.dialogFormVisible=false;t.$message.success("信息修改成功");t.getTableData()}).catch(function(e){console.log(e);t.$message.error(e.response.status.toString()+"  "+e.response.data.error)})},handleSelectionChange:function e(t){this.multipleSelection=t;console.log(t)},handleMultipleDelete:function e(){var t=this;this.$confirm("确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.deleteRecord(t.multipleSelection.map(function(e){return e.id}))}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},handleDelete:function e(t){var a=this;console.log(t);this.$confirm("确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.deleteRecord([t.row.id])}).catch(function(){a.$message({type:"info",message:"已取消删除"})})},deleteRecord:function e(t){var a=this;this.$http.delete(this.$baseUrl+this.deleteRecordRequest,{data:{id:t}}).then(function(e){console.log(e);a.dialogFormVisible=false;a.$message.success("删除成功");a.getTableData()}).catch(function(e){console.log(e);a.$message.error(e.response.status.toString()+"  "+e.response.data.error)})},expand:function e(){this.expandQuery=!this.expandQuery},search:function e(){this.getTableData()},reset:function e(){this.queryModel.available=true},uploadSuccess1:function e(t){console.log(t);this.formData.icon=t.url},uploadSuccess2:function e(t){this.formData.rewardImage=t.url},changeDailyLimitMode:function e(t){this.formData.dailyLimit=t.toString()==="unlimited"?"-1":this.formData.dailyLimit},changeLimitMode:function e(t){this.formData.limit=t.toString()==="unlimited"?"-1":this.formData.limit;alert(this.formData.limit)},chooseRewardType:function e(t){console.log(t)},chooseThirdPartyProduct:function e(t){this.chosenThirdPartyProductInfo=t},confirmCrawlerSetting:function e(){this.crawlerSettingFlag=false;this.$message.success("设置成功")},focusSortList:function e(t,n){var r=this;this.loading=true;this.$http.get(this.$baseUrl+this.queryRewardProductByNameRequest,{params:{name:this.chosenReward}}).then(function(e){console.log(e);r.loading=false;var a=[];if(e.data.length!==0){e.data.forEach(function(e,t){a.push((0,s.default)(e,{value:e.name}))});console.log(111,a);n(a)}})}}}},Iho7:function(e,t,a){"use strict";a.r(t);var n=a("FnDH");var r=a.n(n);for(var i in n)if(i!=="default")(function(e){a.d(t,e,function(){return n[e]})})(i);t["default"]=r.a},O4qd:function(e,t,a){"use strict";a.r(t);var n=a("EDYP");var r=a("vPuT");for(var i in r)if(i!=="default")(function(e){a.d(t,e,function(){return r[e]})})(i);var o=a("KHd+");var l=Object(o["a"])(r["default"],n["a"],n["b"],false,null,"63580e73",null);if(false){var s}l.options.__file="src/views/common/CommonQuery.vue";t["default"]=l.exports},QUf0:function(e,t,a){"use strict";var n=function(){var n=this;var e=n.$createElement;var r=n._self._c||e;return r("el-row",{staticClass:"app-container"},[r("CommonQuery",[r("template",{slot:"button1"},[r("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{icon:"el-icon-plus",size:"mini",type:"primary"},on:{click:n.createData}},[n._v("\n        新建\n      ")]),n._v(" "),r("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{icon:"el-icon-delete",size:"mini",type:"danger"},on:{click:n.handleMultipleDelete}},[n._v("\n        批量删除\n      ")])],1),n._v(" "),r("template",{slot:"query1"},[r("div",{staticClass:"common_search_wrapper",on:{keyup:function(e){if(!e.type.indexOf("key")&&n._k(e.keyCode,"enter",13,e.key,"Enter")){return null}return n.search(e)}}},[r("label",[r("input",{directives:[{name:"model",rawName:"v-model",value:n.queryModel.brandName,expression:"queryModel.brandName"}],attrs:{placeholder:"请输入游戏名称",type:"text"},domProps:{value:n.queryModel.brandName},on:{input:function(e){if(e.target.composing){return}n.$set(n.queryModel,"brandName",e.target.value)}}})]),n._v(" "),r("a",[r("span",{staticClass:"el-icon-search",on:{click:n.search}})])])])],2),n._v(" "),r("el-table",{directives:[{name:"loading",rawName:"v-loading.body",value:n.listLoading,expression:"listLoading",modifiers:{body:true}}],attrs:{data:n.tableList,height:n.tableHeight,border:"","element-loading-text":"Loading",fit:"","highlight-current-row":""},on:{"selection-change":n.handleSelectionChange}},[r("el-table-column",{attrs:{type:"selection",width:"40"}}),n._v(" "),r("el-table-column",{attrs:{align:"center",fixed:"",label:"No",type:"index",width:"45"}}),n._v(" "),r("el-table-column",{attrs:{align:"center",label:"header名称",prop:"name",width:"200"}}),n._v(" "),r("el-table-column",{attrs:{align:"center",label:"爬虫类型",prop:"type"},scopedSlots:n._u([{key:"default",fn:function(a){return[n.currentEditingCrawlerId!==a.row.headerId?r("div",[n._l(n.getCrawlerType(a),function(e,t){return r("el-tag",{key:e.code,attrs:{type:"success"}},[n._v("\n            "+n._s(n.getCrawlerType(a).length>0?e.name:"")+"\n          ")])}),n._v(" "),r("el-button",{attrs:{icon:"el-icon-edit",size:"mini",type:"text"},on:{click:function(e){return n.handleChangeCralerType(a)}}})],2):r("div",[r("el-select",{attrs:{multiple:"",placeholder:"请选择"},model:{value:n.formData.type,callback:function(e){n.$set(n.formData,"type",e)},expression:"formData.type"}},n._l(n.$store.state.app.dictionary["crawler"],function(e){return r("el-option",{key:e.code,attrs:{label:e.name,value:e.code}})}),1),n._v(" "),r("el-button",{attrs:{icon:"el-icon-check",size:"mini",type:"text"},on:{click:n.saveHeaderTypes}}),n._v(" "),r("el-button",{attrs:{icon:"el-icon-close",size:"mini",type:"text"},on:{click:function(e){n.currentEditingCrawlerId=""}}})],1)]}}])}),n._v(" "),r("el-table-column",{attrs:{align:"center",label:"header键名",prop:"headerKeyName"}}),n._v(" "),r("el-table-column",{attrs:{align:"center",label:"header值名",prop:"headerValueName"}}),n._v(" "),r("el-table-column",{attrs:{align:"center",label:"操作",width:"200px"},scopedSlots:n._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(e){return n.handleUpdate(t)}}},[n._v("编辑")]),n._v(" "),r("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(e){return n.handleDelete(t)}}},[n._v("删除")])]}}])})],1),n._v(" "),r("div",{staticClass:"common_pagination_wrapper"},[r("el-pagination",{attrs:{"current-page":n.pagination.page,"page-size":n.pagination.limit,"page-sizes":[10,20,30,50,100],total:n.total,background:"",layout:"total, sizes, prev, pager, next, jumper"},on:{"update:currentPage":function(e){return n.$set(n.pagination,"page",e)},"update:current-page":function(e){return n.$set(n.pagination,"page",e)},"current-change":n.handleCurrentChange,"size-change":n.handleSizeChange}})],1),n._v(" "),r("el-dialog",{attrs:{title:n.textMap[n.dialogStatus],visible:n.dialogFormVisible,width:"850px"},on:{"update:visible":function(e){n.dialogFormVisible=e}}},[r("el-row",{attrs:{justify:"center",type:"flex"}},[r("el-col",{attrs:{span:20}},[r("el-form",{ref:"formData",attrs:{model:n.formData,rules:n.rules,"label-position":"right","label-width":"140px"}},[r("el-form-item",{attrs:{label:"名称",prop:"name"}},[r("el-input",{model:{value:n.formData.name,callback:function(e){n.$set(n.formData,"name",e)},expression:"formData.name"}})],1),n._v(" "),r("el-form-item",{attrs:{label:"类型",prop:"type"}},[r("el-select",{attrs:{placeholder:""},model:{value:n.formData.type,callback:function(e){n.$set(n.formData,"type",e)},expression:"formData.type"}},n._l(n.$store.state.app.dictionary["crawler"],function(e){return r("el-option",{key:e.code,attrs:{label:e.name,value:e.code}})}),1)],1),n._v(" "),r("el-form-item",{attrs:{label:"header键名",prop:"headerKeyName"}},[r("el-input",{attrs:{disabled:n.formData.rewardType==="third_link"},model:{value:n.formData.headerKeyName,callback:function(e){n.$set(n.formData,"headerKeyName",e)},expression:"formData.headerKeyName"}})],1),n._v(" "),r("el-form-item",{attrs:{label:"header值名",prop:"headerValueName"}},[r("el-input",{attrs:{autosize:{minRows:2,maxRows:8},type:"textarea"},model:{value:n.formData.headerValueName,callback:function(e){n.$set(n.formData,"headerValueName",e)},expression:"formData.headerValueName"}})],1)],1)],1)],1),n._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{directives:[{name:"waves",rawName:"v-waves"}],on:{click:function(e){n.dialogFormVisible=false}}},[n._v(n._s(n.$t("table.cancel")))]),n._v(" "),n.dialogStatus==="create"?r("el-button",{attrs:{type:"primary"},on:{click:n.createData}},[n._v(n._s(n.$t("table.confirm")))]):r("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary"},on:{click:n.updateData}},[n._v(n._s(n.$t("table.confirm")))])],1)],1)],1)};var r=[];n._withStripped=true;a.d(t,"a",function(){return n});a.d(t,"b",function(){return r})},RzdK:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});var n=a("m1cH");var r=i(n);function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"CommonTag",props:{metaData:{type:Array,default:function e(){return[]},required:false},title:{type:String,default:"",required:false},tagData:{type:Array,default:[],required:false},buttonText:{type:String,default:"+",required:false}},data:function e(){return{dynamicTags:[],inputVisible:false,inputValue:""}},watch:{tagData:function e(t){console.log(t);if(t.length>=0){this.dynamicTags=t}else{this.$message.error("tag列表数据类型不正确")}}},mounted:function e(){this.dynamicTags=this.tagData},methods:{handleInputConfirm:function e(){var t=this;var a=this.inputValue;if(a){this.dynamicTags.push(a)}this.inputVisible=false;this.inputValue="";this.$emit.apply(this,["add",this.dynamicTags].concat((0,r.default)(t.metaData)))},handleClose:function e(t){var a=this;this.$emit.apply(this,["delete",t,this.dynamicTags.indexOf(t)].concat((0,r.default)(a.metaData)));this.dynamicTags.splice(this.dynamicTags.indexOf(t),1)},showInput:function e(){var t=this;this.inputVisible=true;this.$nextTick(function(e){t.$refs.saveTagInput.$refs.input.focus()})}}}},btSa:function(e,t,a){"use strict";var n=function(){var a=this;var e=a.$createElement;var n=a._self._c||e;return n("el-row",{staticClass:"common_tag_wrapper"},[n("el-col",{attrs:{span:2}},[a._v(a._s(a.title))]),a._v(" "),n("el-col",{attrs:{span:22}},[a._l(a.dynamicTags,function(t,e){return n("el-tag",{key:e,attrs:{closable:"","disable-transitions":false},on:{close:function(e){return a.handleClose(t)}}},[a._v("\n      "+a._s(t)+"\n    ")])}),a._v(" "),a.inputVisible?n("el-input",{ref:"saveTagInput",staticClass:"input",attrs:{size:"small"},on:{blur:a.handleInputConfirm},nativeOn:{keyup:function(e){if(!e.type.indexOf("key")&&a._k(e.keyCode,"enter",13,e.key,"Enter")){return null}return a.handleInputConfirm(e)}},model:{value:a.inputValue,callback:function(e){a.inputValue=e},expression:"inputValue"}}):n("el-button",{ref:"saveTagInput",staticClass:"button",attrs:{size:"small"},on:{blur:a.handleInputConfirm,click:a.showInput},nativeOn:{keyup:function(e){if(!e.type.indexOf("key")&&a._k(e.keyCode,"enter",13,e.key,"Enter")){return null}return a.handleInputConfirm(e)}},model:{value:a.inputValue,callback:function(e){a.inputValue=e},expression:"inputValue"}},[a._v("添加版本\n    ")])],2)],1)};var r=[];n._withStripped=true;a.d(t,"a",function(){return n});a.d(t,"b",function(){return r})},f6oM:function(e,t,a){"use strict";var n=a("jqAM");var r=a.n(n);var i=r.a},hcDs:function(e,t,a){"use strict";a.r(t);var n=a("RzdK");var r=a.n(n);for(var i in n)if(i!=="default")(function(e){a.d(t,e,function(){return n[e]})})(i);t["default"]=r.a},jqAM:function(e,t,a){if(false){var n}},qPSc:function(e,t,a){"use strict";a.r(t);var n=a("btSa");var r=a("hcDs");for(var i in r)if(i!=="default")(function(e){a.d(t,e,function(){return r[e]})})(i);var o=a("KHd+");var l=Object(o["a"])(r["default"],n["a"],n["b"],false,null,"9ec8b5f6",null);if(false){var s}l.options.__file="src/views/common/CommonTag.vue";t["default"]=l.exports},vPuT:function(e,t,a){"use strict";a.r(t);var n=a("02K0");var r=a.n(n);for(var i in n)if(i!=="default")(function(e){a.d(t,e,function(){return n[e]})})(i);t["default"]=r.a}}]);