// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  const $=db.command.aggregate
  const _=db.command
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
          _id:0
        })
        .done(),
      as:'authorList'
    })
    .replaceRoot({
      newRoot:$.mergeObjects([ $.arrayElemAt(['$authorList', 0]), '$$ROOT' ])
    })
    .addFields({
      image:$.concat(['cloud://ther-su-gomzo.7468-ther-su-gomzo-1300960888/cover_img/','$_id','.jpg']),
      sum:$.add(['$commentNum','$likeNum','$collectNum']),
      author:'$nickName',
    })
    .sort({
      sum:-1
    })
    .project({
      sum:0,
      openid:0,
      content:0,
      authorId:0,
      authorList:0,
      gender:0,
      avatarUrl:0,
      school:0,
      major:0,
      nickName:0
    })
    .limit(10)
    .end()
  return {
    list,
    success:true
  }
}