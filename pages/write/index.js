// pages/write1/index.js
import {chooseImage,showToast} from "../../utils/asyncWx.js"
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    submitArticle:{
      title:'',
      imageSrc:'',
      type:0
    },
    typeList:['前端','后端','数据库','计算机网络','算法','操作系统','数学','物理','外语','文学类','化工类','音乐类','舞蹈类','心理类','医学类','绘画类','经济类'],
  },
  bindPickerChange(e){
    let {submitArticle}=this.data
    submitArticle.type=e.detail.value
    this.setData({
      submitArticle
    })
  },
  handleInput(e){
    let {submitArticle}=this.data
    submitArticle.title=e.detail.value
    this.setData({
      submitArticle
    })
  },
  async handleSubmit(){
    if(!this.data.hasLogin){
      await showToast({
        title:'登录后才能编辑博文哦~'
      })
      return
    }
    wx.setStorageSync("submitArticle", this.data.submitArticle);
    wx.navigateTo({
      url: '/pages/edit/index',
    });
  },
  async uploadImage(){
    const res=await chooseImage()
    let {submitArticle}=this.data
    submitArticle.imageSrc=res.tempFilePaths[0]
    this.setData({
      submitArticle
    })
  },
  handleDelete(){
    let {submitArticle}=this.data
    submitArticle.title='',
    submitArticle.type=0,
    submitArticle.imageSrc=''
    this.setData({
      submitArticle
    })
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