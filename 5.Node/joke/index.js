const jokes = require("give-me-a-joke");
const colors = require("colors");
const cowsay = require("cowsay");

jokes.getRandomDadJoke((joke) => {
  console.log(joke.rainbow);
});
