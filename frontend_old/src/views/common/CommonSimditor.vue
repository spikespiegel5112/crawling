<template>
  <div class="editor  aaaa" ref="editor" :style="editorStyle">
    <!--<el-input type="textarea"  :model="editorContentInner"></el-input>-->
    <div id="editor" v-model="editorContentInner"></div>
    <!--<button v-on:click="getContent">查看内容</button>-->
  </div>
</template>

<script>
  import Simditor from 'simditor_modified'
  // import Simditor from '/static/assets/js/simditor/simditor.js'

  export default {
    props: {
      config: {
        type: Object,
        default: {
          textarea: $('#editor'),
          placeholder: '',
          defaultImage: 'images/image.png',
          params: {},
          upload: false,
          tabIndent: true,
          toolbar: true,
          toolbarFloat: true,
          toolbarFloatOffset: 0,
          toolbarHidden: false,
          pasteImage: false,
          cleanPaste: false
        },
        required: false
      },
      editorContent: {
        type: String,
        // default:function () {
        //   return {}
        // },
        default: '',
        required: false
      },
      imageServer: {
        type: String,
        default: '',
        required: false
      },
      toolbar: {
        type: Array,
        default: function () {
          return [
            'title',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'fontScale',
            'color',
            'ol',             // ordered list
            'ul',             // unordered list
            'blockquote',
            'code',           // code block
            'table',
            'link',
            'image',
            'hr',             // horizontal ruler
            'indent',
            'outdent',
            'alignment'
          ]
        },
        required: false
      },
      height: {
        type: Number,
        default: 300,
        required: false
      }
    },
    data() {
      return {
        editorInstance: {},
        editorContentInner: '',
        defaultConfig: {
          textarea: $('#editor'),
          placeholder: '',
          defaultImage: 'images/image.png',
          params: {},
          upload: false,
          tabIndent: true,
          toolbar: true,
          toolbarFloat: true,
          toolbarFloatOffset: 0,
          toolbarHidden: false,
          pasteImage: false,
          cleanPaste: false
        }
      }
    },
    computed: {
      layoutHeight() {
        return this.$store.state.layoutHeight;
      },
      editorStyle() {
        console.log(this.height)
        return {
          height: this.height + 'px',
        }
      }
    },
    watch: {
      editorContent(value) {
        console.log(value)

        this.editorContentInner = value;
        this.editorInstance.setValue(value);
      },
      editorContentInner(value) {
        // console.log(value)
      },
      config(value) {
        let params = Object.assign(this.defaultConfig, {
          textarea: $('#editor'),
        }, value);
        this.editorInstance = new Simditor(params);
        this.editorInstance.setValue(this.editorContent);
        this.editorInstance.on('valuechanged', (e, src) => {
          console.log(e)
          // console.log(this.editorInstance.getValue())
          this.editorContentInner = this.editorInstance.getValue();
          // console.log(this.editorContentInner)
          // console.log(src)
          this.$emit('update:editorContent', this.editorContentInner)
        })
        this.editorInstance.uploader.on('uploadsuccess', (e, fileObj, ddd) => {
          console.log(e)
          console.log(fileObj)
          console.log(ddd)
          console.log(this.editorInstance)
          this.editorInstance.readImageFile(fileObj, e => {
            console.log(e)
          })
        })
        this.editorInstance.on('uploadsuccess', (e, src) => {
          console.log(e)
        })
      },
      layoutHeight(value) {

      },
      init() {
      }
    },
    mounted() {
      this.editorInstance = new Simditor(Object.assign(this.defaultConfig, {
        textarea: $('#editor'),
      }));


      this.getHeight();

    },
    methods: {
      getContent() {

      },
      getHeight() {
        // document.querySelectorAll('.w-e-text-container')[0].style.height = this.layoutHeight - 260 + 'px'
      }
    }
  }
</script>
<style lang="css">
  .simditor{
    height: 100%;
    overflow: hidden;
  }
</style>
<style lang="scss">
  /*@import 'simditor/styles/simditor.scss';*/
  /*@import 'simditor/styles/fonticon.scss';*/
  /*@import 'simditor/styles/editor.scss';*/

</style>
