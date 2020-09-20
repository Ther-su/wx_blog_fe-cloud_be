//Page Object
import {request} from "../../request/index.js"
import {showToast} from "../../utils/asyncWx.js"
Page({
  data: {
    newestArticle:[],
    hottestArticle:[],
    //showSkeleton: true,
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
  flagTime:null,
  page:1,
  pageSize:6,
  total:0,
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
    const {list}=await request({
      name:'getHotArticle',
    })
    this.setData({
      hottestArticle:list
    })
  },
  //options(Object)
  async getNewestArticle(){
    // if(this.page*this.pageSize>=this.total){
    //   await showToast({
    //     title:'没有更多数据了'
    //   })
    // }
    const {total,list}=await request({
      name:'getNewArticle',
      data:{
        page:this.page,
        pageSize:this.pageSize,
        flagTime:this.flagTime
      }
    })
    this.page++;
    this.total=total
    this.setData({
      newestArticle:[...this.data.newestArticle,...list]
    })
    
  },
  onLoad: function(options){
    this.flagTime=Date.now()
    this.getNewestArticle()
    this.upDateArticleRank()
    // const that = this;
		// setTimeout(() => {     //3S后隐藏骨架屏
		// 	that.setData({
		// 		showSkeleton: false
		// 	})
		// }, 1500)
  },
  onReady: function(){
    
  },
  onShow: function(){
    
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){
    if(this.requestType==0){
      this.flagTime=Date.now()
      this.setData({
        newestArticle:[]
      })
      this.page=1
      this.getNewestArticle()
      
    }
    else if(this.requestType==1){
      this.upDateArticleRank()
    }
    wx.stopPullDownRefresh()
  },
  onReachBottom: async function(){
    if(this.requestType==0){
      if(this.total<=this.page*this.pageSize){
        await showToast({
          title:'没有更多数据了'
        })
        return
      }
      this.getNewestArticle()
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