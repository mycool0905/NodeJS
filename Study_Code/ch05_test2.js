var http = require('http');

// 웹 서버 객체를 만든다.
var server = http.createServer();

// 웹 서버를 시작하여 3000번 포트에서 대기하도록 설정한다.
var port = 3000;
server.listen(port,function(){
    console.log('웹 서버가 시작되었습니다. : %d', port);
});

// 클라이언트 연결 이벤트 처리
server.on('connection',function(socket){
    var addr = socket.address();
    console.log('클라이언트가 접속했습니다. : %s, %d', addr.address, addr.port);
});

// 클라이언트 요청 이벤트 처리
server.on('request', function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.');
    
    /* 응답으로 보낼 헤더를 만든다 */
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    /* 응답 본문(body) 데이터를 만든다. write 여러 번 호출 가능 */
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write(" <head>");
    res.write("     <title>응답 페이지</title>");
    res.write(" </head>");
    res.write(" <body>");
    res.write("     <h1>노드제이에스로부터의 응답 페이지</h1>");
    res.write(" </body>");
    res.write("</html>");
    /* 클라이언트로 응답을 전송한다.*/
    /* end() 파라미터에 데이터가 들어 있다면 이 데이터를 포함시켜 응답을 전송한다.*/
    /* 클라이언트의 요청이 있을 때 한 번은 호출되어야 응답을 보내며,
    콜백 함수가 지정되면 응답이 전송된 후 콜백 함수가 호출된다.*/
    res.end();
});

server.on('close',function(){
    console.log('서버가 종료됩니다.');
});