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
            nickName:0
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
          .match(_.expr(
            $.eq(['$articleId','$$aId']),
          ))
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
        readerId:event.authorId,
        isCollect:true
      })
      .addFields({
        image:$.concat(['cloud://ther-su-gomzo.7468-ther-su-gomzo-1300960888/cover_img/','$_id','.jpg']),
      })
      .project({
        isCollect:0,
        isLike:0,
        authorId:0,
        readerId:0,
        major:0,
        gender:0,
        avatarUrl:0,
        openid:0,
        school:0,
        content:0,
        type:0,
        writeArticle:0,
        careAuthor:0,
        collectArticle:0,
        authorList:0,
        handleList:0
      })
      .end()
      return list;
  }catch(e){
    return {message:'未知错误'}
  }
}