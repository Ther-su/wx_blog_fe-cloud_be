// pages/article_detail/index.js
import {request} from "../../request/index.js"
import {showToast,getArticleType,getArticleTime} from "../../utils/asyncWx.js"
const WxParse=require('../../utils/wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  timer:null,
  data: {
    article:{},
    comment:[],
    oldComment:null,
    type:0,
    chosedIndex:-1,
    commentContent:'',
    commentId:0,
    isShowMask: false,
    hasLogin:false,
    commenterId: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        hasLogin:true
      })
    }
    const {id}=options
    this.getArticleDetail(id)
    this.getComment(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  handleInput(e){
    console.log(e);
    this.setData({
      commentContent:e.detail.value
    })
  },
  onReady: function () {

  },
  showMask(){
    this.isMask = true
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async collectArticle(){
    let article = this.data.article
    article.isCollect = !article.isCollect
    if(article.isCollect){
      article.collectNum+=1
    }else {
      article.collectNum-=1
    }
    try{
      const {message} = await request({
        name:'collectArticle',
        data:{
          isCollect:article.isCollect,
          id:article._id
        }
      })
      if(message!="ok"){
        await showToast({
          title:message
        })
      }else {
        const userInfo=wx.getStorageSync('userInfo');
        userInfo.collectArticle+=1
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          article:article
        })
      }
      
    }catch(err){
      console.log(err);
    }
  },
  async getComment(id){
    let res = (await request({
      name:'getComment',
      data:{
        articleId:id
      }
    })).list
    res = res.map((v)=>{
      v.time = getArticleTime(v.time)
      return v
    })
    this.setData({
      comment:res
    })
  },
  async likeArticle(){
    let article = this.data.article
    article.isLike = !article.isLike
    if(article.isLike){
      article.likeNum+=1;
    }else {
      article.likeNum-=1;
    }
    const {message}=await request({
      name:'likeArticle',
      data:{
        isLike:article.isLike,
        id:article._id
      }
    })
    if(message!="ok"){
      await showToast({
        title:message
      })
    }else {
      this.setData({
        article:article
      })
    }
  },
  async careAuthor(){
    let article = this.data.article
    article.isCare = !article.isCare
    const {message}=await request({
      name:'careAuthor',
      data:{
        isCare:article.isCare,
        authorId:article.authorId
      }
    })
    if(message!="ok"){
      await showToast({
        title:message
      })
    }else {
      let turnNum=0;
      if(article.isCare){
        turnNum=1;
      }else{
        turnNum=-1;
      }
      const userInfo=wx.getStorageSync('userInfo');
      userInfo.careAuthor+=turnNum
      wx.setStorageSync('userInfo', userInfo);
      this.setData({
        article:article
      })
    }
  },
  onShow: function () {
    // let pages=getCurrentPages()
    // let currentPage=pages[pages.length-1]
    // let options=currentPage.options
  },
  async getArticleDetail(id){
    const {list}=await request({
      name:'getArticleDetail',
      data:{
        id:id
      },
    })
    list[0].type=getArticleType(list[0].type)
    list[0].time=getArticleTime(list[0].time)
    const that=this
    WxParse.wxParse('blog','html',list[0].content,that,0)
    this.setData({
      article:list[0]
    })
  },
  changeCommenter(e){
    const {index,name,commentid,commenterid} = e.detail
    console.log(e.detail)
    this.setData({
      oldComment:name,
      type:1,
      chosedIndex:index,
      commentId:commentid,
      commenterId:commenterid
    })
  },
  handleFocus() {
    this.setData({
      pageHeight:wx.getSystemInfoSync().windowHeight,
      isShowMask: true
    })
  },
  async sumbit(e) {
    console.log(e);
    if(this.data.type==0){
      const info = {
        time:Date.now(),
        content:this.data.commentContent,
        articleId:this.data.article._id,
      } 
      const res=await request({
        name:'addComment',
        data:info,
      })
      let {comment} = this.data
      info.time=getArticleTime(info.time)
      info.apply = []
      info.nickName = res.nickName
      info.avatarUrl = res.avatarUrl
      info.commenterId = res.commenterId
      comment.push(info)
      this.setData({
        comment:comment
      })
    } else if(this.data.type==1){
      const info = {
        reviewer:this.data.oldComment,
        time:Date.now(),
        content:this.data.commentContent,
        commentId:this.data.commentId,
        commenterId:this.data.commenterId,
        articleId:this.data.article._id
      }
      const res=await request({
        data: info,
        name:'replyComment'
      })
      let {comment} = this.data
      info.responder = res.nickName
      info.commenterId = res.commenterId
      info.time=getArticleTime(info.time)
      comment[this.data.chosedIndex].apply.push(info)
      this.setData({
        comment:comment,
        type:0
      })
    }
    const {article} = this.data
    article.commentNum +=1
    this.setData({
      commentContent: '',
      article
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})