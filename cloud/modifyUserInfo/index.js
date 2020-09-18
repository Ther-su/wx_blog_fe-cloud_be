// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database();
  try{
    await db.collection('user').where({
      openid:wxContext.OPENID
    }).update({
      data:{
        nickName:event.nickName,
        gender:event.gender,
        school:event.school,
        major:event.major
      }
    })
    return {
      message:'ok'
    }
  }catch(e){
    return {
      message:'发生了未知错误'
    }
  }
}