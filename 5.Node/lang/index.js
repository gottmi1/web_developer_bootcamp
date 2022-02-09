const franc = require("franc");
const langs = require("langs");

const langsCode = franc("Alle menslike wesens word vry");

const language = langs.where("3", langsCode);
console.log(language);
