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
    fs.readFile(filename,function(err,data){
        if(err) throw err;
        
        res.writeHead(200, {"Content-Type":"image/png"});
        res.write(data);
        res.end();
    });
});