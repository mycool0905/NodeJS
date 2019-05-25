var http = require('http');

// 클라이언트의 요청을 처리하는 콜백 함수를 파라미터로 전달한다.
var server = http.createrServer(function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.');
    
    
})