var moment = require('moment')
var helper = require('../helpers/helper.js')
var validator = require('validator')
var bcrypt = require('bcrypt-nodejs');

const QUERY = {
  SELECT_ALL_PROJECT_BY_CORP_ID : "SELECT a.id, a.name projectName, b.name corpName, a.start_dt, a.end_dt FROM MT_CORP_PROJECT a INNER JOIN MT_CORP b ON a.corpId = b.id WHERE a.corpId = ?",
  SELECT_CORPORATE_BY_ID : "SELECT mt_corp.id, mt_corp.name, mt_corp.dt_created, user.fullName FROM mt_corp INNER JOIN user on mt_corp.created_by = user.id WHERE mt_corp.id = ?",
  SELECT_USER_BY_USERNAME_AND_CORP_ID : "SELECT username, role, fullName, phone, email FROM USER WHERE username = ? AND corpId = ?",
  SELECT_CORPORATE_USER_BY_CORP_ID : "SELECT id,username, role, fullName, phone, email FROM USER where corpId = ?",
  ADD_NEW_CORPORATE_USER : "INSERT INTO USER SET ?",
  DELETE_CORPORATE_USER: "DELETE FROM USER WHERE ID = ?"
}

module.exports = {
  getAdd          : getAdd,
  postAdd         : postAdd,
  deleteCorpUser  : deleteCorpUser,
  getList         : getList
}

function getAdd(req,res,next){
  var corpId = req.query.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_CORPORATE_BY_ID,[corpId], function(err, corporateDetail){
        if(err)console.log(err)
        res.render('corporate_user/corporateUserAdd.ejs',{
      		user : req.user,
          corporateDetail: corporateDetail,
          message: ''
      	})
    })
  })
}

function postAdd(req,res,next){
  var corpId = req.body.corpId,
      username = req.body.username,
      password = bcrypt.hashSync(req.body.password, null, null),
      role = req.body.role,
      fullName = req.body.fullName,
      phone = req.body.phone,
      email = req.body.email
  //get corporate detail
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_CORPORATE_BY_ID,[corpId], function(err, corporateDetail){
      if(err)console.log(err)
      //validation
      var message = []
      if(validator.isEmpty(username))message.push('Username is mandatory field')
      if(validator.isEmpty(password))message.push('Password is mandatory field')
      if(validator.isEmpty(role))message.push('Role is mandatory field')
      if(validator.isEmpty(fullName))message.push('Full Name is mandatory field')
      if(validator.isEmpty(phone))message.push('Phone Number is mandatory field')
      if(validator.isEmpty(email))message.push('Email is mandatory field')

      if(message.length>0){
        res.render('corporate_user/corporateUserAdd.ejs',{
      		user : req.user,
          corporateDetail: corporateDetail,
          message: message
      	})
      }
      //duplicate check username
      connection.query(QUERY.SELECT_USER_BY_USERNAME_AND_CORP_ID,[username,corpId], function(err, user){
        if(err)console.log(err)
        if(user.length>0){
          message.push("Username is duplicated")
          res.render('corporate_user/corporateUserAdd.ejs',{
        		user : req.user,
            corporateDetail: corporateDetail,
            message: message
        	})
        }
        else{
          //pass duplicate check, continue to adding new record
          var newCorporateUser = {
              username: username,
              password: password,
              role: role,
              fullName: fullName,
              phone: phone,
              email: email,
              corpId: corpId
          }
          req.getConnection(function(err,connection){
            connection.query(QUERY.ADD_NEW_CORPORATE_USER, newCorporateUser, function(err, rows){
              if(err)console.log(err)
              req.getConnection(function(err,connection){
                connection.query(QUERY.SELECT_CORPORATE_BY_ID,[corpId], function(err, corporateDetail){
                    if(err)console.log(err)
                    connection.query(QUERY.SELECT_CORPORATE_USER_BY_CORP_ID,[corpId], function(err, corporateUserList){
                      if(err)console.log(err)
                      if(req.user.corpId=='Super Admin'){
                        res.render('corporate/corporateDetail.ejs',{
                          user : req.user,
                          corporateDetail : corporateDetail,
                          corporateUserList : corporateUserList,
                          moment : moment,
                          message : `Corporate User ${fullName} has been successfully added`
                        })
                      } else {
                        res.render('corporate_user/corporateUserList.ejs',{
                          user : req.user,
                          corporateUserList : corporateUserList,
                          moment : moment,
                          message : `Corporate User ${fullName} has been successfully added`
                        })
                      }
                    })
                })
              })
            })
          })
        }
      })
    })
  })
}

function deleteCorpUser(req,res,next){
  var corpUserId = req.query.corpUserId,
      corpId     = req.query.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.DELETE_CORPORATE_USER, [corpUserId], function(err, rows){
      console.log(rows);
      if(err)console.log(err)
      req.getConnection(function(err,connection){
        connection.query(QUERY.SELECT_CORPORATE_BY_ID,[corpId], function(err, corporateDetail){
          if(err)console.log(err)
          connection.query(QUERY.SELECT_CORPORATE_USER_BY_CORP_ID,[corpId], function(err, corporateUserList){
            if(err)console.log(err)
            connection.query(QUERY.SELECT_ALL_PROJECT_BY_CORP_ID,[corpId], function(err, projectList){
            if(err)console.log(err)
              // redirect page is determined by Role
              if(req.user.corpId=='Super Admin'){
                res.render('corporate/corporateDetail.ejs',{
                  user : req.user,
                  corporateDetail : corporateDetail,
                  corporateUserList : corporateUserList,
                  projectList : projectList,
                  moment : moment,
                  message : `Corporate User has been successfully deleted`
                })
              } else {
                res.render('corporate_user/corporateUserList.ejs',{
                  user : req.user,
                  corporateUserList : corporateUserList,
                  moment : moment,
                  message : `Corporate User has been successfully deleted`
                })
              }
            })
          })
        })
      })
    })
  })
}

function getList(req,res,next){
  var corpId = req.query.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_CORPORATE_USER_BY_CORP_ID,[corpId], function(err, corporateUserList){
      if(err)console.log(err)
      res.render('corporate_user/corporateUserList.ejs',{
        user : req.user,
        corporateUserList : corporateUserList,
        moment : moment,
        message : ''
      })
    })
  })
}
