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
  await mongoose.connect("mongodb://localhost:27017/shopApp");
}

const personSchema = new mongoose.Schema({
  first: String,
  last: String,
});

personSchema.virtual("fullName").get(function () {
  return `${this.first} ${this.last}`;
});

personSchema.pre("save", async function () {
  this.first = "YO";
  this.last = "MAMMA";
  // 이렇게 하면 어떤 걸 .save 하든 first : Yo last : Mamma가 db에 저장된다
  console.log("About to Save");
});
personSchema.post("save", async function () {
  console.log("Just Saved");
});

const Person = mongoose.model("Person", personSchema);
