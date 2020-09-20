// pages/my_info/index.js
import {request} from "../../request/index.js"
import {showToast} from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showSkeleton: true
  },
  async submit (e){
    const {message}=await request({
      name:'modifyUserInfo',
      data:e.detail.value
    })
    if(message=='ok'){
      await showToast({
        title:'修改信息成功'
      })
    }else{
      await showToast({
        title:message
      })
    }
  },
  changeGender (e){
    const {userInfo}=this.data
    userInfo.gender = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
		setTimeout(() => {     //3S后隐藏骨架屏
			that.setData({
				showSkeleton: false
			})
		}, 1500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async getUserInfo (){
    const res = await request({
      name:'login',
    })
    this.setData({
      userInfo:res
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo()
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