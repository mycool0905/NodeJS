/* Express 기본 모듈 불러오기 */
var express = require('express')
, http = require('http')
, path = require('path');

/* Express의 미들웨어 불러오기 */
var bodyParser = require('body-parser')
, static = require('serve-static')
, expressErrorHandler = require('express-error-handler');

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
router.route('/process/login').post(function(req,res){
    console.log('/process/login 처리함.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write(' <br><br><a href="/public/login2.html">로그인 페이지로 돌아가기</a>');
    res.end();
})


/* Router 객체를 app 객체에 등록 */
app.use('/',router);

/* 등록되지 않은 패스에 대해 페이지 오류 응답 */

app.all('*', function(req,res){
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

/* express-error-handler는 잘 모르겠다 아직 */
/*
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );
*/
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express 서버가 %d번 포트에서 시작됨.',app.get('port'));
});
