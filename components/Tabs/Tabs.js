// components/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    },
    num:{
      type:Number,
      value:0
    },
    activeFlag:{
      type:Number,
      value:0
    }
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
  /**
   * 组件的初始数据
   */
  data: {
    isShow:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e) {
      const {index} = e.currentTarget.dataset
      this.triggerEvent("tabsItemChange",{index})
    }
  }
})
