var http = require('http');

var opts = {
    host: 'www.google.com',
    port: 80,
    method: 'POST',
    path: '/',
    headers: {}
};

var resData = '';
var req = http.request(opts, function(res){
    // 응답 처리
    res.on('data',function(chunk){
        resData += chunk;
    });
    
    res.on('end',function(){
        console.log(resData);
    });
});

opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
/* 구글 사이트에 요청할 때 필요한 요청 파라미터는 요청 객체의 data 속성으로 설정*/
req.data = "q=actor";
/* data 속성 값에 따라 Content-Length 헤더의 값이 달라지므로 request() 메소드로 만든 요청 객체에 이 정보를 추가로 설정*/
opts.headers['Content-Length'] = req.data.length;

req.on('error',function(err){
    console.log("오류 발생 : " + err.message);
});

// 요청 전송
req.write(req.data);
req.end();