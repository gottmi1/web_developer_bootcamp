const fakeReq = (url) => {
  return new Promise((resolve, reject) => {
    const rand = Math.random();
    setTimeout(() => {
      if (rand < 0.5) {
        resolve("성공");
      } else {
        reject("실패");
      }
    }, 1000);
  });
};

fakeReq("google.come")
  .then((data) => {
    console.log(data);
  })
  .catch((data) => {
    console.log(data);
  });
