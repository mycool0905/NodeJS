/* Express 기본 모듈 불러오기 */
var express = require('express')
, http = require('http')
, path = require('path');

/* Express의 미들웨어 불러오기 */
var bodyParser = require('body-parser')
, static = require('serve-static');

/* 익스프레스 객체 생성 */
var app = express();

/* 익스프레스에 기본 속성(PORT 번호) 설정 */
app.set('port',process.env.PORT || 2402);

/* body-parser를 사용해 application/x-www-form-urlencoded 파싱 */
app.use(bodyParser.urlencoded({extended : false}));

/* body-parser를 사용해 application/json 파싱 */
app.use(bodyParser.json());

app.use(static(path.join(__dirname, '/')));


/* Router 객체 참조 */
var router = express.Router();

/* Routing 함수 등록 */
router.route('/process/login/:name').post(function(req,res){
    console.log('/process/login/:name 처리함.');
    
    var paramName = req.params.name;
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param name : ' + paramName + '</p></div>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write(' <br><br><a href="/public/login2.html">로그인 페이지로 돌아가기</a>');
    res.end();
});

/* Router 객체를 app 객체에 등록 */
app.use('/',router);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express 서버가 %d번 포트에서 시작됨.',app.get('port'));
});