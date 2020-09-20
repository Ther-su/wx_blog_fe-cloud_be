// pages/article_list/index.js
import {request} from "../../request/index.js"
import {showToast} from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList:[],
    showSkeleton: true
  },
  total:0,
  page:1,
  pageSize:10,
  flagTime:null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.flagTime=Date.now()
    this.getArticleList(options.type)
    const that = this;
		setTimeout(() => {     //3S后隐藏骨架屏
			that.setData({
				showSkeleton: false
			})
		}, 1000)
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
    const {list,total}=await request({
      name:'getArticleByType',
      data:{
        page:this.page,
        type:parseInt(type),
        pageSize:this.pageSize,
        flagTime:this.flagTime
      },
    })
    this.total=total
    this.page++
    this.setData({
      articleList:[...this.data.articleList,...list],
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
    this.flagTime=Date.now()
    let pages=getCurrentPages()
    let currentPage=pages[pages.length-1]
    let options=currentPage.options
    const {type}=options
    this.getArticleList(type)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    if(this.page*pageSize<total){
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