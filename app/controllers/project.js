var moment = require('moment')
var validator = require('validator')
var DateValidator = require('DateValidator').DateValidator;
var _ = require('lodash')
var AWS = require('aws-sdk')
var helper = require('../helpers/helper.js')
AWS.config.update({ accessKeyId: process.env.accessKeyId, secretAccessKey: process.env.secretAccessKey, "region": process.env.region});



const QUERY = {
  SELECT_ALL_PROJECT_BY_CORP_ID : "SELECT a.id, a.name projectName, b.name corpName, a.start_dt, a.end_dt FROM MT_CORP_PROJECT a INNER JOIN MT_CORP b ON a.corpId = b.id WHERE a.corpId = ?",
  SELECT_CORPORATE_BY_ID : "SELECT mt_corp.id, mt_corp.name, mt_corp.dt_created, user.fullName FROM mt_corp INNER JOIN user on mt_corp.created_by = user.id WHERE mt_corp.id = ?",
  SELECT_PROJECT_BY_ID : "SELECT mt_corp_project.id, mt_corp_project.corpId, mt_corp_project.name projectName, mt_corp_project.start_dt, mt_corp_project.end_dt, mt_corp_project.dt_created, mt_corp_project.logo, user.fullName created_by from mt_corp_project INNER JOIN user on mt_corp_project.created_by = user.id WHERE mt_corp_project.id = ?",
  ADD_NEW_PROJECT : "INSERT INTO MT_CORP_PROJECT SET ?",
  DELETE_PROJECT : "DELETE FROM MT_CORP_PROJECT WHERE id = ?"
}

module.exports = {
  getList       : getList,
  getAdd        : getAdd,
  postAdd       : postAdd,
  deleteProject : deleteProject,
  detailProject : detailProject
}

function getList(req,res,next){
  var corpId = req.user.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_ALL_PROJECT_BY_CORP_ID, [corpId], function(err, projectList){
      if(err)console.log(err)
        res.render('project/projectList.ejs',{
      		user : req.user,
          projectList : projectList,
          moment : moment,
          message : ''
      	})
    })
  })
}

function getAdd(req,res,next){
  var corpId = req.query.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_CORPORATE_BY_ID, [corpId], function(err, corporateDetail){
      if(err)console.log(err)
      res.render('project/projectAdd.ejs',{
    		user : req.user,
        data: '',
        corporateDetail: corporateDetail,
        message: ''
    	})
    })
  })
}

function postAdd(req,res,next){
  var message     = []
  var corpId      = req.body.corpId,
      name        = req.body.name,
      startDate   = req.body.startDate,
      endDate     = req.body.endDate,
      imageID     = `${helper.generateUUID()}.png`
      images      = ''
  //validation empty
  if(validator.isEmpty(name))message.push('Name is mandatory field')
  if(validator.isEmpty(startDate))message.push('Start Date is mandatory field')
  if(validator.isEmpty(endDate))message.push('End Date is mandatory field')
  if (req.files.logo){
    var logo = req.files.logo
    var fileName     = _.get(logo,'name')
    if(!_.endsWith(fileName,'.png'))
      message.push('Photo upload only accept png format')
  }
  //length validation
  if(name.length>100)message.push('Project Name length is exceeded')

  if(message.length>0){
    req.getConnection(function(err,connection){
      connection.query(QUERY.SELECT_CORPORATE_BY_ID, [corpId], function(err, corporateDetail){
        if(err)console.log(err)
        res.render('project/projectAdd.ejs',{
          user : req.user,
          data: req.body,
          corporateDetail: corporateDetail,
          message : message
        })
      })
    })
  }
  //pass validation , insert to MT_CORP_PROJECT
  else{
    //fileupload handling
    if (req.files.logo){
      var logo = req.files.logo
      var s3 = new AWS.S3();
      iamges = imageID
      s3.putObject({
        Bucket: process.env.bucket,
        Key: `${imageID}`,
        Body: logo.data,
        ACL: 'public-read'
      },function (err,resp) {
        if(err) throw err
        console.log('Successfully uploaded photo property.')
        console.log(resp);
      });
    }
    startDate = new Date(req.body.startDate),
    endDate   = new Date(req.body.endDate)

    var newProject = {
        id: helper.generateUUID(),
        name: name,
        corpId: corpId,
        start_dt: startDate,
        end_dt: endDate,
        logo: images,
        dt_created: new Date(),
        created_by: req.user.id
    }
    req.getConnection(function(err,connection){
      connection.query(QUERY.ADD_NEW_PROJECT, newProject, function(err, rows){
        if(err)console.log(err)
        connection.query(QUERY.SELECT_ALL_PROJECT_BY_CORP_ID, [corpId], function(err, projectList){
          if(err)console.log(err)
          res.render('project/projectList.ejs',{
            user : req.user,
            projectList : projectList,
            moment : moment,
            message : ''
          })
        })
      })
    })
  }
}

function deleteProject(req,res,next){
  var projectId = req.query.projectId
  var corpId = req.user.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_PROJECT_BY_ID,[projectId],  function(err, projectDetail){
    if(err)console.log(err)
      connection.query(QUERY.DELETE_PROJECT, [projectId], function(err, rows){
        if(err)console.log(err)
        //delete image from S3
        var s3 = new AWS.S3();
        s3.deleteObject({
          Bucket: process.env.bucket,
          Key: projectDetail[0].logo
        },function (err,data){
          if(err)console.log(err)
          console.log('deleted logo is succeeded');
        })

        connection.query(QUERY.SELECT_ALL_PROJECT_BY_CORP_ID, [corpId], function(err, projectList){
          if(err)console.log(err)
          res.render('project/projectList.ejs',{
            user : req.user,
            projectList : projectList,
            moment : moment,
            message : `Record has been successfully deleted`
          })
        })
      })
    })
  })
}

function detailProject(req,res,next){
  var projectId = req.query.projectId
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_PROJECT_BY_ID,[projectId],  function(err, projectDetail){
      if(err)console.log(err)
      if(projectDetail[0].logo)var logoUrl = `${process.env.S3Url}/${projectDetail[0].logo}`
      else var logoUrl = `/img/noimagefound.jpg`
      res.render('project/projectDetail.ejs',{
        user : req.user,
        projectDetail : projectDetail,
        moment : moment,
        message : ``,
        logoUrl : logoUrl
      })
    })
  })
}
