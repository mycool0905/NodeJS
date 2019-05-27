/* Express 기본 모듈 불러오기 */
var express = require('express'),
    http = require('http'),
    path = require('path');

/* Express 미들웨어 불러오기 */
var bodyParser = require('body-parser'),
    static = require('serve-static');

var app = express();

/* Express에 기본 속성 포트 넘버 설정 */
app.set('port', process.env.PORT || 2402);

/* body-parser를 사용해 application/x-www-form-urlencoded 파싱 */
app.use(bodyParser.urlencoded({extended:false}));

/* body-parser를 사용해 JSON 파싱 */
app.use(bodyParser.json());

/* public 폴더 오픈 */
app.use('/public',static(path.join(__dirname,'public')));

/* Router 객체 생성 */
var router = express.Router();

router.route('/process/save').post(function(req,res){
    console.log('/process/save 호출됨.');
    
    var paramUser = req.body.user || req.query.user;
    var paramDate = req.body.date || req.query.date;
    var paramContent = req.body.content || req.query.content;
    
    console.log('작성자 : ', paramUser);
    console.log('작성일지 : ', paramDate);
    console.log('내용 : ', paramContent);
    
    res.redirect('/public/response.html');
    res.end();
});

router.route('/process/rewrite').post(function(req,res){
    console.log('/process/rewrite 호출됨.');
    
    res.redirect('/public/memo.html');
    res.end();
});

/* Router 객체를 app에 적용 */
app.use('/',router);

/* 등록되지 않은 패스에 대해 페이지 오류 응답 */
app.all('*', function(req,res){
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express 서버가 %d번 포트에서 시작됨.',app.get('port'));
});
