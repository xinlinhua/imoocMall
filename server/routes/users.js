var express = require('express');
var router = express.Router();
require('./../util/util')
var User = require('../models/users');
/* GET users listing. */
router.get('/', function(req, res, next) {
  let userId = '100000077'
});

router.post('/login', (req,res)=>{
    var param = {
      userName: req.body.userName,
      userPwd: req.body.userPwd
    };
    User.findOne(param,(err,doc)=>{
      if(err){
        res.json({
          resultCode:"1",
          resultMessage: err.message
        })
      }else{
        var userId = doc.userId;
        res.cookie('userId', userId,{
          path:'/',
          maxAge: 1000*60*60
        })
        var userName = doc.userName;
        res.cookie('userName', userName,{
          path:'/',
          maxAge: 1000*60*60
        })
        //req.session.user = doc;
        res.json({
          resultCode: '0',
          resultMessage: 'success',
          result: {
            userName:doc.userName
          }
        })
      }
    })
})


router.post('/logout',(req,res,next)=>{
  res.cookie('userId','',{
    path:'/',
    maxAge: -1
  });
  res.json({
    resultCode: '0',
    resultMessage: 'success',
    result: ''
  })
})

router.get('/checkLogin',(req,res,next)=>{

  if(req.cookies.userId){
      res.json({
        resultCode: '0',
        resultMessage: 'success',
        result: {
            userId: req.cookies.userId,
            userName: req.cookies.userName
        }
      })
  }else{
      res.json({
        resultCode: '1',
        resultMessage: '未登录',
        result: ''
      })
  }
  
})

router.get('/cartList',(req, res, next)=>{
    var userId = req.cookies.userId;
    User.findOne({userId: userId},function(err,doc){
        if(err){
          res.json({
            resultCode: '1',
            resultMessage: err.message,
            result: '' 
          })  
        }else{
          res.json({
            resultCode: '0',
            resultMessage: 'success',
            result: doc.cartList
          })
        }
    })
})

router.post('/cartDel',(req,res)=>{
  let userId = req.cookies.userId, productId = req.body.productId;
  User.update({
    userId:userId
  },{
    $pull: {
      'cartList': {
        productId:productId
      }
    }
  },function(err,doc){
    if(err){
      res.json({
        resultCode: '1',
        resultMessage: err.message,
        result: ''
      })
    }else{
      res.json({
        resultCode: '0',
        resultMessage: 'success',
        result: ''
      })
    }
  })
})

/*

*/
router.post('/cartEdit',(req,res)=>{
   let userId = req.cookies.userId, productId = req.body.productId, productNum = req.body.productNum, checked = req.body.checked;
    User.update({userId:userId,'cartList.productId':productId},{
      'cartList.$.productNum': productNum, 
       'cartList.$.checked': checked, 
    } ,function(err,doc){
    if(err){
      res.json({
        resultCode: '1',
        resultMessage: err.message,
        result: ''
      })
    }else{
      res.json({
        resultCode: '0',
        resultMessage: 'success',
        result: ''
      })
    }
  })

})

/*

*/
router.post('/cartCheckAll',(req,res)=>{
   let userId = req.cookies.userId, checkAll = req.body.checkAll;
   User.findOne({userId: userId},function(err, resp){
        if(err){
            res.json({
                resultCode: '1',
                resultMessage: err.message
            })
        }else{
           
          if(resp){
              resp.cartList.forEach((item)=>{
                  item.checked = checkAll
              })
              resp.save((err3,resp)=>{
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
          }
        }  
    })

})


router.get('/addressList',(req,res)=>{
   let userId = req.cookies.userId;
    User.findOne({userId: userId},function(err,doc){
        if(err){
          res.json({
            resultCode: '1',
            resultMessage: err.message,
            result: '' 
          })  
        }else{
          res.json({
            resultCode: '0',
            resultMessage: 'success',
            result: doc.addressList
          })
        }
    })
})

router.post('/delAddress',(req,res)=>{
  let userId = req.cookies.userId, addressId = req.body.addressId;
  User.update({
    userId:userId
  },{
    $pull: {
      'addressList': {
        addressId: addressId
      }
    }
  },function(err,doc){
    if(err){
      res.json({
        resultCode: '1',
        resultMessage: err.message,
        result: ''
      })
    }else{
      res.json({
        resultCode: '0',
        resultMessage: 'success',
        result: ''
      })
    }
  })
})

router.post('/setDefault',(req,res)=>{
    let userId = req.cookies.userId, addressId = req.body.addressId;
    User.findOne({userId: userId},function(err,doc){
        if(err){
          res.json({
            resultCode: '1',
            resultMessage: err.message,
            result: '' 
          })  
        }else{
          doc.addressList.forEach((item)=>{
             if(item.addressId === addressId){
                item.isDefault = true;
             } else{
                item.isDefault = false;
             }
          })
          doc.save((err3,resp)=>{
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
        }
    })

})


//
router.post('/payMent',(req,res)=>{
    let userId = req.cookies.userId, addressId = req.body.addressId, orderTotal = req.body.orderTotal;
    User.findOne({userId: userId},function(err,doc){
        if(err){
          res.json({
            resultCode: '1',
            resultMessage: err.message,
            result: '' 
          })  
        }else{
          var addressInfo = '',goodList=[];
          doc.addressList.forEach((item)=>{
             if(item.addressId === addressId){
                addressInfo = item;
             }
          })
          doc.cartList.forEach((item)=>{
             if(item.checked === '1'){
                goodList.push(item);
             }
          }) 
          
          var platform = '1001';
          var r1 = Math.floor(Math.random()*10);
          var r2 = Math.floor(Math.random()*10);

          var sysDate = new Date().Format('yyyyMMddhhmmss');
          var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
          var orderId = platform+r1+sysDate+r2;
          var order = {
              orderId:orderId,
              orderTotal:orderTotal,
              addressInfo:addressInfo,
              goodsList:goodList,
              orderStatus:'1',
              createDate:createDate
          };
          doc.orderList.push(order);   
          doc.save((err3,resp)=>{
              if(err3){
                  res.json({
                      status: '1',
                      msg: err3.message
                  })
              }else{
                  res.json({
                      resultCode: '0',
                      resultMessage: 'success',
                      result: {
                        orderId:order.orderId,
                        orderTotal:order.orderTotal
                      }
                  })
              }
          })
        }
    })

})

router.get('/orderDetail',(req,res)=>{
    let userId = req.cookies.userId, orderId = req.param('orderId');
    User.findOne({userId: userId},function(err,doc){
        if(err){
          res.json({
            resultCode: '1',
            resultMessage: err.message,
            result: '' 
          })  
        }else{
          var orderTotal = 0;
          if(doc.orderList.length > 0){

          
              doc.orderList.forEach((item)=>{
                if(item.orderId === orderId){
                    orderTotal = item.orderTotal;
                }
              }) 
              if(orderTotal>0){
                res.json({
                  resultCode:'0',
                  resultMessage:'',
                  result:{
                    orderId:orderId,
                    orderTotal:orderTotal
                  }
                })
              }else{
                res.json({
                  resultCode:'120002',
                  resultMessage:'无此订单',
                  result:''
                });
              }
          }else{
             res.json({
                  resultCode:'120001',
                  resultMessage:'当前用户未创建订单',
                  result:''
                });
          }
      
         
        }
    })

})
  router.get('/getCartCount',(req,res)=>{
    let userId = req.cookies.userId;
    if(userId){
       User.findOne({userId: userId},function(err,doc){
        if(err){
          res.json({
            resultCode: '1',
            resultMessage: err.message,
            result: '' 
          })  
        }else{
           var cartList =  doc.cartList;
           var productCount = 0;
           cartList.map((cart)=>{
               productCount += +cart.productNum;
           })
          res.json({
            resultCode:'0',
            resultMessage:'',
            result: productCount
          })
          
         
        }
      })
    }else{
       res.json({
          resultCode: '1',
          resultMessage: '用户未登录',
          result: '' 
        })  
          
    }
   

})
  
module.exports = router;
