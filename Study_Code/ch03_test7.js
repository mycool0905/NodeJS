var Person = {
    age : 25,
    name : '김완기',
    mobile : '010-9966-2402',
    add : function(a, b){
        return a+b;
    }
};

console.log('더하기 : %d', Person.add(10,21));