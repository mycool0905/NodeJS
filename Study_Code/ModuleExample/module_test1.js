// require() 메소드는 exports 객체를 반환함
var user1 = require('./user1');

function showUser(){
    return user1.getUser().name + ', ' + user1.group.name;
}

console.log('사용자 정보 : %s', showUser());

/* user1.js 파일로 만든 모듈을 사용하기 위해 require() 메소드를 호출한다.
require() 메소드로 불러들인 모듈은 user1 변수에 할당된다. require() 메소드는 exports 객체를 반환하기 때문에 user1 변수는 exports 객체를 참조한다.
이제 user1 변수는 exports 객체와 같다고 볼 수 있으므로 user1 변수에 들어 있는 getUser() 함수를 호출할 수 있다.
showUser() 함수는 콘솔 창에 로그를 출력하는 간단한 기능을 수행한다.
showUser() 함수 안에 들어 있는 코드는 user 변수의 getUser() 메소드를 호출하여 반환받은 객체의 name 속성을 참조하여 사용자의 이름을 알아낸다.
그리고 group 객체의 name 속성을 참조하여 그룹 이름을 알아낸 후 두 개의 문자열을 나란히 붙여서 반환합니다.
module_test1.js 파일을 실행하면 콘솔 창에서 다음과 같은 결과를 볼 수 있다.
*/