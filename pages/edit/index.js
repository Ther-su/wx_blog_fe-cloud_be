import {chooseImage,showToast} from "../../utils/asyncWx.js"
import {request} from "../../request/index.js"
let imgArr=[]
Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      console.log(res);
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  async getText(){
    let submitArticle=wx.getStorageSync("submitArticle")
    submitArticle.type=parseInt(submitArticle.type)+1
    submitArticle.time=Date.now()
    if(!submitArticle.title){
      await showToast({
        title:'标题不能为空'
      })
      return
    }else if(!/^(\w|[\u4e00-\u9fa5]){1,10}$/.test(submitArticle.title)){
      await showToast({
        title:'标题长度不对哦'
      })
      return 
    }else if(!submitArticle.imageSrc){
      await showToast({
        title:'封面图片不能为空哦'
      })
      return
    }
    try {
      const res=await this.editorCtx.getContents()
      submitArticle.imageSrc= wx.getFileSystemManager().readFileSync(submitArticle.imageSrc,'base64')
      submitArticle.content = res.html
      submitArticle.time=Date.now()
      await request({
        name:'uploadArticle',
        data:submitArticle
      })
      let pages=getCurrentPages();
      pages[0].handleDelete()
      this.editorCtx.clear({
      })
      const userInfo=wx.getStorageSync('userInfo');
      userInfo.writeArticle+=1;
      wx.setStorageSync("userInfo", userInfo);
      await showToast({
        title:'上传博文成功'
      })
      wx.navigateBack({
        delta: 1
      });
    }catch(e){
      await showToast({
        title:e
      })
    }
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  async insertImage() {
    const res=await chooseImage()
    let base64= 'data:image/png;base64,'+wx.getFileSystemManager().readFileSync(res.tempFilePaths[0],'base64')
    // const {imgUrl}=await request({
    //   url:'/my/article/image',
    //   method:'POST',
    //   data:{image:base64},
    //   header:{'content-type':'application/json'},
    // })
    this.editorCtx.insertImage({
      src:base64,
      width:'80%',
    })
  }
})
