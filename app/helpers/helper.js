
var uuidV1 = require('uuid/v1');
var uuid = require('small-uuid');

module.exports = {
  generateUUID: generateUUID,
  generateShortUUID: generateShortUUID
}

function generateUUID(){
  var UUID = uuidV1()
  return UUID.replace(/-/g,"")
};

function generateShortUUID(){
  var id = uuid.create();
  return(id)
}
