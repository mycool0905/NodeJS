var Person = {};

Person['age'] = 25;
Person['name'] = '김완기';
var oper = function(a,b){
    return a+b;
};

Person['add'] = oper;

console.log('더하기 : %d',Person.add(12,2));