(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{"02K0":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.default={name:"CommonQuery",props:{queryModel:{type:Object,default:function e(){return{}}},expandQuery:{type:Object,default:function e(){return{}}},expand:{type:Boolean,default:false}},data:function e(){return{expandFlag:false}},watch:{queryModel:function e(){},expand:function e(t){this.expandFlag=t}},methods:{search:function e(){},reset:function e(){this.$emit("reset")},handleExpand:function e(){this.expandFlag=!this.expandFlag;console.log(this.expandFlag)}}}},EDYP:function(e,t,a){"use strict";var n=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("div",{staticClass:"common-querytable-wrapper"},[a("div",{staticClass:"queryform-wrapper"},[a("div",{staticClass:"outside"},[a("el-form",{staticClass:"basearea"},[a("ul",{staticClass:"pull-left"},[a("li",[e._t("button1")],2)])]),e._v(" "),a("ul",{staticClass:"operation-wrapper pull-right"},[a("li",[e._t("query1")],2),e._v(" "),a("li",[e._t("query2")],2),e._v(" "),a("li",[e._t("query3")],2),e._v(" "),e.expand?a("li",[a("el-button",{staticClass:"expand",attrs:{size:"mini",type:"text"},on:{click:e.handleExpand}},[e._v("高级搜索"),a("i",{staticClass:"el-icon-arrow-down"})])],1):e._e()])],1),e._v(" "),a("div",{staticClass:"expandarea",class:{active:e.expandFlag}},[a("el-form",{ref:"form",attrs:{model:e.queryModel,size:"mini","label-width":"100px"}},[a("el-row",[a("el-col",{attrs:{span:8}},[e._t("query4")],2),e._v(" "),a("el-col",{attrs:{span:8}}),e._v(" "),a("el-col",{attrs:{span:8}})],1),e._v(" "),a("el-row",[a("el-col",{attrs:{span:8}}),e._v(" "),a("el-col",{attrs:{span:8}}),e._v(" "),a("el-col",{attrs:{span:8}})],1),e._v(" "),a("el-row",[a("el-col",{attrs:{span:23,"pull-right":""}},[a("el-form-item",{staticClass:"pull-right"},[a("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-search"},on:{click:e.search}},[e._v("搜索\n              ")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-refresh"},on:{click:e.reset}},[e._v("重置\n              ")])],1)],1)],1)],1)],1)])])};var i=[];n._withStripped=true;a.d(t,"a",function(){return n});a.d(t,"b",function(){return i})},"I+SR":function(e,t,a){"use strict";a.r(t);var n=a("S6EA");var i=a.n(n);for(var r in n)if(r!=="default")(function(e){a.d(t,e,function(){return n[e]})})(r);t["default"]=i.a},Mpbc:function(e,t,a){if(false){var n}},O4qd:function(e,t,a){"use strict";a.r(t);var n=a("EDYP");var i=a("vPuT");for(var r in i)if(r!=="default")(function(e){a.d(t,e,function(){return i[e]})})(r);var l=a("KHd+");var s=Object(l["a"])(i["default"],n["a"],n["b"],false,null,"63580e73",null);if(false){var o}s.options.__file="src/views/common/CommonQuery.vue";t["default"]=s.exports},S3D1:function(e,t,a){"use strict";a.r(t);var n=a("sp5S");var i=a("I+SR");for(var r in i)if(r!=="default")(function(e){a.d(t,e,function(){return i[e]})})(r);var l=a("sciX");var s=a("KHd+");var o=Object(s["a"])(i["default"],n["a"],n["b"],false,null,null,null);if(false){var c}o.options.__file="src/views/crawling/MaoyanRankingList.vue";t["default"]=o.exports},S6EA:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});var n=a("4d7F");var h=g(n);var i=a("P2sY");var w=g(i);var r=a("14Xm");var l=g(r);var s=a("D3Ub");var c=g(s);var o=a("O4qd");var u=g(o);function g(e){return e&&e.__esModule?e:{default:e}}t.default={components:{CommonQuery:u.default},data:function e(){var a=this;return{getListByPaginationRequest:"crawlerMaoyanRankingList/getListByPagination",crawlAndSaveRequest:"crawlerMaoyanRankingList/crawlAndSave",crawlRankinglistDetailRequest:"crawlerMaoyanRankingList/crawlRankinglistDetail",crawlRankingListMoreSectionsRequest:"crawlerMaoyanRankingList/crawlRankingListMoreSections",crawlRankingListRatingRequest:"crawlerMaoyanRankingList/crawlRankingListRating",crawlRankingListWantToSeePortraitRequest:"crawlerMaoyanRankingList/crawlRankingListWantToSeePortrait",crawlRankingListBoxOfficePremiereRequest:"crawlerMaoyanRankingList/crawlRankingListBoxOfficePremiere",crawlRankingListBoxOfficeGlobalRequest:"crawlerMaoyanRankingList/crawlRankingListBoxOfficeGlobal",crawlMoviePreSaleDetailRequest:"crawlerMaoyanPreSale/crawlMoviePreSaleDetail",crawlMoviePreSalePortraitRequest:"crawlerMaoyanPreSale/crawlMoviePreSalePortrait",deleteRecordRequest:"crawlerMaoyanRankingList/deleteRecords",getSettingsRequest:"settings/getList",crawlRankingListByYearRequest:"crawlerMaoyanRankingList/crawlRankingListByYear",crawlPreSaleMovieListRequest:"crawlerMaoyanPreSale/crawlMovieList",saveMultipleMaoyanRankingListRecordRequest:"crawlerMaoyanRankingList/saveMultipleMaoyanRankingListRecord",crawlerSettingFlag:false,crawlerSetting:{address:""},chosenReward:"",chooseRewardTypeModel:{},chosenThirdPartyProductInfo:{},value2:"",value1:"",dailyLimitMode:"",limitMode:"",tableKey:0,tableList:[],total:null,listLoading:true,availabilityFlag:false,prepareToCrawlFlag:false,crawlerCountType:0,statusDictionary:[{code:0,name:"未上线"},{code:1,name:"上线"}],queryModel:{sort:"desc",brandName:""},pagination:{page:1,limit:100},importanceOptions:[1,2,3],sortOptions:[{label:"ID Ascending",key:"+id"},{label:"ID Descending",key:"-id"}],statusOptions:["published","draft","deleted"],showReviewer:false,formData:{headerCode:"maoyan",crawlerAddress:""},dialogFormVisible:false,dialogStatus:"",textMap:{update:"Edit",create:"Create"},dialogPvVisible:false,rules:{id:[{required:true,message:"此项为必填项",trigger:"change"}],description:[{required:true,message:"此项为必填项",trigger:"change"}],name:[{required:true,message:"此项为必填项",trigger:"change"}],dailyLimit:[{required:true,message:"此项为必填项",trigger:"change"}],limit:[{required:true,message:"此项为必填项",trigger:"change"}],startDate:[{required:true,message:"此项为必填项",trigger:"change"}],endDate:[{required:true,message:"此项为必填项",trigger:"change"}],status:[{required:true,message:"此项为必填项",trigger:"change"}]},downloadLoading:false,pickerOptions0:{disabledDate:function e(t){if(a.value2!==""){return t.getTime()>a.value2}}},pickerOptions1:{disabledDate:function e(t){return t.getTime()<a.value1}},fileList:[],portraitParams:{bucketName:"funyvalley",folderName:"icon"},iosVersionListData:[],androidVersionListData:[],searchTxt:"",expandQuery:"",showFileListFlag:false,newFile:"",advertisementDialogFlag:false,currentAdvertisementTabIndex:0,effectiveDuration:[],multipleSelection:[],oneKeyCrawlFlag:false,stepCrawlFlag:false,settingsList:[],rankingListMovieData:[],rankingListData:[],crawlingCount:0,preSaleWantToSeeListData:[],preSaleWantToSeeListMovieData:[],crawlingFlag:false,rankingListCountLimit:0,presaleCountLimit:0}},computed:{tableHeight:function e(){return this.$store.state.app.tableHeight},dictionaryList:function e(){return this.$store.state.app.dictionary.crawlerAddress},crawlerStyle:function e(){return{height:this.tableHeight-180+"px",overflow:"auto"}}},watch:{effectiveDuration:function e(t){console.log(t);if(t===null){t=[]}this.formData.startDate=this.$moment(t[0]).format("YYYY-MM-DD");this.formData.endDate=this.$moment(t[1]).format("YYYY-MM-DD")},currentAdvertisementTabIndex:function e(t){console.log(t)}},mounted:function e(){var a=this;return(0,c.default)(l.default.mark(function e(){return l.default.wrap(function e(t){while(1){switch(t.prev=t.next){case 0:t.next=2;return a.getSettingsDictionary();case 2:a.settingsList=t.sent;a.getTableData();case 4:case"end":return t.stop()}}},e,a)}))()},methods:{getTableData:function e(){var t=this;this.listLoading=true;this.$http.get(this.$baseUrl+this.getListByPaginationRequest,{params:(0,w.default)(this.queryModel,this.pagination)}).then(function(e){console.log("getListByPaginationRequest",e);t.tableList=e.data;t.total=e.pagination.total;t.listLoading=false})},getSettingsDictionary:function e(){var n=this;return new h.default(function(t,a){n.$http.get(n.$baseUrl+n.getSettingsRequest,{params:{type:"crawlerAddress"}}).then(function(e){t(e.data)}).catch(function(e){console.log(e);a(e)})})},handleFilter:function e(){this.pagination.page=1;this.getTableData()},handleSizeChange:function e(t){this.pagination.limit=t;this.getTableData()},handleCurrentChange:function e(t){this.pagination.page=t;this.getTableData()},resetTemp:function e(){this.formData={id:"",description:"",rewardImage:"",rewardName:"",rewardPrompt:"",rewardStr:"",rewardType:"",rewardValue:"",status:""}},crawlerData:function e(){var t=this;this.$http.post(this.$baseUrl+this.crawlAndSaveRequest,{address:this.formData.crawlerAddress,headerCode:this.formData.headerCode}).then(function(e){console.log(e);t.$message.success("抓取成功");t.getTableData();t.oneKeyCrawlFlag=false})},createData:function e(){this.formData.id="";this.updateData()},handleUpdate:function e(t){var a=this;console.log(t);this.formData=(0,w.default)({},t.row);this.dialogStatus="update";this.dialogFormVisible=true;this.$nextTick(function(){a.$refs["formData"].clearValidate()})},updateData:function e(){var t=this;this.$refs["formData"].validate(function(e){if(e){t.$http.post(t.$baseUrl+t.addAndUpdateRewardInfoRequest,{id:t.formData.id,description:t.formData.description,rewardImage:t.formData.rewardImage,rewardName:t.formData.rewardName,rewardPrompt:t.formData.rewardPrompt,rewardStr:t.formData.rewardStr,rewardType:t.formData.rewardType,rewardValue:t.formData.rewardValue,status:t.formData.status}).then(function(e){console.log(e);t.dialogFormVisible=false;t.$message.success("信息修改成功");t.getTableData()}).catch(function(e){console.log(e);t.$message.error(e.response.status.toString()+"  "+e.response.data.error)})}})},handleSelectionChange:function e(t){this.multipleSelection=t;console.log(t)},handleMultipleDelete:function e(){var t=this;this.$confirm("确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.deleteRecord(t.multipleSelection.map(function(e){return e.id}))}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},handleDelete:function e(t){var a=this;console.log(t);this.$confirm("确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.deleteRecord([t.row.id])}).catch(function(){a.$message({type:"info",message:"已取消删除"})})},deleteRecord:function e(t){var a=this;this.$http.delete(this.$baseUrl+this.deleteRecordRequest,{data:{id:t}}).then(function(e){console.log(e);a.dialogFormVisible=false;a.$message.success("删除成功");a.getTableData()}).catch(function(e){console.log(e);a.$message.error(e.response.status.toString()+"  "+e.response.data.error)})},expand:function e(){this.expandQuery=!this.expandQuery},search:function e(){this.getTableData()},reset:function e(){this.queryModel.available=true},uploadSuccess1:function e(t){console.log(t);this.formData.icon=t.url},uploadSuccess2:function e(t){this.formData.rewardImage=t.url},changeDailyLimitMode:function e(t){this.formData.dailyLimit=t.toString()==="unlimited"?"-1":this.formData.dailyLimit},changeLimitMode:function e(t){this.formData.limit=t.toString()==="unlimited"?"-1":this.formData.limit;alert(this.formData.limit)},chooseRewardType:function e(t){this.formData.type=this.settingsList.filter(function(e){return e.value===t})[0].code;this.formData.crawlerAddress=t},chooseThirdPartyProduct:function e(t){this.chosenThirdPartyProductInfo=t},confirmCrawlerSetting:function e(){this.crawlerSettingFlag=false;this.$message.success("设置成功")},focusSortList:function e(t,n){var i=this;this.loading=true;this.$http.get(this.$baseUrl+this.queryRewardProductByNameRequest,{params:{name:this.chosenReward}}).then(function(e){console.log(e);i.loading=false;var a=[];if(e.data.length!==0){e.data.forEach(function(e,t){a.push((0,w.default)(e,{value:e.name}))});console.log(111,a);n(a)}})},getAllCrawlingIndex:function e(){var a=this;return(0,c.default)(l.default.mark(function e(){return l.default.wrap(function e(t){while(1){switch(t.prev=t.next){case 0:t.next=2;return a.getRankingList();case 2:a.prepareToCrawlFlag=false;case 3:case"end":return t.stop()}}},e,a)}))()},getMovieData:function e(){var t=this;var a=this.getDetailData();h.default.all([a]).then(function(e){console.log(e)}).catch(function(e){console.log(e);t.$message.error(e)})},getDetailData:function e(){var n=this;return(0,c.default)(l.default.mark(function e(){return l.default.wrap(function e(t){while(1){switch(t.prev=t.next){case 0:return t.abrupt("return",new h.default(function(t,a){n.$http.get(n.$baseUrl+n.crawlPreSaleMovieListRequest,{params:{address:"https://piaofang.maoyan.com/store",headerCode:"maoyanPreSale"}}).then(function(e){console.log(e);n.presaleCountLimit=e.data.length;n.preSaleWantToSeeListData=e.data;e.data.forEach(function(e,t){if(t<n.presaleCountLimit){n.$set(n.preSaleWantToSeeListData,t,(0,w.default)(e,{detailSuccess:0,content:["detailSuccess","rankingListWantToSeePortraitSuccess"],color:"sunccess",recordTime:"---",active:true}))}});n.$message.success("获取预售列表成功");t(n.preSaleWantToSeeListData)}).catch(function(e){n.$message.error(e);a(e)})}));case 1:case"end":return t.stop()}}},e,n)}))()},getPreSaleList:function e(){var a=this;return(0,c.default)(l.default.mark(function e(){return l.default.wrap(function e(t){while(1){switch(t.prev=t.next){case 0:a.$http.get(a.$baseUrl+a.crawlPreSaleMovieListRequest,{params:{address:"https://piaofang.maoyan.com/store",headerCode:"maoyanPreSale"}}).then(function(e){console.log(e);a.presaleCountLimit=e.data.length;a.preSaleWantToSeeListData=e.data;a.preSaleWantToSeeListData.forEach(function(e,t){if(t<a.presaleCountLimit){a.$set(a.preSaleWantToSeeListData,t,(0,w.default)(e,{preSaleWantToSeePortraitSuccess:0,content:"detailSuccess"+"preSaleWantToSeePortraitSuccess",color:"sunccess",recordTime:"---",active:true}))}});a.$message.success("获取预售列表成功")}).catch(function(e){a.$message.error(e)});case 1:case"end":return t.stop()}}},e,a)}))()},getRankingList:function e(){var n=this;return(0,c.default)(l.default.mark(function e(){return l.default.wrap(function e(t){while(1){switch(t.prev=t.next){case 0:return t.abrupt("return",new h.default(function(a,t){n.$http.post(n.$baseUrl+n.crawlRankingListByYearRequest,{address:"https://piaofang.maoyan.com/rankings/year",headerCode:"maoyanRankingList",limit:n.rankingListCountLimit,query:{year:"2019",tab:"1"}},{timeout:2e4}).then(function(e){n.rankingListCountLimit=e.data.length;console.log(e);var t=e.data.map(function(e){return(0,w.default)(e,{title:e.title,detailSuccess:0,rankingListRatingSuccess:0,rankingListWantToSeePortraitSuccess:0,moreSectionsSuccess:0,rankingListBoxOfficeGlobalSuccess:0,content:"detailSuccess"+"rankingListWantToSeePortraitSuccess",color:"sunccess",recordTime:"---",active:true})});a(n.rankingListData);n.$message.success("获取电影排名列表成功");n.rankingListData=t}).catch(function(e){n.$message.error(e);t(e)})}));case 1:case"end":return t.stop()}}},e,n)}))()},beginToCrawRankingListMovieData:function e(){var v=this;return(0,c.default)(l.default.mark(function e(){var a,m,n,i,r;return l.default.wrap(function e(t){while(1){switch(t.prev=t.next){case 0:v.crawlingCount=0;v.rankingListMovieData=[];a=[];m={};n=false;i=false;r=function t(){var n=v.crawlingCount;v.crawlingFlag=true;console.log(v.rankingListData);var i=v.rankingListData[n].movieId;var e=function e(){return new h.default(function(t,a){v.$http.get(v.$baseUrl+v.crawlRankinglistDetailRequest,{params:{address:"https://piaofang.maoyan.com/movie/"+i,headerCode:"rankingListDetailHeader"},timeout:2e4}).then(function(e){m.detail=e.data;e.data=(0,w.default)({movieId:i},e.data);v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{detailSuccess:1}));t(e.data)}).catch(function(e){v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{detailSuccess:2}));a(e)})})};var a=function e(){return new h.default(function(t,a){v.$http.get(v.$baseUrl+v.crawlRankingListMoreSectionsRequest,{params:{address:"https://piaofang.maoyan.com/movie/"+i+"/moresections",headerCode:"rankingListDetailHeader"}}).then(function(e){m.detailMoreSections=e.data;v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{moreSectionsSuccess:1}));t(e.data)}).catch(function(e){v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{moreSectionsSuccess:2}));a(e)})})};var r=function e(){return new h.default(function(t,a){v.$http.get(v.$baseUrl+v.crawlRankingListWantToSeePortraitRequest,{params:{address:"https://piaofang.maoyan.com/movie/"+i+"/wantindex?wkwebview=1%26city_tier=0%26city_id=0%26cityName=%E5%85%A8%E5%9B%BD",headerCode:"rankingListDetailHeader"},timeout:2e4}).then(function(e){m.portrait=e.data;console.log("getRankingListWantToSeePortrait",e.data);v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{rankingListWantToSeePortraitSuccess:1}));t(e.data)}).catch(function(e){v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{rankingListWantToSeePortraitSuccess:2}));a(e)})})};var l=function e(){return new h.default(function(t,a){v.$http.get(v.$baseUrl+v.crawlRankingListRatingRequest,{params:{address:"https://piaofang.maoyan.com/movie/"+i+"/audienceRating?usePageCache=true",headerCode:"rankingListDetailHeader"},timeout:3e5}).then(function(e){m.rating=e.data;v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{rankingListRatingSuccess:1}));t(e.data)}).catch(function(e){v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{rankingListRatingSuccess:2}));a(e)})})};var s=function e(){return new h.default(function(t,a){v.$http.get(v.$baseUrl+v.crawlRankingListBoxOfficePremiereRequest,{params:{address:"https://piaofang.maoyan.com/movie/"+i+"/premierebox",headerCode:"rankingListDetailHeader"},timeout:3e5}).then(function(e){m.rating=e.data;v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{RankingListPemiereBoxSuccess:1}));t(e.data)}).catch(function(e){v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{RankingListPemiereBoxSuccess:2}));a(e)})})};var o=function e(){return new h.default(function(t,a){v.$http.get(v.$baseUrl+v.crawlRankingListBoxOfficeGlobalRequest,{params:{address:"https://piaofang.maoyan.com/movie/"+i+"/boxshowna",headerCode:"rankingListDetailHeader"},timeout:3e5}).then(function(e){m.rating=e.data;v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{rankingListBoxOfficeGlobalSuccess:1}));t(e.data)}).catch(function(e){v.$set(v.rankingListData,n,(0,w.default)(v.rankingListData[n],{rankingListBoxOfficeGlobalSuccess:2}));a(e)})})};var c=e();var u=r();var g=l();var d=a();var p=s();var f=o();h.default.all([c,d,g,u,p,f]).then(function(e){console.log("responseAll",e);v.rankingListData[n].color="success";v.$set(v.rankingListMovieData,n,(0,w.default)(e[0],e[1],e[2],e[3],e[4],e[5]));console.log("rankingListMovieData",v.rankingListMovieData);if(v.crawlingCount===v.rankingListCountLimit){v.crawlingFlag=false;v.crawlingCount=0}else{v.crawlingCount++}if(v.crawlingFlag){v.rankingListData[n].recordTime=v.$moment(Date.now()).format("hh:mm:ss");t()}}).catch(function(e){console.log(e);if(v.crawlingCount===v.rankingListData.length){v.crawlingFlag=false}else{v.crawlingCount++}if(v.crawlingFlag){t()}})};r();case 8:case"end":return t.stop()}}},e,v)}))()},beginToCrawlPreSale:function e(){var o=this;return(0,c.default)(l.default.mark(function e(){var a,s,n,i,r;return l.default.wrap(function e(t){while(1){switch(t.prev=t.next){case 0:o.crawlingCount=0;o.preSaleWantToSeeListData=[];a=[];s={};n=false;i=false;r=function t(){var n=o.crawlingCount;o.crawlingFlag=true;var i=o.preSaleWantToSeeListData[n].movieId;var e=function e(){return new h.default(function(t,a){o.$http.get(o.$baseUrl+o.crawlMoviePreSaleDetailRequest,{params:{address:"https://piaofang.maoyan.com/movie/"+i,headerCode:"maoyanPreSale"}}).then(function(e){s.detail=e.data;o.$set(o.preSaleWantToSeeListData,n,(0,w.default)(o.preSaleWantToSeeListData[n],{detailSuccess:1}));t(e.data)}).catch(function(e){o.$set(o.preSaleWantToSeeListData,n,(0,w.default)(o.preSaleWantToSeeListData[n],{detailSuccess:2}));a(e)})})};var a=function e(){return new h.default(function(t,a){o.$http.get(o.$baseUrl+o.crawlMoviePreSalePortraitRequest,{params:{address:"https://piaofang.maoyan.com/movie/"+i+"/wantindex?wkwebview=1%26city_tier=0%26city_id=0%26cityName=%E5%85%A8%E5%9B%BD",headerCode:"rankingListDetailHeader"}}).then(function(e){s.portrait=e.data;o.$set(o.preSaleWantToSeeListData,n,(0,w.default)(o.preSaleWantToSeeListData[n],{rankingListWantToSeePortraitSuccess:1,color:"success"}));t(e.data)}).catch(function(e){o.$set(o.preSaleWantToSeeListData,n,(0,w.default)(o.preSaleWantToSeeListData[n],{rankingListWantToSeePortraitSuccess:2,color:"failed"}));a(e)})})};var r=e();var l=a();if(o.crawlingCount===o.rankingListCountLimit){o.crawlingFlag=false}else{o.crawlingCount++}h.default.all([r,l]).then(function(e){console.log(e);o.$set(o.preSaleWantToSeeListData,n,(0,w.default)(e[0],e[1]));console.log("rankingListMovieData",o.preSaleWantToSeeListData);if(o.crawlingFlag){o.preSaleWantToSeeListData[n].recordTime=o.$moment(Date.now()).format("hh:mm:ss");t()}}).catch(function(e){console.log(e);if(o.crawlingCount===o.rankingListCountLimit){o.crawlingFlag=false}else{o.crawlingCount++}if(o.crawlingFlag){t()}})};r();case 8:case"end":return t.stop()}}},e,o)}))()},stopCrawling:function e(){this.crawlingFlag=false},save:function e(){var t=this;if(this.crawlingCount===this.rankingListCountLimit){console.log(this.rankingListMovieData);this.$http.post(this.$baseUrl+this.saveMultipleMaoyanRankingListRecordRequest,this.rankingListMovieData).then(function(e){t.$message.success("数据提交成功");t.getTableData();t.stepCrawlFlag=false})}else{this.$message.warning("dsdsdsdsds")}},handleChangeCounter:function e(t){var a=this;this.preSaleWantToSeeListData.forEach(function(e,t){a.$set(a.preSaleWantToSeeListData,t,(0,w.default)(a.preSaleWantToSeeListData[t],{active:t<a.rankingListCountLimit}))})},checkDescription:function e(t){this.$alert(t.row.description,"电影描述",{confirmButtonText:"关闭",closeOnClickModal:true,callback:function e(t){}})},handleChangeLimitType:function e(t){console.log(this.crawlerCountType);if(this.crawlerCountType===0){this.rankingListCountLimit=0}},handleChangeCountLimit:function e(){}}}},sciX:function(e,t,a){"use strict";var n=a("Mpbc");var i=a.n(n);var r=i.a},sp5S:function(e,t,a){"use strict";var n=function(){var a=this;var e=a.$createElement;var n=a._self._c||e;return n("el-row",{staticClass:"app-container"},[n("CommonQuery",[n("template",{slot:"button1"},[n("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{icon:"el-icon-plus",size:"mini",type:"primary"},on:{click:function(e){a.stepCrawlFlag=true}}},[a._v("\n        分步抓取\n      ")]),a._v(" "),n("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{icon:"el-icon-delete",size:"mini",type:"danger"},on:{click:a.handleMultipleDelete}},[a._v("\n        批量删除\n      ")])],1),a._v(" "),n("template",{slot:"query1"},[n("div",{staticClass:"common-search-wrapper",on:{keyup:function(e){if(!e.type.indexOf("key")&&a._k(e.keyCode,"enter",13,e.key,"Enter")){return null}return a.search(e)}}},[n("label",[n("input",{directives:[{name:"model",rawName:"v-model",value:a.queryModel.brandName,expression:"queryModel.brandName"}],attrs:{placeholder:"请输入游戏名称",type:"text"},domProps:{value:a.queryModel.brandName},on:{input:function(e){if(e.target.composing){return}a.$set(a.queryModel,"brandName",e.target.value)}}})]),a._v(" "),n("a",[n("span",{staticClass:"el-icon-search",on:{click:a.search}})])])])],2),a._v(" "),n("el-table",{directives:[{name:"loading",rawName:"v-loading.body",value:a.listLoading,expression:"listLoading",modifiers:{body:true}}],attrs:{data:a.tableList,height:a.tableHeight,border:"","element-loading-text":"Loading",fit:"","highlight-current-row":""},on:{"selection-change":a.handleSelectionChange}},[n("el-table-column",{attrs:{fixed:"left",type:"selection",width:"40"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",fixed:"",label:"No",type:"index",width:"45"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"电影名称（中文）",prop:"titleChi",width:"100"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"电影名称（原文）",prop:"title",width:"100"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"抓取时间",prop:"timestamp",width:"100"},scopedSlots:a._u([{key:"default",fn:function(e){return[a._v("\n        "+a._s(a.$moment(Number(e.row.timestamp)).format("YYYY-MM-DD HH:mm:ss"))+"\n      ")]}}])}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"上映时间",prop:"releaseDate"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"平台名称（英文）",prop:"platformEngName"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"平台名称（中文）",prop:"platformChineseName"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"平台类型",prop:"platformType"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看数量",prop:"numWantToSee"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分人数",prop:"numOfRating"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"描述",prop:"description"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("el-button",{on:{click:function(e){return a.checkDescription(t)}}},[a._v("查看")])]}}])}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"总评分",prop:"rating"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分1到2分占比",prop:"rating1To2"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分4到4分占比",prop:"rating3To4"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分5到6分占比",prop:"rating5To6"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分7到8分占比",prop:"rating7To8"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分9到10分占比",prop:"rating9To10"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分20岁以下占比",prop:"ratingByAge20"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分20到24岁占比",prop:"ratingByAge20To24"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分25到29岁占比",prop:"ratingByAge25To29"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分30到34岁占比",prop:"ratingByAge30To34"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分35到39岁占比",prop:"ratingByAge35To39"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分一线城市占比",prop:"ratingByTier1"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分二线城市占比",prop:"ratingByTier2"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分三线城市占比",prop:"ratingByTier3"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"评分四线城市占比",prop:"ratingByTier4"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看男性受众占比",prop:"wantToSeeByGenderMale"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看女性受众占比",prop:"wantToSeeByGenderFemale"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看20岁以下占比",prop:"wantToSeeByAge20"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看20到24岁占比",prop:"wantToSeeByAge20To24"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看25到29岁占比",prop:"wantToSeeByAge25To29"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看30到34岁占比",prop:"wantToSeeByAge30To34"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看35到39岁占比",prop:"wantToSeeByAge35To39"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看40岁以上占比",prop:"wantToSeeByAge40"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看一线城市占比",prop:"wantToSeeByTier1"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看二线城市占比",prop:"wantToSeeByTier2"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看三线城市占比",prop:"wantToSeeByTier3"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"想看四线城市占比",prop:"wantToSeeByTier4"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"预售票房",prop:"preSaleBoxInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"预售排片占比",prop:"preSaleShowRate"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"预售排片场次",prop:"preSaleShowInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"全球票房（美元）",prop:"globalBoxInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"北美票房（美元）",prop:"northAmericaBoxInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"IMDb评分",prop:"imdbRating"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"平均上座率",prop:"avgSeatView"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"平均上映率",prop:"avgShowView"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"平均观看率",prop:"avgViewBox"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"票房数",prop:"boxInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"票房占有率",prop:"boxRate"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"myRefundNumInfo",prop:"myRefundNumInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"myRefundRateInfo",prop:"myRefundRateInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"在线票房比率",prop:"onlineBoxRate"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"退款数",prop:"refundViewInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"退款率",prop:"refundViewRate"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"上映时间",prop:"releaseInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"上映时间颜色",prop:"releaseInfoColor"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"上座率",prop:"seatRate"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"平均上座率",prop:"showInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"上映率",prop:"showRate"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"分账票房",prop:"splitAvgViewBox"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"splitBoxInfo",prop:"splitBoxInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"分账比率",prop:"splitBoxRate"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"总分账信息",prop:"splitSumBoxInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"总票房",prop:"sumBoxInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"viewInfo",prop:"viewInfo"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",label:"viewInfo",prop:"viewInfoV2"}}),a._v(" "),n("el-table-column",{attrs:{align:"center",fixed:"right",label:"操作",width:"100px"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(e){return a.handleDelete(t)}}},[a._v("删除")])]}}])})],1),a._v(" "),n("div",{staticClass:"common-pagination-wrapper"},[n("el-pagination",{attrs:{"current-page":a.pagination.page,"page-size":a.pagination.limit,"page-sizes":[10,20,30,50,100],total:a.total,background:"",layout:"total, sizes, prev, pager, next, jumper"},on:{"update:currentPage":function(e){return a.$set(a.pagination,"page",e)},"update:current-page":function(e){return a.$set(a.pagination,"page",e)},"current-change":a.handleCurrentChange,"size-change":a.handleSizeChange}})],1),a._v(" "),n("el-dialog",{attrs:{title:a.textMap[a.dialogStatus],visible:a.oneKeyCrawlFlag,width:"850px"},on:{"update:visible":function(e){a.oneKeyCrawlFlag=e}}},[n("el-row",{attrs:{justify:"center",type:"flex"}},[n("el-col",{attrs:{span:20}},[n("el-form",{ref:"formData",attrs:{model:a.formData,rules:a.rules,"label-position":"right","label-width":"140px"}},[n("el-form-item",{attrs:{label:"爬虫类型",prop:"rewardType"}},[n("el-select",{attrs:{placeholder:""},on:{change:a.chooseRewardType},model:{value:a.formData.rewardType,callback:function(e){a.$set(a.formData,"rewardType",e)},expression:"formData.rewardType"}},a._l(a.settingsList,function(e){return n("el-option",{key:e.code,attrs:{label:e.name,value:e.value}})}),1)],1),a._v(" "),n("el-form-item",{attrs:{label:"爬虫地址",prop:"crawlerAddress"}},[n("el-input",{model:{value:a.formData.crawlerAddress,callback:function(e){a.$set(a.formData,"crawlerAddress",e)},expression:"formData.crawlerAddress"}})],1)],1)],1)],1),a._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{directives:[{name:"waves",rawName:"v-waves"}],on:{click:function(e){a.oneKeyCrawlFlag=false}}},[a._v(a._s(a.$t("table.cancel")))]),a._v(" "),n("el-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary"},on:{click:a.crawlerData}},[a._v(a._s(a.$t("table.confirm")))])],1)],1),a._v(" "),n("el-dialog",{attrs:{title:a.textMap[a.dialogStatus],visible:a.stepCrawlFlag,top:"1vh",width:"1600px"},on:{"update:visible":function(e){a.stepCrawlFlag=e}}},[n("el-row",{attrs:{gutter:1}},[n("el-col",{attrs:{span:2}},[n("el-button",{attrs:{type:"primary"},on:{click:function(e){a.prepareToCrawlFlag=true}}},[a._v("\n          "+a._s(a.rankingListData.length===0?"获取索引":"重新获取索引")+"\n        ")])],1),a._v(" "),n("el-col",{attrs:{span:2}},[!a.crawlingFlag?n("el-button",{attrs:{disabled:a.rankingListData.length===0,type:"primary"},on:{click:a.beginToCrawRankingListMovieData}},[a._v("\n          "+a._s(a.crawlingCount===0?"开始抓取":"重新抓取")+"\n        ")]):n("el-button",{attrs:{type:"danger"},on:{click:a.stopCrawling}},[a._v("停止抓取")])],1),a._v(" "),n("el-col",{staticStyle:{"text-align":"right"},attrs:{span:20}},[n("el-button",{attrs:{type:"primary"},on:{click:a.save}},[a._v("保存")])],1)],1),a._v(" "),n("el-divider"),a._v(" "),n("el-row",[n("el-col",{attrs:{span:24}},[n("el-row",{attrs:{justify:"left",type:"flex"}},[n("el-col",{attrs:{span:14}},[n("el-input-number",{attrs:{min:0},model:{value:a.rankingListCountLimit,callback:function(e){a.rankingListCountLimit=e},expression:"rankingListCountLimit"}}),a._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:a.handleChangeCounter}},[a._v("确定")])],1),a._v(" "),n("el-col",{attrs:{span:3}})],1),a._v(" "),n("el-row",[n("el-col",{attrs:{span:24}},[n("el-card",{attrs:{shadow:"never"}},[n("el-progress",{attrs:{percentage:a.rankingListData.length!==0?Math.floor(a.crawlingCount/a.rankingListData.length*100):0,"stroke-width":20,"text-inside":true,status:"success"}}),a._v(" "),n("el-divider",[n("el-row",[a.rankingListData.length>0&&a.crawlingCount<a.rankingListData.length?n("el-col",{attrs:{span:24}},[a._v("\n                    共有"+a._s(a.rankingListData.length)+"条数据，正在抓取第"+a._s(a.crawlingCount)+"条...\n                  ")]):n("el-col",{attrs:{span:24}},[a._v("\n                    共有"+a._s(a.rankingListData.length)+"条数据，抓取完毕\n                  ")])],1)],1),a._v(" "),n("el-row",{attrs:{justify:"left",type:"flex"}},[n("el-col",{attrs:{span:24}},[n("el-timeline",{style:a.crawlerStyle},a._l(a.rankingListData.filter(function(e){return!e.disabled}),function(e,t){return n("el-timeline-item",{key:t,staticClass:"timelineitem",attrs:{color:e.color==="success"?"#91d929":"#e4e7ed",timestamp:e.recordTime,placement:"top"}},[n("el-card",{attrs:{shadow:"hover"}},[n("el-row",[n("el-col",{staticStyle:{"text-align":"left"},attrs:{span:1}},[a._v("第"+a._s(t+1)+"条")]),a._v(" "),n("el-col",{staticStyle:{"text-align":"left"},attrs:{span:1}},[a._v(a._s(e.movieId))]),a._v(" "),n("el-col",{staticStyle:{"text-align":"left"},attrs:{span:4}},[a._v(a._s(e.title))]),a._v(" "),n("el-col",{attrs:{span:1}},[a._v("\n                            详情: "),e.detailSuccess===0?n("i",{}):e.detailSuccess===1?n("i",{staticClass:"el-icon-check success"}):n("i",{staticClass:"el-icon-close failed"})]),a._v(" "),n("el-col",{attrs:{span:1}},[a._v("\n                            更多: "),e.moreSectionsSuccess===0?n("i",{}):e.moreSectionsSuccess===1?n("i",{staticClass:"el-icon-check success"}):n("i",{staticClass:"el-icon-close failed"})]),a._v(" "),n("el-col",{attrs:{span:1}},[a._v("\n                            评分: "),e.rankingListRatingSuccess===0?n("i",{}):e.rankingListRatingSuccess===1?n("i",{staticClass:"el-icon-check success"}):n("i",{staticClass:"el-icon-close failed"})]),a._v(" "),n("el-col",{attrs:{span:1}},[a._v("\n                            想看: "),e.rankingListWantToSeePortraitSuccess===0?n("i",{}):e.rankingListWantToSeePortraitSuccess===1?n("i",{staticClass:"el-icon-check success"}):n("i",{staticClass:"el-icon-close failed"})]),a._v(" "),n("el-col",{attrs:{span:2}},[a._v("\n                            首映日票房: "),e.rankingListWantToSeePortraitSuccess===0?n("i",{}):e.rankingListWantToSeePortraitSuccess===1?n("i",{staticClass:"el-icon-check success"}):n("i",{staticClass:"el-icon-close failed"})]),a._v(" "),n("el-col",{attrs:{span:2}},[a._v("\n                            全球票房: "),e.rankingListBoxOfficeGlobalSuccess===0?n("i",{}):e.rankingListBoxOfficeGlobalSuccess===1?n("i",{staticClass:"el-icon-check success"}):n("i",{staticClass:"el-icon-close failed"})])],1)],1)],1)}),1)],1)],1)],1)],1)],1)],1)],1),a._v(" "),n("el-row",{attrs:{justify:"space-between",type:"flex"}},[n("el-col",{attrs:{span:21}}),a._v(" "),n("el-col",{staticStyle:{"text-align":"right"},attrs:{span:3}},[n("el-button",{attrs:{type:"primary"},on:{click:function(e){a.stepCrawlFlag=false}}},[a._v("关闭")])],1)],1)],1),a._v(" "),n("el-dialog",{attrs:{visible:a.prepareToCrawlFlag,title:"准备爬取",width:"600px"},on:{"update:visible":function(e){a.prepareToCrawlFlag=e}}},[n("el-radio-group",{on:{change:a.handleChangeLimitType},model:{value:a.crawlerCountType,callback:function(e){a.crawlerCountType=e},expression:"crawlerCountType"}},[n("el-radio",{attrs:{label:0}},[a._v("全部")]),a._v(" "),n("el-radio",{attrs:{label:1}},[a._v("部分")]),a._v(" "),n("el-input-number",{attrs:{disabled:a.crawlerCountType===0,min:0},on:{change:a.handleChangeCountLimit},model:{value:a.rankingListCountLimit,callback:function(e){a.rankingListCountLimit=e},expression:"rankingListCountLimit"}})],1),a._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:a.getAllCrawlingIndex}},[a._v("开始抓取列表")])],1)],1)};var i=[];n._withStripped=true;a.d(t,"a",function(){return n});a.d(t,"b",function(){return i})},vPuT:function(e,t,a){"use strict";a.r(t);var n=a("02K0");var i=a.n(n);for(var r in n)if(r!=="default")(function(e){a.d(t,e,function(){return n[e]})})(r);t["default"]=i.a}}]);