// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database();
  const $=db.command.aggregate
  const _=db.command
  try {
    const {list}=await db.collection('user')
    .aggregate()
    .lookup({
      from:'care',
      let:{
        openid:'$openid'
      },
      pipeline:$.pipeline()
        .match(_.expr($.and([
          $.eq(['$authorId','$$openid']),
          $.eq(['$readerId',wxContext.OPENID]),
        ])))
        .project({
          _id:0,
        })
        .done(),
      as:'authorList'
    })
    .replaceRoot({
      newRoot:$.mergeObjects([ $.arrayElemAt(['$authorList', 0]), '$$ROOT' ])
    })
    .match({
      isCare:true
    })
    .project({
      openid:0,
      authorList:0,
    })
    .end()
    return {
      list,
      message:'ok'
    }
  }catch(e){
    console.log(e);
  }
}