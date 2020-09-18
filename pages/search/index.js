// pages/search/search.js
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles:[],
    isFoucus:false,
    inpValue:''
  },
  TimeId:-1,
  handleInput(e){
    const {value}=e.detail
    if(!value.trim()){
      this.setData({
        articles:[],
        isFoucus:false
      })
      return
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId)
    this.TimeId=setTimeout(()=>{
      this.qsearch(value)
    },800)
  },
  handleCancel(){
    this.setData({
      inpValue:'',
      isFocus:false,
      articles:[]
    })
  },
  async qsearch(query){
    const {list}=await request({name:"search",data:{query}})
    this.setData({
      articles:list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
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