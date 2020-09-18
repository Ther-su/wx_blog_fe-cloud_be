// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  const _=db.command
  try{
    const transaction=await db.startTransaction()
    await transaction.collection('comment').add({
      data:{
        articleId:event.articleId,
        commenterId:wxContext.OPENID,
        time:event.time,
        content:event.content
      }
    })
    const {data}=await transaction.collection('user').field({
      nickName:true,
      avatarUrl:true
    }).where({
      openid:wxContext.OPENID
    }).get()
    await transaction.collection('article').where({
      _id:event.articleId
    }).update({
      data:{
        commentNum:_.inc(1)
      }
    })
    await transaction.commit()
    data[0].commenterId = wxContext.OPENID
    return data[0]
  }catch(e){
    return {message:'发生未知错误'}
  }
}