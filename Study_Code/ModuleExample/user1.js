// exports 객체 속성으로 함수 추가
exports.getUser = function(){
    return {id : 'test01', name : '소녀시대'};
}

// exports 객체 속성으로 객체 추가
exports.group = {id : 'group01', name : '친구'};

/* exports에 속성 두 개가 추가되었습니다. 첫 번째 속성은 getUser 속성이며 속성의 값으로 함수가 할당되었다.
이 함수는 id와 name 속성을 가진 객체를 반환하는데, 사용자 정보를 객체로 반환받아 확인하려고 만든 함수이다.
두 번째 속성은 group 속성이며 id와 name 속성을 가진 객체가 할당되었다.
이것은 그룹의 아이디와 이름을 알 수 있도록 만든 객체이다. 이렇게 만든 모듈 파일은 module_test1.js 파일에서 불러들여 사용한다.*/