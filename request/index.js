let ajaxTimes=0
export const request=(params)=>{
  ajaxTimes++
  //const baseUrl = "https://57e799493024.ngrok.io"
  //const baseUrl = "http://139.9.137.102:8080"
  //const baseUrl = 'https://localhost:8080'
  // const baseUrl = 'https://www.fileaccent.cn'
  return new Promise((resolve,reject)=>{
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.cloud.callFunction({
      name:params.name,
      data:params.data,
      success: (result)=>{
        resolve(result.result)
      },
      fail: (err)=>{
        console.log(err);
        //reject(err.response.data)
      },
      complete: ()=>{
        ajaxTimes--
        if(ajaxTimes===0){
          wx.hideLoading();
        }
      }
    });
  })
}

