/* Express 기본 모듈 불러오기 */
var express = require('express')
, http = require('http')
, path = require('path');

/* Express의 미들웨어 불러오기 */
var bodyParser = require('body-parser')
, static = require('serve-static')
, cookieParser = require('cookie-parser');

/* 익스프레스 객체 생성 */
var app = express();

/* 익스프레스에 기본 속성(PORT 번호) 설정 */
app.set('port',process.env.PORT || 2402);

/* body-parser를 사용해 application/x-www-form-urlencoded 파싱 */
app.use(bodyParser.urlencoded({extended : false}));

/* body-parser를 사용해 application/json 파싱 */
app.use(bodyParser.json());

/* serve-static을 사용해 path 적용 */
app.use(static(path.join(__dirname, '/')));

/* cookie-parser 적용 */
app.use(cookieParser());

/* Router 객체 참조 */
var router = express.Router();

/* Routing 함수 등록 */
router.route('/process/showCookie').get(function(req,res){
    console.log('/process/showCookie 호출됨.');
    
    res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function(req,res){
    console.log('/process/setUserCookie 호출됨.');
    
    // 쿠키 설정
    res.cookie('user',{
        id: 'mike',
        name: '소녀시대',
        authorized: true
    });
    
    // redirect로 응답
    res.redirect('/process/showCookie');
});


/* Router 객체를 app 객체에 등록 */
app.use('/',router);

/* 등록되지 않은 패스에 대해 페이지 오류 응답 */
app.all('*', function(req,res){
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express 서버가 %d번 포트에서 시작됨.',app.get('port'));
});
