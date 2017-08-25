
const mongoose = require('../db.js'),
    Schema = mongoose.Schema;
var Goods = new Schema({          
   "productId": String,
   "productName": String, 
   "salePrice":Number,
   "productImage": String,
   "productUrl":String,
   'checked': String,
   'productNum': String
});
//goods =  mongoose.model('Goods',Goods);

module.exports  = mongoose.model('Goods',Goods);