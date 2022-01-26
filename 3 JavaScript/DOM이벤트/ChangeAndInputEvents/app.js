const input = document.querySelector("input");
const h1 = document.querySelector("h1");

// input.addEventListener('change', function (e) {
//     console.log("CASKDJASKJHD")
// })
console.log("Welcome, ".length);

input.addEventListener("input", function (e) {
  console.log(e);
  h1.innerText = input.value;
  console.log(input.value.length);
});
