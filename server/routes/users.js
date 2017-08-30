var express = require('express');
var router = express.Router();

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
module.exports = router;
