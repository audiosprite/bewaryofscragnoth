const rita = require('rita');

const phrase1 = "don't cheat on tests";
const phrase2 = 'my nemesis gary is a cheat';

console.log(rita.RiTa.getPosTagsInline(phrase1));
console.log(rita.RiTa.getPosTagsInline(phrase2));