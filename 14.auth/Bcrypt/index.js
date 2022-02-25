const bcrypt = require("bcrypt");

// const hashPassword = async (pw) => {
//   const salt = await bcrypt.genSalt(10); // 매개변수는  slatRounds인데, 이 숫자를 올릴수록 실행되는데 더 오랜 시간이 걸린다
//   const hash = await bcrypt.hash(pw, salt);
//   console.log(salt);
//   console.log(hash);
//   // 매번 다른 salt가 바뀌기 때문에 다른 값이 출력된다.
// };

// hashPassword("jinwon");
// 이걸 저장하고 데이터베이스로 저장했다고 가정했을 때
// login("jinwon", "$2b$10$kDXYbgMgI9dd3B4Zrfzp1OtAaKtT2AeYjYvIaUSPWQ9.5N2cR2tzm");
// login

const login = async (pw, hashedPw) => {
  // pw = 순수 문자열 hashedPw = hash된 후의 문자열
  const result = await bcrypt.compare(pw, hashedPw); // compare는 pw와 hashedPw가 매치하는지 검사하고 true,false를 반환
  if (result) {
    console.log("login");
  } else {
    console.log("틀림");
  }
};

const hashPassword = async (pw) => {
  // const salt = await bcrypt.genSalt(10); // 매개변수는  slatRounds인데, 이 숫자를 올릴수록 실행되는데 더 오랜 시간이 걸린다. .hash를 사용하면 굳이 따로 뺄 필요가 없다
  const hash = await bcrypt.hash(pw, 12); // salt가 들어갈 자리에 숫자 입력하면 한번에 됨
  console.log(hash);
  // 매번 다른 salt가 바뀌기 때문에 다른 값이 출력된다.
};
// hashPassword("taeyeon");
login(
  "taeyeon",
  "$2b$12$eDYoqRs6s1ChV3uI8C.CHuRv22/j1Y6gAgkpX4KXRobK9d/cKtjYa"
);
