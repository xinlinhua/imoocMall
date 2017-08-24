const mongoose = require('./db.js'),
    Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

/* GET home page. */
var Goods = new Schema({          
   "productId": String,
   "productName": String, 
   "salePrice":Number,
   "productImage": String,
   "productUrl":String
});
goods =  mongoose.model('Goods',Goods);
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express,Very Goood111' });
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));
    let sort = req.param('sort') || 1;
    
    let skip = (page-1)*pageSize;
    var  priceFilter = JSON.parse(req.param('priceFilter'));
    var  params={};
   // console.log(JSON.parse(priceFilter));
    console.log(priceFilter.startPrice);
    if(priceFilter.startPrice){
        params ={
            salePrice:{
               $gt: parseInt(priceFilter.startPrice),
               $lt: parseInt(priceFilter.endPrice)
            }
        }
    }
    
    let goodModel = goods.find(params).skip(skip).limit(pageSize);
    goodModel.sort({'salePrice':sort}) 
    goodModel.exec({}, function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
           
           res.json(data);
        }
    }) 
});

router.get('/test', function(req, res, next) {
 
    Goods.find({}, function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
          res.json(data);
        }
    }) 
});



module.exports = router;