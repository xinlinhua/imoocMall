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

module.exports = router;
