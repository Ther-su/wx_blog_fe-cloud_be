// pages/author_detail/index.js
import {request} from "../../request/index.js"
import {showToast,getArticleType,getArticleTime} from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectArticleList: [],
    writeArticleList: [],
    author: {},
    tabs:[
      {
        id:0,
        value:"写的博文",
      },
      {
        id:1,
        value:"收藏的博文",
      }
    ],
    num:2,
    activeFlag:0,
    hasLogin:false
  },
  async handleTabsItemChange(e){
    const {index}=e.detail
    let {activeFlag}=this.data
    activeFlag=index
    this.requestType=index
    this.setData({
      activeFlag
    })
  },
  async getCollectArticle(id){
    const res=await request({
      url:`/author/${id}/article/collect`,
      method:'GET'
    })
    this.setData({
      collectArticleList:res
    })
  },
  async getWriteArticle(id){
    const res=await request({
      url:`/author/${id}/article/write`,
      method:'GET'
    })
    this.setData({
      writeArticleList:res
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = wx.getStorageSync('token');
    if(token){
      this.setData({
        hasLogin:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages=getCurrentPages()
    let currentPage=pages[pages.length-1]
    let options=currentPage.options
    const {id}=options
    this.getCollectArticle(id)
    this.getWriteArticle(id)
    this.getAuthorDetail(id)
  },
  async getAuthorDetail(id){
    const res=await request({
      url:`/author/${id}/detail`,
      method:'GET'
    })
    this.setData({
      author:res
    })
  },
  async careAuthor() {
    let author = this.data.author
    author.isCare = !author.isCare
    const {message}=await request({
      url:`/author/${this.data.author.id}/care`,
      method:'put',
      data:{
        isCare:author.isCare
      }
    })
    if(message!="ok"){
      await showToast({
        title:message
      })
    }else {
      this.setData({
        author:author
      })
    }
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