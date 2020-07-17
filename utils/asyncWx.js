export const login=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      },
      complete: ()=>{}
    });
  })
}

export const chooseImage=()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      },
      complete: ()=>{}
    });
  })
}


export const uploadFile=(params)=>{
  return new Promise((resolve,reject)=>{
    wx.uploadFile({
      url: params.url,
      filePath: params.filePath,
      name: params.name,
      formData: params.formData,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      },
      complete: ()=>{}
    });
  })
}

export const showToast=({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      mask: false,
      success: (res)=>{
        resolve(res)
      },
      fail: (err)=>{
        reject(err)
      },
      complete: ()=>{}
    });
  })
}

export const getArticleType=(flag)=>{
  flag=parseInt(flag)
  switch(flag){
    case 1:return '前端'
    case 2:return '后端'
    case 3:return '数据库'
    case 4:return '计算机网络'
    case 5:return '算法'
    case 6:return '操作系统'
    case 7:return '数学'
    case 8:return '物理'
    case 9:return '外语'
    case 10:return '文学类'
    case 11:return '化工类'
    case 12:return '音乐类'
    case 13:return '舞蹈类'
    case 14:return '心理类'
    case 15:return '医学类'
    case 16:return '绘画类'
    case 17:return '经济类'
  }
}

export const getArticleTime=(originVal)=>{
  const dt = new Date(parseInt(originVal))
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + 1 + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}