//Page Object
import {request} from "../../request/index.js"
import {showToast} from "../../utils/asyncWx.js"
Page({
  data: {
    newestArticle:[],
    hottestArticle:[],
    tabs:[
      {
        id:0,
        value:"最新博文",
      },
      {
        id:1,
        value:"最热博文",
      }
    ],
    num:2,
    activeFlag:0,
    swiperList:[
      {
        id:1,
        image:'https://pic2.zhimg.com/80/3dd45eba4b086a548a2b017697a9119b_720w.jpg'
      },
      {
        id:2,
        image:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3508460332,1231097321&fm=26&gp=0.jpg'
      },
      {
        id:3,
        image:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1588588001535&di=508216a01fda26034a2c7a1a75c4bb7e&imgtype=0&src=http%3A%2F%2Fwww.cnr.cn%2Fjingji%2Ftxcj%2F20160727%2FW020160727318839106051.jpg'
      }
    ]
  },
  pageParam:-1,
  requestType:0,
  async handleTabsItemChange(e){
    const {index}=e.detail
    let {activeFlag}=this.data
    activeFlag=index
    this.requestType=index
    this.setData({
      activeFlag
    })
  },
  async upDateArticleRank(){
    const articleList=await request({
      url:'/article/rank',
      method:'GET',
    })
    this.setData({
      hottestArticle:articleList
    })
  },
  //options(Object)
  async getNewestArticle(){
    const {pageParam,articleList}=await request({
      url:'/article/page',
      method:'GET',
      data:{pageParam:this.pageParam}
    })
    this.pageParam=pageParam
    this.setData({
      newestArticle:[...this.data.newestArticle,...articleList]
    })
    
  },
  onLoad: function(options){
    
  },
  onReady: function(){
    
  },
  onShow: function(){
    this.pageParam = -1
    this.setData({
      newestArticle:[]
    })
    this.getNewestArticle()
    this.upDateArticleRank()
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){
    if(this.requestType==0){
      this.setData({
        newestArticle:[]
      })
      this.pageParam=-1
      this.getNewestArticle()
      
    }
    else if(this.requestType==1){
      this.upDateArticleRank()
    }
    wx.stopPullDownRefresh()
  },
  onReachBottom: async function(){
    if(this.requestType==0){
      if(this.pageParam>1){
        this.getNewestArticle()
      }else{
        await showToast({
          title:'没有更多数据了'
        })
        return
      }
    }
  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});