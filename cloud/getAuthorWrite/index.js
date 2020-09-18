// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
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
            $.eq(['$$authorId','$openid']),
          ))
          .addFields({
            author:'$nickName'
          })
          .project({
            _id:0,
            nickName:0,
            gender:0,
            avatarUrl:0,
            collectArticle:0,
            writeArticle:0,
            careAuthor:0,
            school:0,
            major:0,
          })
          .done(),
        as:'authorList'
      })
      .replaceRoot({
        newRoot:$.mergeObjects([ $.arrayElemAt(['$authorList', 0]), '$$ROOT' ])
      })
      .addFields({
        image:$.concat(['cloud://ther-su-gomzo.7468-ther-su-gomzo-1300960888/cover_img/','$_id','.jpg']),
      })
      .match({
        authorId:event.authorId
      })
      .project({
        openid:0,
        authorList:0,
        content:0,
        type:0
      })
      .end()
      return list
  }catch(e){
    return {
      message:'未知错误'
    }
  }
}