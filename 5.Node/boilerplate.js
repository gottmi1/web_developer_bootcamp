const fs = require("fs");
const folderName = process.argv[2] || "project";

console.log(fs);

// fs.mkdir("jinwon", { recursive: true }, (err) => {
//   console.log("콜백 안");
//   if (err) throw err;
// }); //비동기버전

fs.mkdirSync(folderName);
fs.writeFileSync(`${folderName}/index.html`);
fs.writeFileSync(`${folderName}/app.js`);
fs.writeFileSync(`${folderName}/style.css`);
console.log("으윽");
