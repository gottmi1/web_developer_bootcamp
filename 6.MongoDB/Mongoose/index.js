const mongoose = require("mongoose");

main()
  .then(() => {
    console.log("CONNECT OPEN");
  })
  .catch((err) => {
    console.log(err);
    console.log("NO CONNECT");
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/movieApp");
}

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String,
});

const Movie = mongoose.model("Movie", movieSchema);
const amadeuse = new Movie({
  title: "amadeuse",
  year: 1986,
  score: 9.2,
  rating: "R",
});

// const blah = new Movie();
// blah.save();

// Movie.insertMany([
//   { title: "도둑들", year: 2022, score: 5.5, rating: "R" },
//   { title: "미친놈들", year: 2011, score: 6.5, rating: "R" },
//   { title: "싸이코들", year: 2002, score: 7.5, rating: "R" },
//   { title: "강도들", year: 2015, score: 8.5, rating: "R" },
//   { title: "무법자들", year: 2012, score: 9.5, rating: "R" },
// ]).then((data) => {
//   console.log("worked");
//   console.log(data);
// });
