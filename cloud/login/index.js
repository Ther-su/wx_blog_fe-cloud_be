// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db=cloud.database()
  const wxContext = cloud.getWXContext()
  try{
    const {data}=await db.collection('user').where({
      openid:wxContext.OPENID
    }).get()
    if(!data.length){//判断是否登录过
      await db.collection('user').add({//注册新用户
        data:{
          nickName:event.nickName,
          gender:event.gender,
          avatarUrl:event.avatarUrl,
          openid:wxContext.OPENID,
          collectArticle:0,
          writeArticle:0,
          careAuthor:0,
          school:null,
          major:null,
        }
      })
      return {
        collectArticle:0,
        writeArticle:0,
        careAuthor:0
      }
    }else{
      return data[0]
    }
  }catch(e){
    console.log(e);
  }
}