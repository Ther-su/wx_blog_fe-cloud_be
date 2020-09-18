// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database();
  const _=db.command
  try{
    if(event.authorId==wxContext.OPENID){
      return {
        message:'不能关注自己哦'
      }
    }
    const row=await db.collection('care').where({
      readerId:wxContext.OPENID,
      authorId:event.authorId
    }).get()
    const transaction=await db.startTransaction()
    if(!row.data.length){
      await transaction.collection('care').add({
        data:{
          authorId:event.authorId,
          readerId:wxContext.OPENID,
          isCare:true,
        }
      })
      await transaction.collection('user').where({
        openid:wxContext.OPENID
      }).update({
        data:{
          careAuthor:_.inc(1)
        }
      })
      await transaction.commit()
    }else{
      let turnNum=0
      await transaction.collection('care').where({
        readerId:wxContext.OPENID,
        authorId:event.authorId
      }).update({
        data:{
          isCare:event.isCare
        }
      })
      if(event.isCare){
        turnNum=1
      }else{
        turnNum=-1
      }
      await transaction.collection('user').where({
        openid:wxContext.OPENID
      }).update({
        data:{
          careAuthor:_.inc(turnNum)
        }
      })
      await transaction.commit()
    }
    return {
      message:'ok'
    }
  }catch(e){
    return {
      message:e
    }
  }
}