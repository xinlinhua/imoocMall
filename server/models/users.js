
const mongoose = require('../db.js'),
    Schema = mongoose.Schema;

let userScheam = new Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'orderList': Array,
  'cartList':[{
    'productId': String,
    'productName': String,
    'salePrice': String,
    'productImage': String,
    'checked': {type: String, default: 0},
    'productNum': {type: String, default: 0}
  }],
  'addressList': [{
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": Number,
      "tel": Number,
      "isDefault": Boolean
    }]
})

module.exports  = mongoose.model('User',userScheam);