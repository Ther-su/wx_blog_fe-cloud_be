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

  /**
   * 组件的初始数据
   */
  data: {

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
