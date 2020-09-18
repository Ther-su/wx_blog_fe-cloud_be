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
    const {data}=await db.collection('user').where({
      openid:wxContext.OPENID
    }).get()
    if(data.length){
      if(event.authorId==wxContext.OPENID){
        const res=await db.collection('user').field({
          nickName:true,
          gender:true,
          avatarUrl:true,
          openid:true,
          school:true,
          major:true
        }).where({
          openid:wxContext.OPENID
        }).get()
        res.data[0].isCare=false;
        res.data[0].authorId=res.data[0].openid
        return res.data[0]
      }else{
        const res=await db.collection('user')
        .aggregate()
        .lookup({
          from:'care',
          let:{
            openid:'$openid'
          },
          pipeline:$.pipeline()
            .match(_.expr(
              $.eq(['$authorId','$$openid']),
            ))
            .project({
              _id:0,
            })
            .addFields({
              isCare:$.ifNull(['$isCare',false])
            })
            .done(),
          as:'authorList'
        })
        .replaceRoot({
          newRoot:$.mergeObjects([ $.arrayElemAt(['$authorList', 0]), '$$ROOT' ])
        })
        .match({
          readerId:wxContext.OPENID,
          openid:event.authorId
        })
        .project({
          readerId:0,
          openid:0,
          authorList:0,
          careAuthor:0,
          collectArticle:0,
          writeArticle:0
        })
        .end()
        return res.list[0]
      }
    }else{
      const res=await db.collection('user').field({
        nickName:true,
        gender:true,
        avatarUrl:true,
        _id:true,
        school:true,
        major:true
      }).where({
        openid:event.authorId
      }).get()
      res.list[0].isCare=false
      return res.list[0]
    }
  }catch(e){
    return {
      message:'未知错误'
    }
  }
}