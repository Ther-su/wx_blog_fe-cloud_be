// components/CommentBox/CommentBox.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    comment:{
      type:Array,
      value:[]
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
    changeCommenter(e){
      console.log(e);
      const {index,name,commentid,commenterid} = e.currentTarget.dataset
      this.triggerEvent("changeCommenter",{index,name,commentid,commenterid})
    },
  }
})
