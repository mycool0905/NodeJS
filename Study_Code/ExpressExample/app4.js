var express = require('express')
, http = require('http');

var app = express();

app.use(function(req, res, next){
    console.log('첫 번째 미들웨어에서 요청을 처리함.');
    
    res.send({name:'소녀시대', age:20});
});

app.set('port',process.env.PORT || 2402);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express 서버가 %d번 포트에서 시작됨.',app.get('port'));
});