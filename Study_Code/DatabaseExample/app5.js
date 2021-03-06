/* Express 기본 모듈 불러오기 */
var express = require('express'),
    http = require('http'),
    path = require('path');

/* Express 미들웨어 불러오기 */
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

/* 오류 핸들러 모듈 사용 */
var expressErrorHandler = require('express-error-handler');

/* 세션 미들웨어 불러오기 */
var expressSession = require('express-session');

/* Express 객체 생성 */
var app = express();

/* Express 객체 기본 속성 설정 */
app.set('port',process.env.PORT || 2402);

/* body-parser를 사용해 application/x-www-form-urlencoded 파싱 */
app.use(bodyParser.urlencoded({extended:false}));

/* body-parser를 사용해 application/json 파싱 */
app.use(bodyParser.json());

/* public 폴더를 static으로 오픈 */
app.use('/public',static(path.join(__dirname,'/public')));

/* cookie-parser 설정 */
app.use(cookieParser());

/* 세션 설정 */
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

/* 몽고디비 모듈 사용 */
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
/* 데이터베이스 객체를 위한 변수 선언 */
var database;

/* 데이터베이스 스키마 객체를 위한 변수 선언 */
var UserSchema;

/* 데이터베이스 모델 객체를 위한 변수 선언 */
var UserModel;

/* crypto 모듈 불러들이기 */
var crypto = require('crypto');

/* 데이터베이스에 연결 */
function connectDB(){
    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    // 데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl, {useNewUrlParser:true});
    database = mongoose.connection;
    
    database.on('error',console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function(){
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        
        
        // user 스키마 및 모델 객체 생성
        createUserSchema();
        
        UserSchema.static('findById', function(id,callback){
            return this.find({id : id}, callback);
        });
        
        UserSchema.static('findAll', function(callback){
            return this.find({}, callback);
        });
        
        console.log('UserSchema 정의함.');
        
        // UserModel 모델 정의
        UserModel = mongoose.model('users', UserSchema);
        console.log('UserModel 정의함.');
    });
    
    // 연결 끊어졌을 때 5초후 재연결
    database.on('disconnected',function(){
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });
}

/* user 스키마 및 모델 객체 생성 */
function createUserSchema(){
    
    // 스키마 정의
    // required : 필수 속성, 필수적으로 값이 있어야하는 튜플 (NOT NULL)
    // unique : 고유한 값 (Primary key, Unique key)
    // password를 hashed_password로 변경, default 속성 모두 추가, salt 속성 추가
    UserSchema = mongoose.Schema({
        id: {type: String, required: true, unique: true, 'default' : ' '}, 
        hashed_password: {type: String, required: true, 'default' : ' '},
        salt : {type: String, required: true},
        // name은 hashed 인덱싱 해놓는다.
        name: {type: String, index: 'hashed', 'default' : ' '},
        // 입력을 안하면 default 값으로 -1을 넣어둔다.
        age: {type: Number, 'default' : -1},
        // Date type으로 생성 시각과 수정 시각을 정하고 default 값으로 현재 시각을 넣어둔다.
        created_at: {type: Date, index : {unique : false}, 'default' : Date.now},
        updated_at: {type: Date, index : {unique : false}, 'default' : Date.now}
    });
    
    // password를 virtual 메소드로 정의 : MongoDB에 저장되지 않는 편리한 속성임. 특정 속성을 지정하고 set, get 메소드를 정의함
    UserSchema
        .virtual('password')
        .set(function(password){
            this._password = password;
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
            console.log('virtual password 호출됨 : ' + this.hashed_password);
    })
    .get(function(){return this._password});
    
    
    // encryptPassword() 메소드와 makeSalt() 메소드는 스키마 객체의 method() 메소드를 사용해 모델 인스턴스 객체에서
    // 호출할 수 있는 메소드로 추가됩니다. makeSalt() 메소드는 Math.random() 메소드를 호출하면서 랜덤 값을 하나 만들어낸다.
    // encryptPassword() 메소드는 비밀번호와 salt 값을 파라미터로 전달받은 후 crypto 모듈로 암호화한다.
    
    // 스키마에 모델 인스턴스에서 사용할 수 있는 메소드 추가
    // 비밀번호 암호화 메소드
    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        } else {
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });
    
    // salt 값 만들기 메소드
    UserSchema.method('makeSalt', function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });
    
    // 인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
    // authenticate 메소드는 파라미터로 전달된 비밀번호와 암호화된 비밀번호가 같은지 비교한다.
    // 데이터베이스에 저장할 문서 데이터 중에서 필수 속성인데도 값이 없는 경우를 체크하기 위해 validate() 함수를 사용할 수 있다.
    
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
            return this.encryptPassword(plainText, inSalt) == hashed_password;
        } else {
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encrytPassword(plainText), this.hashed_password);
            return this.encryptPassword(plainText) == hashed_password;
        }
    });
    
    // 스키마 객체의 path() 메소드를 호출한 후 validate() 메소드를 호출하면 유효한 값인지 확인할 수 있다.
    // id 속성 값을 확인하여 입력된 값이 유효한지 알려 준다.
    // 필수 속성에 대한 유효성 확인(길이 값 체크)
    UserSchema.path('id').validate(function(id){
        return id.length;
    }, 'id 칼럼의 값이 없습니다.');
    
    UserSchema.path('name').validate(function(name){
        return name.length;
    }, 'name 칼럼의 값이 없습니다.');
}

/* 사용자를 인증하는 함수 */
var authUser = function(database, id, password, callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);
    
    // 1. 아이디를 사용해 검색
    // 모델 객체의 findById() 메소드를 호출할 때는 id 값과 콜백 함수를 전달한다.
    // 콜백 함수에서 결과 데이터를 배열로 받으면 그 배열 객체에 데이터가 있는지 확인한다.
    // 데이터가 있는 경우에는 첫 번째 배열 요소의 _doc 속성을 참조한다.
    // _doc 속성은 각 문서 객체의 정보를 담고 있어 그 안에 있는 password 속성 값을 확인할 수 있다.
    UserModel.findById(id, function(err,results){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);
        
        if(results.length>0){
            console.log('아이디와 일치하는 사용자 찾음.');
            
            // 2. 비밀번호 확인
            var user = new UserModel({id : id});
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
            if(authenticated){
                console.log('비밀번호 일치함');
                callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }
        } else {
            console.log('아이디와 일치하는 사용자를 찾지 못함.');
            callback(null,null);
        }
    });
}

/* 사용자를 등록하는 함수 */
var addUser = function(database, id, password, name, callback){
    console.log('addUser 호출됨.');
    
    // UserModel의 인스턴스 생성
    var user = new UserModel({'id' : id, 'password' : password, 'name' : name});
    
    // save()로 저장
    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null, user);
        
    });
};

/* 라우터 객체 참조 */
var router = express.Router();

/* 로그인 라우팅 함수 - 데이터베이스의 정보와 비교 */
router.route('/process/login').post(function(req,res){
    console.log('/process/login 호출됨.');
    
    var paramId = req.body.id;
    var paramPassword = req.body.password;
    
    if(database){
        authUser(database, paramId, paramPassword, function(err,docs){
            if(err) {throw err;}
            
            if(docs){
                console.dir(docs);
                var username = docs[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write('<br><br><a href="../../public/login.html">다시 로그인하기</a>');
                res.end();
            } else {
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오.</p></div>');
                res.write('<br><br><a href="../../public/login.html">다시 로그인하기</a>');
                res.end();
            }
        });
    } else {
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
    
    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
    if(database) {
        addUser(database, paramId, paramPassword, paramName, function(err,result){
            if(err) {throw err;}
            
            // 결과 객체 확인하여 추가된 데이터 있으면 성공 응답 전송
            if(result && result.insertedCount > 0){
                console.dir(result);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8}'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            } else { // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8}'});
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    } else { // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8}'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

/* 사용자 리스트 함수 */
router.route('/process/listuser').post(function(req,res){
    console.log('/process/listuser 호출됨.');
    
    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
    if (database){
        // 1. 모든 사용자 검색
        UserModel.findAll(function(err,results){
            // 에러가 발생했을 때 클라이언트로 오류 전송
            if(err){
                console.error('사용자 리스트 조회 중 오류 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                
                return;
            }
            
            if (results){ // 결과 객체 있으면 리스트 전송
                console.dir(results);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트</h2>');
                res.write('<div><ul>');
                
                for(var i = 0; i < results.length; i++){
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write('   <li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
                }
                
                res.write('</ul></div>');
                res.end();
            } else { // 결과 객체 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 실패</h2>');
                res.end();
            }
        });
    } else { // 데이터베이스 객체가 초기화되지 않았을 때 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

/* 라우터 객체 등록 */
app.use('/',router);

/* 404 오류 페이지 처리 */
var errorHandler = expressErrorHandler({
    static:{
        '404':'../DatabaseExample/public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

/* 서버 시작 */
http.createServer(app).listen(app.get('port'),function(){
    console.log('서버가 시작되었습니다. 포트 : ',app.get('port'));
    
    // 데이터베이스 연결
    connectDB();
});