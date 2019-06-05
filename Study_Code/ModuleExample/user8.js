/*사용 패턴 : module.exports에 인스턴스 객체를 만들어 할당함*/

// 생성자 함수
function User(id, name){
    this.id = id;
    this.name = name;
}

User.prototype.getUser = function(){
    return {id:this.id, name:this.name};
}

User.prototype.group = {id : 'group1', name : '친구'};

User.prototype.printUser = function(){
    console.log('user 이름 : %s, group 이름 : %s', this.name, this.group.name);
}
module.exports = new User('test01','소녀시대');
/*자바스크립트에서는 함수를 생성자로 지정하여 객체를 정의하고, 그 객체를 사용해 인스턴스 객체를 만들 수 있다.
만약 User 객체를 만들고 싶다면 User라는 이름의 함수를 먼저 정의한다.

this 객체 또는 User.prototype 객체에 속성으로 함수나 값 추가 가능하다*/

