const container = document.querySelector("#container");
const baseURL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

for (let i = 1; i < 200; i++) {
  const pokemon = document.createElement("div");
  pokemon.style.display = "inline-block";
  pokemon.style.textAlign = "center";

  const newImg = document.createElement("img");
  newImg.src = `${baseURL}${i}.png`;

  const label = document.createElement("span");
  label.textContent = `#${i}`;

  pokemon.appendChild(newImg);
  pokemon.appendChild(label);
  container.appendChild(pokemon);
}
