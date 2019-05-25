var fs = require('fs');

var inname = './output.txt';
var outname = './output2.txt';

/* 비동기 방식으로 작성한다 */
fs.exists(outname, function(exists){ // exists 메소드로 이미 outname이라는 파일명이 존재하는지 확인
    if(exists){ // 확인 한다면
        fs.unlink(outname, function(err){ // 해당 outname의 파일 삭제 : unlink 메소드
            if(err) throw err; // 만약에 error가 발생한다면 err
            console.log('기존 파일 [' + outname +'] 삭제함.'); // 삭제했다고 표시
        });
    }
    var infile = fs.createReadStream(inname, {flags: 'r'}); // ReadStream
    var outfile = fs.createWriteStream(outname, {flags: 'w'}); // WriteStream
    infile.pipe(outfile); // pipe로 filestream(Read -> Write) 두 개 연결
    console.log('파일 복사 [' + inname +'] -> [' + outname + ']');
});