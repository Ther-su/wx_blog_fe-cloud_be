// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  const _=db.command
  const $=db.command.aggregate
  const res=await db.collection('article')
  .aggregate()
  .lookup({
    from:'user',
    let:{
      authorId:'$authorId'
    },
    pipeline:$.pipeline()
      .match(_.expr(
        $.eq(['$$authorId','$openid']),
      ))
      .addFields({
        author:'$nickName'
      })
      .project({
        _id:0,
        nickName:0
      })
      .done(),
    as:'authorList'
  })
  .replaceRoot({
    newRoot:$.mergeObjects([ $.arrayElemAt(['$authorList', 0]), '$$ROOT' ])
  })
  .match(_.or([
    {
      title:eval('/'+event.query+'/i')
    },
    {
      author:eval('/'+event.query+'/i')
    }
  ]))
  .project({
    authorList:0,
    gender:0,
    collectArticle:0,
    writeArticle:0,
    careAuthor:0,
    school:0,
    major:0,
    type:0,
    time:0,
    authorId:0,
    content:0,
    commentNum:0,
    likeNum:0,
    collectNum:0,
    avatarUrl:0
  })
  .end()
  return res
}