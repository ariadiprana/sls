var moment = require('moment')
var helper = require('../helpers/helper.js')
var validator = require('validator')
var bcrypt = require('bcrypt-nodejs');


module.exports = {
  getAdd          : getAdd
}

function getAdd(req,res,next){
  res.render('mapfloor/mapfloor.ejs',{
		user : req.user,
    message: ''
	})
}
