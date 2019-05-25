var Person = {};

Person['age'] = 25;
Person['name'] = '김완기';
Person.add = function(a,b){
    return a+b;
};

console.log('더하기 : %d',Person.add(1,2));