module.exports = (func) => {
  // 새로운 함수를 리턴하여 func가 실행되고 에러를 catch해 next에 전달한다.
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
