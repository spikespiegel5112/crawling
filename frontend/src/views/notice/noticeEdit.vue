<template xmlns="">
    <el-container class="common-maincontent-wrapper">
      <el-main class="common-notice-wrapper">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form ref="editNoticeFromTitle" :model="formData"
                     :rules="rules"
                     label-width="100px"
                     size="small">
              <el-form-item label="标题" prop="noticeTile">
                <el-input v-model="formData.noticeTile"></el-input>
              </el-form-item>
              <el-form-item label="副标题" prop="deviceType">
                <el-input type="textarea" v-model="formData.summary"></el-input>
              </el-form-item>
              <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="formData.deviceType">
                  <el-option v-for="item in $store.state.app.deviceType"
                             :value="item.code"
                             :label="item.name"
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="management-noticeedit-wrapper">
          <el-form ref="editNoticeFromContent"
                   :model="formData"
                   :rules="rules"
                   label-width="0"
                   size="small">
            <el-form-item label="" prop="content">
              <CommonSimditor :config="simditorConfig"
                              :editorContent.sync="formData.content"
                              :changeEditorContent="changeEditorContent"
                              :height='editorHeight'
              />
            </el-form-item>
          </el-form>
        </div>
        <el-row class="footer">
          <el-col class="operator-wrapper" :span="15">
            <el-button class="" type="primary" size="small" @click="publish">发布</el-button>
            <el-button class="" type="info" size="small" @click="cancelEdit">取消</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
</template>

<script>
  import CommonWangEditor from '@/views/common/CommonWangEditor.vue'
  import CommonSimditor from '@/views/common/CommonSimditor.vue'

  export default {
    name: "dashboard",
    components: {
      CommonSimditor
    },
    data() {
      return {
        queryNoticedetailRequest: 'notice-service/1.0.0/queryNoticedetail',
        updateNoticeRequest: 'notice-service/1.0.0/updateNotice',
        addAndUpdateNoticeRequest: 'notice-service/1.0.0/addAndUpdateNotice',
        loading: false,
        submitting: false,
        activated: false,
        expandQuery: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        noticeDetailData: {},
        editorConfig: {
          height: Number(this.$store.state.app.layoutHeight - 290)
        },
        formData: {
          "id": '',
          "noticeTile": '',
          "noticeType": '',
          "image": '',
          "content": '',
          "noticeUrl": '',
          "noticeStatus": '',
          "noticeDate": '',
          "deviceType": '',
          "videoUrl": '',
          "level": '',
          "summary": ''
        },
        simditorConfig: {},
        rules: {
          noticeTile: [{
            required: true,
            message: '请输入标题',
            trigger: 'change'
          }],
          deviceType: [{
            required: true,
            message: '此项为必填项',
            trigger: 'change'
          }],
          content: [{
            required: true,
            message: '公告内容不能为空',
            trigger: 'change'
          }],

        },
      };
    },
    computed: {
      noticeId() {
        return this.$route.query.noticeId;
      },
      layoutHeight() {
        return this.$store.state.app.layoutHeight;
      },
      editorHeight() {
        return this.$store.state.app.layoutHeight - 290
      },
      currentUserType() {
        return this.$store.state.app.personalProfile.user.userType;
      }
    },
    watch: {
      'formData.content': function (value) {
        // console.log(value)
      }
    },
    mounted() {
      console.log(this.$store.state.app.layoutHeight)

      this.activated = true;
      if (this.$route.query.id !== null) {
        this.getDetailData();
      }
      setTimeout(() => {
        this.simditorConfig = {
          toolbar: [
            'title',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'fontScale',
            'color',
            'ol',
            'ul',
            'blockquote',
            'code',
            'table',
            'link',
            'image',
            'hr',
            'indent',
            'outdent',
            'alignment',
          ],
          upload: {
            url: this.$prodBaseUrl + 'image-upload-service/1.0.0/file/upload', //文件上传的接口地址
            params: {
              bucketName: "funyvalley",
              folderName: "task"
            }, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
            fileKey: 'file', //服务器端获取文件数据的参数名
            connectionCount: 3,
            leaveConfirm: '正在上传文件',
            uploadSuccess(e, file, result) {
              console.log(result)
            }
          }
        }
      }, 500)
    },
    methods: {
      getDetailData() {
        console.log(this.noticeId)
        this.$http.post(this.$baseUrl + this.queryNoticedetailRequest, {
          "id": Number(this.$route.query.id),
          "deviceType": this.$route.query.deviceType
        }).then(response => {
          console.log(response)
          response = response.resultlist[0];
          this.formData.content = response.content;
          this.formData.deviceType = response.deviceType;
          this.formData.noticeTile = response.noticeTile;
        })
      },
      publish() {
        this.$refs['editNoticeFromTitle'].validate(valid => {
          if (valid) {
            this.$http.post(this.$baseUrl + this.addAndUpdateNoticeRequest, {
              "id": this.formData.id,
              "noticeTile": this.formData.noticeTile,
              "noticeType": this.formData.noticeType,
              "image": this.formData.image,
              "content": this.formData.content,
              "noticeUrl": this.formData.noticeUrl,
              "noticeStatus": this.formData.noticeStatus,
              "noticeDate": this.formData.noticeDate,
              "deviceType": this.formData.deviceType,
              "videoUrl": this.formData.videoUrl,
              "level": this.formData.level,
              "summary": this.formData.summary
            }).then(response => {
              console.log(response)
              this.$message.success('公告发布成功');
              this.$router.push({
                name: 'noticeList'
              })
            })
          }
        });
      },
      cancelEdit() {
        this.$confirm('确认取消编辑？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            name: 'noticeList'
          });
          this.$message({
            message: '已取消编辑'
          });
        });
      },
      changeEditorContent(data) {
        this.formData.content = data
      }
    }
  }

</script>
