// pages/my/index.js
import {login,showToast} from "../../utils/asyncWx.js"
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async login(e){
    const {userInfo}=e.detail
    const {writeArticle,collectArticle,careAuthor}=await request({
      name:'login',
      data:{
        nickName:userInfo.nickName,
        gender:userInfo.gender,
        avatarUrl:userInfo.avatarUrl
      }
    })
    userInfo.writeArticle = writeArticle
    userInfo.collectArticle = collectArticle
    userInfo.careAuthor = careAuthor
    this.setData({
      hasLogin:true,
      userInfo
    })
    wx.setStorageSync("userInfo", userInfo);
    await showToast({
      title:'可以点击个人信息去玩善你的学校信息哦'
    })
  },
  onLoad: function (options) {

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
    const userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      this.setData({
        hasLogin:true,
        userInfo
      })
    }
  },
  about (){
    wx.showModal({
      title: '关于我们',
      content: '本博客由Ther,一个普通的代码爱好者开发',
      
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