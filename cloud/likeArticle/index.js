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
        message:'不能点赞自己写的博文哦'
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
          isCollect:false,
          isLike:true
        }
      })
      await transaction.collection('article').where({
        _id:event.id
      }).update({
        data:{
          likeNum:_.inc(1)
        }
      })
      await transaction.commit()
    }else{
      await transaction.collection('articlehandle').where({
        readerId:wxContext.OPENID,
        articleId:event.id
      }).update({
        data:{
          isLike:event.isLike,
        }
      })
      let turnNum=0;
      if(event.isLike){
        turnNum=1
      }else{
        turnNum=-1
      }
      await transaction.collection('article').where({
        _id:event.id
      }).update({
        data:{
          likeNum:_.inc(turnNum)
        }
      })
      await transaction.commit()
    }
    return {
      message:'ok'
    }
  }catch(e){
    console.log(e);
    return {
      message:e
    }
  }
  
}