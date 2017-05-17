var moment = require('moment')
var helper = require('../helpers/helper.js')
var validator = require('validator')
var bcrypt = require('bcrypt-nodejs');
var request = require('request');

var clientKey = "VT-client-7enxfhSkjv09fje4";

var headers = {
    'Accept':       'application/json',
    'Content-Type':     'application/json',
    'Authorization': 'Basic VlQtc2VydmVyLVU0SGw5cU1Nb1FxelFoRklKTEhlcHY4RTo='
}

var form = {
  "transaction_details": {
    "order_id": "ORDER-001",
    "gross_amount": 10000
  },
  "enabled_payments": ["credit_card"],
  "expiry": {
    "unit": "minutes",
    "duration": 5
  }
}

// , "bri_epay", "telkomsel_cash", "echannel",
// "bbm_money", "xl_tunai", "indosat_dompetku", "mandiri_ecash", "permata_va",
// "bca_va", "other_va", "kioson", "indomaret", "gci"],

var options = {
    url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
    method: 'POST',
    headers: headers,
    form: form
}

const QUERY = {
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
}



function getAdd(req,res,next){
  res.render('payment/paymentAdd.ejs',{
    user : req.user,
    message: ''
  })
}

function postAdd(req,res,next){
  var paymentAmount = req.body.amount
  var orderId = helper.generateShortUUID()
  form.transaction_details.order_id = orderId
  form.transaction_details.gross_amount = paymentAmount

  request(options, function (error, response, result) {
    if(error)console.log(error);
    console.log('form',form);
    console.log('result',result);
    if (!error && response.statusCode == 201) {
      var token = JSON.parse(result).token
        // Print out the response body
        console.log(token);
        res.render('payment/paymentConfirmation.ejs',{
      		user : req.user,
          token: token,
          form: form,
          clientKey: clientKey,
          message: ''
        })
    }
    else{
      res.render('payment/paymentAdd.ejs',{
        user : req.user,
        token: token,
        message: result
      })
    }
  })
}

function deleteCorpUser(req,res,next){
  var corpUserId = req.query.corpUserId,
      corpId     = req.query.corpId
  req.getConnection(function(err,connection){
    connection.query(QUERY.DELETE_CORPORATE_USER, [corpUserId], function(err, rows){
      if(err)console.log(err)
      req.getConnection(function(err,connection){
        connection.query(QUERY.SELECT_CORPORATE_BY_ID,[corpId], function(err, corporateDetail){
          if(err)console.log(err)
          connection.query(QUERY.SELECT_CORPORATE_USER_BY_CORP_ID,[corpId], function(err, corporateUserList){
            if(err)console.log(err)
            console.log(corporateUserList);
            res.render('corporate/corporateDetail.ejs',{
              user : req.user,
              corporateDetail : corporateDetail,
              corporateUserList : corporateUserList,
              moment : moment,
              message : ''
              })
          })
        })
      })
    })
  })
}
