// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  const $=db.command.aggregate
  const _=db.command
  const {list}=await db.collection('comment')
    .aggregate()
    .lookup({
      from:'user',
      let:{
        commenterId:'$commenterId'
      },
      pipeline:$.pipeline()
        .match(_.expr(
          $.eq(['$$commenterId','$openid'])
        ))
        .project({
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
    .project({
      authorList:0,
    })
    .match({
      articleId:event.articleId
    })
    .end()
  for(let j=0;j<list.length;j++){
    const res=await db.collection('reply')
    .aggregate()
    .lookup({
      from:'user',
      let:{
        reviewerId:'$reviewerId'
      },
      pipeline:$.pipeline()
        .match(_.expr(
          $.eq(['$$reviewerId','$openid'])
        ))
        .addFields({
          reviewer:'$nickName'
        })
        .project({
          _id:0,
          gender:0,
          school:0,
          major:0,
          openid:0,
          careAuthor:0,
          collectArticle:0,
          writeArticle:0,
          avatarUrl:0
        })
        .done(),
      as:'authorList1'
    })
    .lookup({
      from:'user',
      let:{
        responderId:'$responderId'
      },
      pipeline:$.pipeline()
        .match(_.expr(
          $.eq(['$$responderId','$openid'])
        ))
        .addFields({
          responder:'$nickName'
        })
        .project({
          _id:0,
          gender:0,
          school:0,
          major:0,
          openid:0,
          careAuthor:0,
          collectArticle:0,
          writeArticle:0,
          avatarUrl:0
        })
        .done(),
      as:'authorList2'
    })
    .replaceRoot({
      newRoot:$.mergeObjects([ $.arrayElemAt(['$authorList1', 0]), '$$ROOT' ])
    })
    .replaceRoot({
      newRoot:$.mergeObjects([ $.arrayElemAt(['$authorList2', 0]), '$$ROOT' ])
    })
    .project({
      nickName:0,
      authorList1:0,
      authorList2:0
    })
    .match({
      commentId:list[j]._id
    })
    .addFields({
      commenterId:'$reviewerId'
    })
    .end()
    list[j].apply=res.list
  }
  return {
    list
  }
}