// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database();
  const _=db.command
  try{
    const {data}=await db.collection('article').where({
      _id:event.id
    }).get()
    if(data[0].authorId==wxContext.OPENID){
      return {
        message:'不能收藏自己写的博文哦'
      }
    }
    const row=await db.collection('articlehandle').where({
      readerId:wxContext.OPENID,
      articleId:event.id
    }).get()
    const transaction=await db.startTransaction()
    if(!row.data.length){
      await transaction.collection('articlehandle').add({
        data:{
          articleId:event.id,
          readerId:wxContext.OPENID,
          isCollect:true,
          isLike:false
        }
      })
      await transaction.collection('article').where({
        _id:event.id
      }).update({
        data:{
          collectNum:_.inc(1)
        }
      })
      await transaction.collection('user').where({
        openid:wxContext.OPENID
      }).update({
        data:{
          collectArticle:_.inc(1)
        }
      })
      await transaction.commit()
    }else{
      await transaction.collection('articlehandle').where({
        readerId:wxContext.OPENID,
        articleId:event.id
      }).update({
        data:{
          isCollect:event.isCollect,
        }
      })
      let turnNum=0;
      if(event.isCollect){
        turnNum=1
      }else{
        turnNum=-1
      }
      await transaction.collection('article').where({
        _id:event.id
      }).update({
        data:{
          collectNum:_.inc(turnNum)
        }
      })
      await transaction.collection('user').where({
        openid:wxContext.OPENID
      }).update({
        data:{
          collectArticle:_.inc(turnNum)
        }
      })
      await transaction.commit()
    }
  }catch(e){
    console.log(e);
  }
  return {
    message:'ok'
  }
}