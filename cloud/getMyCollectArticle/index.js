// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database();
  const $=db.command.aggregate
  const _=db.command
  try{
    const {list}=await db.collection('article')
    .aggregate()
    .lookup({
      from:'user',
      let:{
        authorId:'$authorId'
      },
      pipeline:$.pipeline()
        .match(_.expr(
          $.eq(['$$authorId','$openid'])
        ))
        .project({
          avatarUrl:0,
          _id:0,
          gender:0,
          school:0,
          major:0,
          openid:0,
          careAuthor:0,
          collectArticle:0,
          writeArticle:0
        })
        .done(),
      as:'authorList'
    })
    .replaceRoot({
      newRoot:$.mergeObjects([ $.arrayElemAt(['$authorList', 0]), '$$ROOT' ])
    })
    .lookup({
      from:'articlehandle',
      let:{
        aId:'$_id'
      },
      pipeline:$.pipeline()
        .match(_.expr($.and([
          $.eq(['$$aId','$articleId']),
          $.eq(['$readerId',wxContext.OPENID]),
        ])))
        .project({
          _id:0,
        })
        .done(),
      as:'handleList'
    })
    .replaceRoot({
      newRoot:$.mergeObjects([ $.arrayElemAt(['$handleList', 0]), '$$ROOT' ])
    })
    .addFields({
      author:'$nickName',
    })
    .match({
      isCollect:true
    })
    .project({
      authorList:0,
      nickName:0,
      authorId:0,
      content:0,
      handleList:0,
      isLike:0
    })
    .end()
    return {
      message:'ok',
      list
    }
  }catch(e){
    return {
      message:'发生了未知错误'
    }
  }
}