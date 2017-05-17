var moment = require('moment')
var helper = require('../helpers/helper.js')
var validator = require('validator')
var DateValidator = require('DateValidator').DateValidator;
var _ = require('lodash')
var AWS = require('aws-sdk')
AWS.config.update({ accessKeyId: process.env.accessKeyId, secretAccessKey: process.env.secretAccessKey, "region": process.env.region});

const QUERY = {
  SELECT_ALL_PROJECT_BY_CORP_ID : "SELECT a.id, a.name projectName, b.name corpName, a.start_dt, a.end_dt FROM MT_CORP_PROJECT a INNER JOIN MT_CORP b ON a.corpId = b.id WHERE a.corpId = ?",
  SELECT_CORPORATE_BY_ID : "SELECT mt_corp.id, mt_corp.name, mt_corp.address, mt_corp.logo, mt_corp.phone, mt_corp.email, mt_corp.dt_created, mt_corp.dt_updated, U.fullName createdBy, U2.fullName updatedBy FROM mt_corp INNER JOIN user as U on mt_corp.created_by = U.id LEFT JOIN user as U2 on mt_corp.updated_by = U2.id  WHERE mt_corp.id = ?",
  UPDATE_CORPORATE_BY_CORP_ID : "UPDATE MT_CORP SET ? WHERE ID = ?"
}

module.exports = {
  getDetail     : getDetail,
  getEdit       : getEdit,
  postEdit      : postEdit
}

function getDetail(req,res,next){
  var corpId = req.query.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_CORPORATE_BY_ID, [corpId], function(err, corporateDetail){
      if(err)console.log(err);
      if(corporateDetail[0].logo)var logoUrl = `${process.env.S3Url}/${corporateDetail[0].logo}`
      else var logoUrl = `/img/noimagefound.jpg`
      res.render('corporate_emp/corporateEmpDetail.ejs',{
    		user : req.user,
        corporateDetail: corporateDetail,
        message: '',
        moment: moment,
        logoUrl: logoUrl
    	})
    })
  })
}

function getEdit(req,res,next){
  var corpId = req.query.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.SELECT_CORPORATE_BY_ID, [corpId], function(err, corporateDetail){
      if(err)console.log(err);
      var logoUrl = `${process.env.S3Url}/${corporateDetail[0].logo}`
      console.log('logoUrl',logoUrl);
      res.render('corporate_emp/corporateEmpEdit.ejs',{
    		user : req.user,
        corporateDetail: corporateDetail,
        message: '',
        moment: moment,
        logoUrl: logoUrl
    	})
    })
  })
}

function postEdit(req,res,next){
  var message     = []
  var corpId      = req.body.corpId,
      name        = req.body.name,
      address     = req.body.address,
      phone       = req.body.phone,
      email       = req.body.email,
      existedLogo = req.body.logoCorp
      logoID     = `${helper.generateUUID()}.png`
      logos      = ''
  //validation empty
  if(validator.isEmpty(name))message.push('Name is mandatory field')
  if(validator.isEmpty(address))message.push('Address is mandatory field')
  if(validator.isEmpty(phone))message.push('Phone is mandatory field')
  if(validator.isEmpty(email))message.push('email is mandatory field')
  if (req.files.logo){
    var logo = req.files.logo
    var fileName     = _.get(logo,'name')
    if(!_.endsWith(fileName,'.png'))
      message.push('Photo upload only accept png format')
  }
  if(message.length>0){
    req.getConnection(function(err,connection){
      connection.query(QUERY.SELECT_CORPORATE_BY_ID, [corpId], function(err, corporateDetail){
        if(err) console.log(err);
        if(corporateDetail[0].logo)var logoUrl = `${process.env.S3Url}/${corporateDetail[0].logo}`
        else var logoUrl = `/img/noimagefound.jpg`
        res.render('corporate_emp/corporateEmpEdit.ejs',{
      		user : req.user,
          corporateDetail: corporateDetail,
          message: message,
          moment: moment,
          logoUrl: logoUrl
      	})
      })
    })
  }
  else{
    //pass validation


    //if existed logo and choose new logo
    if(req.files.logo && existedLogo){
      //delete image from S3
      var s3 = new AWS.S3();
      s3.deleteObject({
          Bucket: process.env.bucket,
          Key: existedLogo
      },function (err,data){
          if(err)console.log(err)
          console.log('deleted logo is succeeded');
      })
    }
    //if existed logo but not upload new logo
    if(existedLogo&&!req.files.logo)logos = existedLogo

    //fileupload handling
    if (req.files.logo){
      var logo = req.files.logo
      var s3 = new AWS.S3()
      logos = logoID
      s3.putObject({
        Bucket: process.env.bucket,
        Key: `${logoID}`,
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


    var corporate = {
        name: name,
        address: address,
        logo: logos,
        phone: phone,
        email: email,
        dt_updated: new Date(),
        updated_by: req.user.id
    }
    req.getConnection(function(err,connection){
      connection.query(QUERY.UPDATE_CORPORATE_BY_CORP_ID, [corporate,corpId], function(err, rows){
        if(err)console.log(err)
        connection.query(QUERY.SELECT_CORPORATE_BY_ID, [corpId], function(err, corporateDetail){
          if(err)console.log(err);
          if(corporateDetail[0].logo)var logoUrl = `${process.env.S3Url}/${corporateDetail[0].logo}`
          else var logoUrl = `/img/noimagefound.jpg`
          res.render('corporate_emp/corporateEmpDetail.ejs',{
        		user : req.user,
            corporateDetail: corporateDetail,
            message: `Corporate ${corporateDetail[0].name} has been successfully updated`,
            moment: moment,
            logoUrl: logoUrl
        	})
        })
      })
    })
  }
}
