const button = document.querySelector("button");
const h1 = document.querySelector("h1");
document.body.style.transition = "500ms";
button.addEventListener("click", () => {
  h1.innerText = randomColor();
  document.body.style.backgroundColor = randomColor();
});

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};
