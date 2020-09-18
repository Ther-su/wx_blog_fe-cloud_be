// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db=cloud.database()
  
  const $=db.command.aggregate
  const _=db.command
  const total = (await db.collection('article').where({time:_.lte(event.flagTime),type:event.type}).count())
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
      author:'$nickName',
    })
    .match({
      type:event.type,
      time:_.lte(event.flagTime)
    })
    .project({
      openid:0,
      content:0,
      authorId:0,
      authorList:0,
      gender:0,
      avatarUrl:0,
      school:0,
      major:0,
      nickName:0,
      careAuthor:0,
      collectArticle:0,
      writeArticle:0
    })
    .skip((event.page-1)*event.pageSize)
    .limit(event.pageSize)
    .end()
  return {
    list,
    total,
    success:true
  }
}