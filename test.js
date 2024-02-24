const fs = require("fs");

const aliases = JSON.parse(fs.readFileSync("./aliases.json"));

console.log(aliases);