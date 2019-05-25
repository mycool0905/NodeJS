var http = require('http');
var fs = require('fs');

//웹 서버 객체 만들기
var server = http.createServer();

// 포트 번호를 3000으로 지정하고 웹 서버 시작
var port = 3000;
server.listen(port,function(){
    console.log('%d 포트에서 웹 서버가 시작되었습니다.',port);
});

// 클라이언트 연결 이벤트 설정
server.on('connection',function(socket){
    var addr = socket.address();
    console.log('%s:%d 클라이언트 접속',addr,port);
});

// 클라이언트 요청 이벤트 설정
server.on('request',function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.');
    
    var filename = 'house.png';
    var infile = fs.createReadStream(filename,{flags : 'r'});
    
    // 파이프로 연결하여 알아서 처리하도록 설정하기
    infile.pipe(res);
    
    /* 똑같은 기능을 더 적은 양의 코드로 만들어서 이 방법이 좋다고 생각할 수 있다.
    하지만, 실제로 이 방법으로 코딩을 했을 때 헤더를 설정할 수 없는 등의 제약이 생긴다.*/
    
});