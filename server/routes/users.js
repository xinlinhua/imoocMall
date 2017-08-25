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
        res.cookie('userId',doc.userId,{
          path:'/',
          maxAge: 1000*60/60
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
module.exports = router;
