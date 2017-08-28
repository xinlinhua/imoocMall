
var express = require('express');
var router = express.Router();
var Goods = require('../models/goods');
var User = require('../models/users');
/* GET home page. */

router.get('/list', function(req, res, next) {
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
    
    let goodModel = Goods.find(params).skip(skip).limit(pageSize);
    goodModel.sort({'salePrice':sort}) ;
    
    goodModel.exec({}, function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
           
           res.json(data);
        }
    }) 
});


router.post('/addCart',function(req,res,next){
    let userId = '100000077';
    let productId = req.body.productId;
    User.findOne({userId: userId},function(err, useData){
        if(err){
            res.json({
                resultCode: '1',
                resultMessage: err.message
            })
        }else{
            if(useData){
                let goodItem = '';
                useData.cartList.forEach((item)=>{
                    if(item.productId === productId){
                       
                        item.productNum++ ;
                         goodItem = item;
                    }
                })
                if(goodItem){
                    useData.save((err3,resp)=>{
                        if(err3){
                            res.json({
                                status: '1',
                                msg: err3.message
                            })
                        }else{
                            res.json({
                                resultCode: '0',
                                resultMessage: 'success'
                            })
                        }
                    })
                }else{

                    //Goods.findOne({productId: productId}).lean().exec((err1,resp1)=>{
                    Goods.findOne({productId: productId},(err1,resp1)=>{
                        if(resp1){
                            resp1.productNum = 1;
                            resp1.checked = 1;
                            useData.cartList.push(resp1);
                            useData.save((err2,result)=>{
                                if(err2){
                                    res.json({
                                        resultCode: '1',
                                        resultMessage: err2.message
                                    })
                                }else{
                                    res.json({
                                        resultCode: '0',
                                        resultMessage: 'success'
                                    })
                                }
                            })
                        }
                    })                          
                }
            }
          
        }
        
    })
})

 router.get('/test', function(req, res, next) {
 
    User.find({}, function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
          res.json(data);
        }
    }) 
});
 


module.exports = router;