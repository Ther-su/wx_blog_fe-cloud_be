// components/listItem/listItem.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  lifetimes:{
    attached(){
      const that = this;
      setTimeout(() => {     
        that.setData({
          isShow: false
        })
      }, 1000)
    }
  },
  properties: {
    articleList:{
      type:Array,
      value:[]
    },
    isShow:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
