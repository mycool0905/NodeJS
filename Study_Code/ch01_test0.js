var result = 0;

console.time('duration');

for(var i=1;i<=100000;i++)
    result += i;

console.timeEnd('duration');
console.log('1 부터 100000 까지 더한 결과물 : %d',result);

console.log('현재 실행한 파일의 이름 : %s',__filename);
console.log('현재 실행한 파일의 패스 : %s',__dirname);

var Person = {name:'소녀시대', age:20, res:'old', act:'breaking down'};
console.dir(Person);

console.log('argv 속성의 파라미터 수 : ' + process.argv.length);
console.dir(process.argv);
console.log(process.env['OS']);

var arr = ['안녕하세여','김완기입니다','반갑습니다','나이스투미츄'];

arr.forEach(function(item,index){
    console.log(index + ' : ' + item + '의 첫번째 문자 : ' + item[1]);
})