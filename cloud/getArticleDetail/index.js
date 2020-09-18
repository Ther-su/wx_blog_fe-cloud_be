// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  const $=db.command.aggregate
  const _=db.command
  const {data}=await db.collection('user').where({
    openid:wxContext.OPENID
  }).get()
  if(data.length){
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
      .lookup({
        from:'articlehandle',
        pipeline:$.pipeline()
          .match(_.expr($.and([
            $.eq([wxContext.OPENID,'$readerId']),
            $.eq([event.id,'$articleId'])
          ])))
          .project({
            _id:0
          })
          .done(),
        as:'handleList'
      })
      .replaceRoot({
        newRoot:$.mergeObjects([ $.arrayElemAt(['$handleList', 0]), '$$ROOT' ])
      })
      .lookup({
        from:'care',
        let:{
          authorId:'$authorId'
        },
        pipeline:$.pipeline()
          .match(_.expr($.and([
            $.eq(['$authorId','$$authorId']),
            $.eq([wxContext.OPENID,'$readerId'])
          ])))
          .project({
            _id:0
          })
          .done(),
        as:'careList'
      })
      .replaceRoot({
        newRoot:$.mergeObjects([ $.arrayElemAt(['$careList', 0]), '$$ROOT' ])
      })
      .addFields({
        isLike:$.ifNull(['$isLike',false]),
        isCollect:$.ifNull(['$isCollect',false]),
        isCare:$.ifNull(['$isCare',false]),
        author:'$nickName'
      })
      .match({
        _id:_.eq(event.id)
      })
      .project({
        handleList:0,
        authorList:0,
        school:0,
        major:0,
        nickName:0,
        openid:0,
        gender:0,
        careList:0,
        articleId:0,
        collectArticle:0,
        writeArticle:0,
        careAuthor:0,
        readerId:0
      })
      .end()
      return {
        list
      }
  }else{
    const {list} = await db.collection('article')
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
        author:'$nickName',
      })
      .project({
        authorList:0,
        school:0,
        major:0,
        nickName:0,
      })
      .match({
        _id:_.eq(event.id)
      })
      .end()
      return {
        list
      }
  }

}