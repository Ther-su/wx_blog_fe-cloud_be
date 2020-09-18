// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const db=cloud.database()
    const transaction=await db.startTransaction()
    const {_id}=await transaction.collection('article').add({
      data:{
        title:event.title,
        type:event.type,
        time:event.time,
        authorId:wxContext.OPENID,
        content:event.content,
        commentNum:0,
        likeNum:0,
        collectNum:0
      }
    })
    await cloud.uploadFile({
      cloudPath:`cover_img/${_id}.jpg`,
      fileContent:Buffer.from(event.imageSrc,'base64')
    })
    await transaction.collection('user').where({
      openid:wxContext.OPENID
    }).update({
      data:{
        writeArticle:_.inc(1)
      }
    })
    await transaction.commit()
    return {
      success:true
    }
  }catch(e){
    return {
      time:event.time,
      success:false,
      error:e
    }
  }
}