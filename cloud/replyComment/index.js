// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database();
  const _=db.command
  try{
    const transaction=await db.startTransaction()
    await transaction.collection('reply').add({
      data:{
        commentId:event.commentId,
        reviewerId:event.commenterId,
        responderId:wxContext.OPENID,
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
    // const getArticleTime=(originVal)=>{
    //   const dt = new Date(parseInt(originVal))
    //   const y = dt.getFullYear()
    //   const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    //   const d = (dt.getDate() + 1 + '').padStart(2, '0')
    //   const hh = (dt.getHours() + '').padStart(2, '0')
    //   const mm = (dt.getMinutes() + '').padStart(2, '0')
    //   const ss = (dt.getSeconds() + '').padStart(2, '0')
    //   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    // }
    // await cloud.openapi.subscribeMessage.send({
    //   touser: event.commenterId,
    //   page: 'index',
    //   lang: 'zh_CN',
    //   data: {
    //     thing1: {
    //       value:event.commenterId
    //     },
    //     thing2: {
    //       value:event.content
    //     },
    //     time3: {
    //       value: getArticleTime(event.time)
    //     },
    //   },
    //   templateId: 'WMZMuwklfvhu2tD2X9pJ0dugBwzNCa-MqmWuqC3ObLY',
    //   miniprogramState: 'trial'
    // })

    await transaction.collection('article').where({
      _id:event.articleId
    }).update({
      data:{
        commentNum:_.inc(1)
      }
    })
    await transaction.commit()
    data[0].commenterId = wxContext.OPENID
    return {
      list:data[0],
      message:'ok'
    }
  }catch(e){
    console.log(e);
    return {
      message:JSON.stringify(e)
    }
  }
}