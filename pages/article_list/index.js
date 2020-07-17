// pages/article_list/index.js
import {request} from "../../request/index.js"
import {showToast} from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList:[]
  },
  pageParam:-1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleList(options.type)
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
    // let pages=getCurrentPages()
    // let currentPage=pages[pages.length-1]
    // let options=currentPage.options
    // const {type}=options
    // this.getArticleList(type)
  },
  async getArticleList(type){
    const {articleList,pageParam}=await request({
      url:'/article/type',
      data:{
        pageParam:this.pageParam,
        type:type
      },
      method:'GET'
    })
    this.setData({
      articleList:[...this.data.articleList,...articleList],
      pageParam
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
    this.setData({
      articleList:[]
    })
    let pages=getCurrentPages()
    let currentPage=pages[pages.length-1]
    let options=currentPage.options
    const {type}=options
    this.pageParam=-1
    this.getArticleList(type)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    if(this.pageParam>1){
      this.getArticleList()
    }else{
      await showToast({
        title:'没有更多数据了'
      })
      return
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})