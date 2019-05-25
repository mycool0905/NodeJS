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
    var infile = fs.createReadStream(filename, {flags: 'r'});
    var filelength = 0;
    var curlength = 0;
    
    fs.stat(filename, function(err,stats){
        filelength = stats.size;
    });
    
    // 헤더 쓰기
    res.writeHead(200, {"Content-Type":"image/png"});
    
    // 파일 내용을 스트림에서 읽어 본문 쓰기
    infile.on('readable', function(){
        var chunk;
        while (null != (chunk = infile.read())){
            console.log('읽어 들인 데이터 크기 : %d 바이트', chunk.length);
            curlength += chunk.length;
            res.write(chunk, 'utf8', function(err){
                console.log('파일 부분 쓰기 완료 : %d, 파일 크기 : %d',curlength,filelength);
                if(curlength >= filelength){
                    // 응답 전송하기
                    res.end();
                }
            });
        }
    });
});