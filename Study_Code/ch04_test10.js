var output = '안녕 1!';
var buffer1 = new Buffer(10);
var len = buffer1.write(output, 'utf8'); // buffer1에 output 문자열을 넣는데 문자열의 길이를 len에 리턴
console.log('첫 번째 버퍼의 문자열 : %s',buffer1.toString()); // buffer1을 String 객체로 바꾸기

// 버퍼 객체를 문자열을 이용해 만든다.
var buffer2 = new Buffer('안녕 2!', 'utf8');
console.log('두 번째 버퍼의 문자열 : %s',buffer2.toString());

// 타입을 확인
console.log('버퍼 객체의 타입 : %s', Buffer.isBuffer(buffer1));

// 버퍼 객체에 들어 있는 문자열 데이터를 문자열 변수로 만든다.
var byteLen = Buffer.byteLength(output);
var str1 = buffer1.toString('utf8', 0, byteLen);
var str2 = buffer2.toString('utf8');

// 첫 번째 버퍼 객채의 문자열을 두 번째 버퍼 객체로 복사한다.
buffer1.copy(buffer2, 0,0, len); // buffer1에 있는 문자열을 buffer2로 옮긴다.
console.log('두 번째 버퍼에 복사한 후의 문자열 : %s', buffer2.toString('utf8'));

// 두 개의 버퍼를 붙여 준다.
var buffer3 = Buffer.concat([buffer1,buffer2]); // Buffer.concat() 안에는 Array를 넣어주기 때문에
console.log('두 개의 버퍼를 붙인 후의 문자열 : %s', buffer3.toString('utf8'));