const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/imoocmall');

const goods = new mongoose.Schema({
  productId: String,
  productName: String,
  salePrice: Number,
  productImage:String,
  productUrl: String
})


const Models = {
  Goods: mongoose.model('goods', goods)
  
}

module.exports = Models