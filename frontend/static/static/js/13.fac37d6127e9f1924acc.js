(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{c11S:function(e,n,t){"use strict";var r=t("tgJf");var a=t.n(r);var s=a.a},k2lJ:function(e,n,t){"use strict";var r=function(){var n=this;var e=n.$createElement;var t=n._self._c||e;return t("div",{staticClass:"login-container"},[t("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{autoComplete:"on",model:n.loginForm,rules:n.loginRules,"label-position":"right"}},[t("h3",{staticClass:"title"},[n._v("\n      趣谷\n      "),n.$prodEnv?t("div",{staticClass:"common_environmenthint_item"},[n._v("\n        测试环境\n      ")]):n._e()]),n._v(" "),t("el-form-item",{attrs:{prop:"username"}},[t("span",{staticClass:"svg-container svg-container_login"},[t("svg-icon",{attrs:{"icon-class":"user"}})],1),n._v(" "),t("el-input",{attrs:{name:"username",type:"text",autoComplete:"on",placeholder:"username"},model:{value:n.loginForm.username,callback:function(e){n.$set(n.loginForm,"username",e)},expression:"loginForm.username"}})],1),n._v(" "),t("el-form-item",{attrs:{prop:"password"}},[t("span",{staticClass:"svg-container"},[t("svg-icon",{attrs:{"icon-class":"password"}})],1),n._v(" "),t("el-input",{attrs:{name:"password",type:n.pwdType,autoComplete:"on",placeholder:"password"},nativeOn:{keyup:function(e){if(!e.type.indexOf("key")&&n._k(e.keyCode,"enter",13,e.key,"Enter")){return null}return n.handleLogin(e)}},model:{value:n.loginForm.password,callback:function(e){n.$set(n.loginForm,"password",e)},expression:"loginForm.password"}}),n._v(" "),t("span",{staticClass:"show-pwd",on:{click:n.showPwd}},[t("svg-icon",{attrs:{"icon-class":"eye"}})],1)],1),n._v(" "),t("el-form-item",[t("el-button",{staticStyle:{width:"100%"},attrs:{type:"primary",loading:n.loading},nativeOn:{click:function(e){e.preventDefault();return n.handleLogin(e)}}},[n._v("\n        Sign in\n      ")])],1)],1)],1)};var a=[];r._withStripped=true;t.d(n,"a",function(){return r});t.d(n,"b",function(){return a})},mYxE:function(e,n,t){"use strict";t.r(n);var r=t("vFRQ");var a=t.n(r);for(var s in r)if(s!=="default")(function(e){t.d(n,e,function(){return r[e]})})(s);n["default"]=a.a},ntYl:function(e,n,t){"use strict";t.r(n);var r=t("k2lJ");var a=t("mYxE");for(var s in a)if(s!=="default")(function(e){t.d(n,e,function(){return a[e]})})(s);var o=t("c11S");var i=t("yg12");var l=t("KHd+");var u=Object(l["a"])(a["default"],r["a"],r["b"],false,null,"37dfd6fc",null);if(false){var c}u.options.__file="src/views/login/index.vue";n["default"]=u.exports},tgJf:function(e,n,t){if(false){var r}},u2s3:function(e,n,t){if(false){var r}},vFRQ:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:true});var r=t("p46w");var a=s(r);function s(e){return e&&e.__esModule?e:{default:e}}n.default={name:"login",data:function e(){var n=function e(n,t,r){if(t.length<5){r(new Error("密码不能小于5位"))}else{r()}};return{userInfoRequest:"uaa/user",loginRequest:"uaa/oauth/token",loginForm:{username:"",password:"",grant_type:"password"},loginRules:{username:[{required:true,trigger:"change"}],password:[{required:true,trigger:"change",validator:n}]},loading:false,pwdType:"password"}},methods:{showPwd:function e(){if(this.pwdType==="password"){this.pwdType=""}else{this.pwdType="password"}},handleLogin:function e(){var n=this;this.$refs.loginForm.validate(function(e){if(e){n.$router.push({path:"/"})}else{console.log("error submit!!");return false}})}}}},yg12:function(e,n,t){"use strict";var r=t("u2s3");var a=t.n(r);var s=a.a}}]);